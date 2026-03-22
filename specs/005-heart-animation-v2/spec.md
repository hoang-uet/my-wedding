# Feature Specification: Real-time Heart Blessings Animation

**Feature ID**: 005-heart-animation-v2
**Created**: 2026-03-22
**Status**: Chưa triển khai
**Dependencies**: Supabase Realtime (Broadcast), Canvas API, `motion/react`

---

## Tổng quan

Nâng cấp nút "Bắn tim" trong FloatingBar từ hiệu ứng cục bộ (7 SVG hearts, CSS keyframes, 900ms) thành trải nghiệm **TikTok-style Live Interaction** — hàng trăm trái tim bay lên với quỹ đạo S-curve tự nhiên, đồng bộ realtime giữa tất cả khách mời đang truy cập thiệp.

### Nguyên tắc cốt lõi

- **Performance-first:** 60fps trên mobile mid-range (Snapdragon 6-series / A15), zero jank
- **Battery-conscious:** Animation loop chỉ chạy khi có particle active, idle = 0 CPU
- **Lightweight:** Không thêm thư viện ngoài — sử dụng Canvas 2D API native + Supabase Broadcast (đã có)
- **Non-intrusive:** Hearts nằm dưới UI tương tác (buttons, inputs), không che nội dung chính
- **Zero DB cost:** Broadcast mode = peer-to-peer qua Supabase Realtime, không INSERT vào database

---

## A. User Experience

### User Flow

```
Khách A click "Bắn tim"
        │
        ▼
  Client-side throttle check
  (max 3 clicks / 2 giây)
        │
        ├── Bị throttle → Ignore, nút vẫn hoạt động nhưng không gửi thêm
        │
        └── Cho phép
                │
                ▼
          Spawn 5-8 hearts local (phản hồi tức thì, không chờ network)
                │
                ▼
          Batch clicks trong 300ms window
                │
                ▼
          Broadcast: { count: N } qua Supabase Realtime
                │
                ▼
  ┌─────────────────────────────────────────────┐
  │ Khách B, C, D... đang online                │
  │ Nhận broadcast → spawn hearts tương ứng     │
  │ Batch rendering nếu nhiều events cùng lúc   │
  └─────────────────────────────────────────────┘
```

### Visual Design

- **Hình dạng:** Trái tim SVG path (tái sử dụng path hiện có: `M12 21.35l-1.45-1.32C5.4 15.36...`)
- **Palette:** 8 sắc độ đỏ/hồng/coral, hài hòa với theme cưới:
  ```
  #E87461  (coral chính — từ palette hiện tại)
  #F5A3A3  (hồng nhạt — từ palette hiện tại)
  #D4856A  (warm accent — từ palette hiện tại)
  #E8B4A0  (peach — từ palette hiện tại)
  #F0C0C0  (blush — từ palette hiện tại)
  #d00000  (đỏ đậm — từ EnvelopeCard)
  #e63946  (đỏ tươi — từ EnvelopeCard)
  #ff6b81  (hồng neon — từ EnvelopeCard)
  ```
- **Kích thước:** 10–26px (phân bố: 40% nhỏ 10-14px, 40% vừa 16-20px, 20% lớn 22-26px)
- **Opacity:** Khởi đầu 0.7–0.9, fade out dần → 0 khi kết thúc
- **Không che nội dung:** Opacity thấp + z-index dưới interactive elements

---

## B. Frontend Architecture

### B1. Animation Engine — Canvas 2D API

**Lý do chọn Canvas thay vì DOM/SVG:**

| Approach | 100 particles | 300 particles | Bundle cost |
|----------|--------------|--------------|-------------|
| DOM + CSS keyframes (hiện tại) | ~45fps, 100 DOM nodes | Jank, layout thrash | 0 KB |
| Motion.js (đã có) | ~50fps, overhead per element | Lag trên mobile | 0 KB |
| **Canvas 2D** | **60fps, 1 element** | **60fps, 1 element** | **0 KB** |
| WebGL/Three.js | 60fps | 60fps | **+150KB** ❌ |

Canvas 2D là lựa chọn tối ưu: zero bundle cost, single DOM element, draw call batching tự nhiên, và có thể render hàng trăm particles mà không tạo thêm DOM nodes.

### B2. Particle System

#### Heart Particle Interface

```typescript
interface HeartParticle {
  // Identity
  id: number

  // Position & movement
  x: number           // Current X position (px)
  y: number           // Current Y position (px)
  startX: number      // Spawn X position
  startY: number      // Spawn Y = canvas height (bottom)

  // S-curve trajectory
  amplitude: number   // Sway amplitude (15-45px)
  frequency: number   // Sway frequency (0.8-1.5 cycles over lifetime)
  phase: number       // Random phase offset (0 - 2π)

  // Visual properties
  size: number        // 10-26px
  color: string       // From palette
  opacity: number     // Current opacity (0-1)
  rotation: number    // Current rotation (radians)
  rotationSpeed: number // Rotation speed (rad/frame)

  // Lifecycle
  speed: number       // Rise speed (1.5-3.5 px/frame)
  life: number        // Current life (0 → 1)
  maxLife: number     // Total lifetime in frames (90-180 frames = 1.5-3s @60fps)
  fadeStart: number   // Start fading at this life ratio (0.6-0.8)
}
```

#### Trajectory Physics — S-curve

Mỗi heart di chuyển theo quỹ đạo S-curve tự nhiên:

```
x(t) = startX + amplitude × sin(frequency × π × t + phase)
y(t) = startY - speed × t × maxLife
opacity(t) = t < fadeStart ? initialOpacity : initialOpacity × (1 - (t - fadeStart) / (1 - fadeStart))
rotation(t) = rotationSpeed × t × maxLife
```

Trong đó `t = life / maxLife` (0 → 1).

**Tham số ngẫu nhiên hóa:**

| Parameter | Range | Distribution | Mục đích |
|-----------|-------|-------------|----------|
| `startX` | 15% – 85% canvas width | Uniform | Tránh tập trung giữa, tránh sát mép |
| `amplitude` | 15 – 45px | Uniform | Độ lắc ngang |
| `frequency` | 0.8 – 1.5 | Uniform | Số lần đổi hướng |
| `phase` | 0 – 2π | Uniform | Offset để không đồng pha |
| `speed` | 1.5 – 3.5 px/frame | Uniform | Tốc độ bay lên |
| `size` | 10 – 26px | Weighted (40/40/20) | Đa dạng kích thước |
| `rotation` | -0.03 – 0.03 rad/frame | Uniform | Xoay nhẹ tự nhiên |
| `maxLife` | 90 – 180 frames | Uniform | 1.5s – 3s lifetime |
| `fadeStart` | 0.6 – 0.8 | Uniform | Bắt đầu mờ dần |
| `initialOpacity` | 0.7 – 0.9 | Uniform | Không quá đậm |

### B3. Canvas Component Architecture

```
src/app/components/
  HeartCanvas.tsx          # Canvas renderer + particle system
  useHeartBroadcast.ts     # Supabase Broadcast hook
  FloatingBar.tsx           # Tích hợp: thay thế shootHearts cũ
```

#### HeartCanvas Component

```typescript
// src/app/components/HeartCanvas.tsx

interface HeartCanvasProps {
  /**
   * Khi nhận signal > 0, spawn thêm N hearts.
   * Component tự reset signal về 0 sau khi xử lý.
   */
  spawnSignal: number
  /** Max particles trên màn hình cùng lúc */
  maxParticles?: number  // default: 150
}
```

**Rendering pipeline mỗi frame:**

```
requestAnimationFrame
  │
  ├── 1. Check spawnSignal → tạo N particles mới (nếu < maxParticles)
  │
  ├── 2. Update mỗi particle:
  │       life += 1
  │       x = S-curve formula
  │       y -= speed
  │       opacity = fade formula
  │       rotation += rotationSpeed
  │
  ├── 3. Remove particles có life >= maxLife
  │
  ├── 4. Clear canvas
  │
  ├── 5. Draw mỗi particle:
  │       ctx.save()
  │       ctx.translate(x, y)
  │       ctx.rotate(rotation)
  │       ctx.globalAlpha = opacity
  │       ctx.scale(size/24, size/24)
  │       drawHeartPath(ctx, color)  // Pre-created Path2D
  │       ctx.restore()
  │
  └── 6. Nếu particles.length === 0 → STOP rAF loop (idle = 0 CPU)
         Khi có spawnSignal mới → restart rAF loop
```

**Tối ưu hiệu năng:**

- **Pre-created Path2D:** Heart path tạo 1 lần, reuse cho mọi particles
- **No allocation in loop:** Particle array dùng object pool (recycle dead particles thay vì GC)
- **Idle stop:** `requestAnimationFrame` chỉ chạy khi có particles active
- **Device pixel ratio:** Canvas resolution match `window.devicePixelRatio` cho sharp rendering
- **Offscreen check:** Skip draw cho particles ngoài viewport

#### Heart SVG Path (vẽ trên Canvas)

```typescript
// Tạo 1 lần, reuse
const HEART_PATH = new Path2D(
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
)
```

### B4. Z-index Management

```
Layer stack (thấp → cao):
─────────────────────────────────
z-index: 1-10     Static decorations (hoa, overlay tĩnh)
z-index: 100      HeartCanvas (pointer-events: none)
z-index: 800      Peek overlay (lời chúc)
z-index: 850      ← REMOVED (hearts cũ — thay bằng HeartCanvas z-100)
z-index: 900      FloatingBar bottom bar
z-index: 950      Full messages overlay
z-index: 1000+    Modals, lightbox
─────────────────────────────────
```

HeartCanvas ở z-100: nằm trên nội dung tĩnh, nằm dưới tất cả UI tương tác. `pointer-events: none` đảm bảo không block click/tap.

### B5. Canvas Sizing & Positioning

```typescript
// Canvas phủ toàn bộ phone frame (430px max-width)
<canvas
  style={{
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 100,
  }}
/>
```

Canvas resize theo container (phone frame), không phải window. Sử dụng `ResizeObserver` để update canvas dimensions khi cần.

---

## C. Backend & Real-time — Supabase Broadcast

### C1. Tại sao Broadcast thay vì Database?

| Criteria | DB Insert + Realtime | **Broadcast** |
|----------|---------------------|---------------|
| Latency | ~200-500ms (write → broadcast) | **~50-100ms (direct P2P)** |
| DB load | 1 INSERT per click | **0 DB operations** |
| Cost | Supabase row write + storage | **Free (included in Realtime)** |
| Persistence | Lưu lại mãi mãi (không cần) | Ephemeral (đúng nhu cầu) |
| Complexity | Table + RLS + cleanup | **Channel subscribe only** |

Heart clicks là **ephemeral events** — không cần lưu lại. Broadcast mode gửi trực tiếp giữa các clients qua Supabase Realtime channel mà không chạm database.

### C2. Channel Design

```typescript
// Channel name: dùng chung 1 channel cho toàn bộ thiệp
const CHANNEL_NAME = 'hearts'

// Event name
const EVENT_NAME = 'heart_burst'

// Payload (nhỏ nhất có thể)
interface HeartBurstPayload {
  /** Số hearts cần spawn (1-15, đã batch từ client) */
  c: number
}
```

**Payload chỉ 1 field** (`c` = count) vì:
- Không cần biết ai bắn (anonymous)
- Không cần vị trí cụ thể (mỗi client tự random)
- Không cần timestamp (xử lý ngay khi nhận)

### C3. Hook: `useHeartBroadcast`

```typescript
// src/app/components/useHeartBroadcast.ts

interface UseHeartBroadcastReturn {
  /** Gọi khi user click "Bắn tim". Tự batch + throttle. */
  sendHearts: () => void
  /** Số hearts cần spawn (từ remote). Reset về 0 sau khi HeartCanvas xử lý. */
  remoteSpawnCount: number
  /** Reset remoteSpawnCount về 0 */
  clearRemoteSpawn: () => void
}
```

**Internal logic:**

```
User click "Bắn tim"
        │
        ▼
  Throttle gate: max 3 clicks / 2000ms (sliding window)
        │
        ├── Blocked → return (nút vẫn clickable, chỉ không gửi thêm)
        │
        └── Allowed
                │
                ▼
          Tăng pending count (+1)
          Start/reset batch timer (300ms debounce)
                │
                ▼
          Sau 300ms không có click mới:
                │
                ▼
          channel.send({
            type: 'broadcast',
            event: 'heart_burst',
            payload: { c: pendingCount }
          })
          Reset pendingCount = 0
```

**Receiving logic:**

```
channel.on('broadcast', { event: 'heart_burst' }, (msg) => {
  const count = Math.min(msg.payload.c, 15)  // Cap tối đa 15/event
  setRemoteSpawnCount(prev => prev + count)
})
```

### C4. Lifecycle

```typescript
// Subscribe khi component mount
useEffect(() => {
  const channel = supabase.channel(CHANNEL_NAME)

  channel
    .on('broadcast', { event: EVENT_NAME }, handleReceive)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## D. Anti-spam & Optimization

### D1. Client-side Throttling

| Rule | Value | Lý do |
|------|-------|-------|
| Max clicks per window | 3 | Cho phép "tap tap tap" nhanh nhưng không spam |
| Window duration | 2000ms | Reset sau 2s không click |
| Batch debounce | 300ms | Gộp multi-tap thành 1 broadcast |
| Max hearts per broadcast | 15 | = 3 clicks × 5 hearts/click |

**Implementation:** Sliding window counter — mỗi click push timestamp vào array, filter expired (> 2000ms), check length < 3.

### D2. Remote Event Batching

Khi nhận nhiều broadcast events liên tiếp (nhiều người bắn cùng lúc):

```typescript
// Gộp events nhận trong 200ms window thành 1 spawn batch
const batchWindowMs = 200
let batchTimer: number | null = null
let batchCount = 0

function handleReceive(msg: { payload: HeartBurstPayload }) {
  batchCount += msg.payload.c

  if (!batchTimer) {
    batchTimer = window.setTimeout(() => {
      // Spawn cả batch cùng lúc → "cơn mưa tim" đồng nhất
      const cappedCount = Math.min(batchCount, 40) // Cap 40 hearts/batch
      setRemoteSpawnCount(prev => prev + cappedCount)
      batchCount = 0
      batchTimer = null
    }, batchWindowMs)
  }
}
```

### D3. Visual Cap — Particle Limit

| Parameter | Value | Lý do |
|-----------|-------|-------|
| `MAX_PARTICLES` | 150 | Safe cho mobile mid-range @60fps |
| Behavior khi đạt cap | Skip spawn mới, chờ particles cũ die | Graceful degradation |
| Emergency cap | 200 | Hard limit, force-remove oldest nếu vượt |

**Benchmark target:** 150 Canvas 2D particles với Path2D + fillStyle switch = ~2ms/frame trên iPhone 12 (A14). Safe budget cho 16.6ms frame (60fps).

### D4. Battery Protection

```
Particles active?
  │
  ├── YES → requestAnimationFrame loop running
  │         (typical: 1-3 seconds per burst)
  │
  └── NO  → rAF loop STOPPED, CPU = 0
            Canvas vẫn mount nhưng không draw
            Chờ spawnSignal > 0 để restart
```

- **Idle cost: 0** — Không có setInterval, không có background loop
- **Active cost: ~2-4ms/frame** — Chỉ trong burst duration (1-3s)
- **Average duty cycle:** < 5% thời gian (phần lớn idle giữa các bursts)

---

## E. Tích hợp vào FloatingBar

### E1. Thay đổi trong FloatingBar.tsx

**XÓA:**
- State `hearts` và `heartIdRef` (line 73-76)
- Function `shootHearts` (line 194-207)
- Heart animation container (DOM elements, line 468-489)
- CSS keyframes `floatingHeart` (line 632-642)

**THÊM:**
- Import `HeartCanvas` component
- Import `useHeartBroadcast` hook
- Render `<HeartCanvas>` ở ngoài FloatingBar (level App hoặc page layout) để cover toàn màn hình
- Nút "Bắn tim" gọi `sendHearts()` từ hook + trigger local spawn

**GIỮ NGUYÊN:**
- Layout bottom bar
- Nút "Bắn tim" UI (icon + text)
- Tất cả logic khác (wishes, scroll, messages overlay)

### E2. Integration Code (Pseudocode)

```typescript
// Trong page component hoặc App.tsx
function WeddingPage() {
  const { sendHearts, remoteSpawnCount, clearRemoteSpawn } = useHeartBroadcast()
  const [localSpawn, setLocalSpawn] = useState(0)

  const handleShootHearts = useCallback(() => {
    // 1. Local feedback ngay lập tức (5-8 hearts)
    const localCount = 5 + Math.floor(Math.random() * 4)
    setLocalSpawn(prev => prev + localCount)
    // 2. Broadcast to others (batched + throttled internally)
    sendHearts()
  }, [sendHearts])

  // Combine local + remote signals
  const totalSpawn = localSpawn + remoteSpawnCount

  // Reset sau khi HeartCanvas xử lý
  useEffect(() => {
    if (totalSpawn > 0) {
      // HeartCanvas sẽ đọc và spawn, sau đó cần reset
      const timer = setTimeout(() => {
        setLocalSpawn(0)
        clearRemoteSpawn()
      }, 50) // Cho HeartCanvas 1 frame để đọc
      return () => clearTimeout(timer)
    }
  }, [totalSpawn, clearRemoteSpawn])

  return (
    <>
      <HeartCanvas spawnSignal={totalSpawn} maxParticles={150} />
      <FloatingBar onShootHearts={handleShootHearts} />
    </>
  )
}
```

### E3. EnvelopeCard Heart Burst — Giữ nguyên

`HeartBurst` trong EnvelopeCard là hiệu ứng **khác biệt** (radial explosion khi mở phong bì) và **không liên quan** đến tính năng realtime hearts. Giữ nguyên hoàn toàn.

---

## F. Acceptance Scenarios

### Cơ bản

1. **Given** khách A mở thiệp, **When** click "Bắn tim" 1 lần, **Then** 5-8 trái tim bay lên từ vùng dưới màn hình theo quỹ đạo S-curve, fade out trong 1.5-3s. Animation mượt 60fps.

2. **Given** khách A click "Bắn tim" nhanh 3 lần liên tiếp, **Then** 15-24 hearts spawn (5-8 mỗi click). Click thứ 4 trong vòng 2s bị bỏ qua (throttle). Sau 2s, cho phép click tiếp.

3. **Given** khách A và B cùng mở thiệp, **When** A click "Bắn tim", **Then** B thấy hearts bay lên trên màn hình của mình trong < 200ms. A cũng thấy hearts local ngay lập tức (< 16ms, không chờ network).

4. **Given** 10 khách cùng bắn tim trong 1 giây, **When** mỗi client nhận ~10 broadcast events, **Then** events được batch thành 1-2 spawn batches, tạo "cơn mưa tim" mượt mà thay vì render rời rạc.

### Hiệu năng

5. **Given** 150 hearts đang hiển thị trên màn hình (max cap), **When** nhận thêm spawn signal, **Then** hearts mới KHÔNG được tạo. Chờ hearts cũ fade out rồi mới spawn thêm. Không có frame drop.

6. **Given** không có ai bắn tim trong 10 giây, **When** tất cả particles đã fade out, **Then** Canvas animation loop dừng hoàn toàn (0 CPU). `requestAnimationFrame` không được gọi.

7. **Given** user đang trên thiết bị yếu (< 4GB RAM), **When** hearts bay, **Then** vẫn giữ >= 30fps nhờ particle limit và Canvas batching.

### Visual

8. **Given** hearts đang bay, **When** user click vào nút "Gửi lời chúc" hoặc bất kỳ interactive element nào, **Then** click hoạt động bình thường — HeartCanvas có `pointer-events: none`, không block interaction.

9. **Given** hearts bay qua vùng text content, **Then** text vẫn đọc được nhờ opacity thấp (0.7-0.9) và hearts kích thước nhỏ (10-26px).

### Edge cases

10. **Given** user mở thiệp khi offline, **When** click "Bắn tim", **Then** hearts local vẫn bay (feedback tức thì). Broadcast fail silently — không hiện lỗi.

11. **Given** user mở thiệp trên 2 tab cùng lúc, **When** bắn tim ở tab 1, **Then** tab 2 nhận hearts qua broadcast như bình thường.

12. **Given** trang vừa load xong và Supabase channel chưa connected, **When** click "Bắn tim", **Then** local hearts vẫn hoạt động. Broadcast sẽ gửi khi channel ready.

---

## G. Implementation Plan

### Phase 1: Canvas Particle System (Core)

**Mục tiêu:** Thay thế DOM-based hearts bằng Canvas renderer.

| Task | Chi tiết | Output |
|------|---------|--------|
| G1.1 | Tạo `HeartCanvas.tsx` — Canvas component với particle system | Component render hearts qua Canvas 2D |
| G1.2 | Implement particle physics: spawn, S-curve trajectory, fade, rotation | Hàm `updateParticle()` và `drawParticle()` |
| G1.3 | Object pool: recycle dead particles thay vì allocate/GC | Pool class với `acquire()` / `release()` |
| G1.4 | Idle stop: dừng rAF khi không có particles | Auto-stop/restart logic |
| G1.5 | Tích hợp vào FloatingBar: xóa DOM hearts cũ, render `<HeartCanvas>` | FloatingBar sạch hơn, hearts mượt hơn |

**Verification:** Click "Bắn tim" → hearts bay lên Canvas @60fps, fade out tự nhiên.

### Phase 2: Supabase Broadcast Integration

**Mục tiêu:** Realtime sync hearts giữa các clients.

| Task | Chi tiết | Output |
|------|---------|--------|
| G2.1 | Tạo `useHeartBroadcast.ts` — hook quản lý broadcast channel | Hook với `sendHearts()`, `remoteSpawnCount` |
| G2.2 | Client-side throttling: sliding window 3 clicks / 2s | Throttle logic trong hook |
| G2.3 | Event batching (send): debounce 300ms, gộp clicks | Batch send logic |
| G2.4 | Event batching (receive): gộp remote events trong 200ms window | Batch receive logic |
| G2.5 | Tích hợp hook vào page component | Local + remote spawn signals |

**Verification:** Mở 2 tab → bắn tim ở tab 1 → tab 2 thấy hearts. Bắn nhanh 5 lần → chỉ gửi 1-2 broadcast.

### Phase 3: Polish & Safety

**Mục tiêu:** Edge cases, mobile optimization.

| Task | Chi tiết | Output |
|------|---------|--------|
| G3.1 | Visual cap: MAX_PARTICLES = 150, emergency cap = 200 | Graceful degradation |
| G3.2 | Canvas resize handling: ResizeObserver + DPR | Sharp trên retina, đúng size |
| G3.3 | Offline resilience: broadcast fail silently | Không hiện error khi offline |
| G3.4 | Cleanup: unmount → remove channel, cancel rAF | No memory leaks |
| G3.5 | Kiểm tra a11y: `prefers-reduced-motion` → giảm/tắt animation | Respect user preference |

**Verification:** Mở trên mobile thật → battery không nóng, scroll mượt, không jank.

---

## H. Files tổng kết

### Files cần tạo mới

```
src/app/components/HeartCanvas.tsx        # Canvas particle renderer
src/app/components/useHeartBroadcast.ts   # Supabase Broadcast hook
```

### Files cần sửa

```
src/app/components/FloatingBar.tsx        # Xóa DOM hearts, thêm onShootHearts prop
src/app/App.tsx (hoặc page component)     # Mount HeartCanvas + wire hook
```

### Files KHÔNG đổi

```
src/app/components/EnvelopeCard.tsx       # HeartBurst giữ nguyên (khác mục đích)
src/app/components/ui/*                   # shadcn/ui library
```

---

## I. Implementation Notes cho Agent

### Performance checklist

- [ ] Sử dụng `Path2D` object tạo 1 lần, KHÔNG tạo mới mỗi frame
- [ ] Object pool cho particles — tránh GC pressure trong animation loop
- [ ] `requestAnimationFrame` phải được cancel khi unmount (`cancelAnimationFrame`)
- [ ] Canvas `width`/`height` attribute phải nhân `devicePixelRatio` (CSS size giữ nguyên)
- [ ] Khi particles = 0, PHẢI dừng rAF loop — kiểm tra bằng Performance tab

### Mobile battery

- [ ] Không có `setInterval` hoặc `setTimeout` loop nào chạy liên tục
- [ ] Broadcast channel subscribe là passive — không tốn CPU khi idle
- [ ] Test: mở thiệp 5 phút không bắn tim → CPU usage = 0% (kiểm tra Safari Web Inspector)

### Supabase Broadcast

- [ ] Channel name phải unique per thiệp (nếu có multiple events): `hearts` đủ cho 1 đám cưới
- [ ] Không cần authentication — broadcast mode hoạt động với anon key
- [ ] `supabase.removeChannel()` khi unmount — tránh stale subscriptions

### Tương thích ngược

- [ ] Nút "Bắn tim" UI giữ nguyên hoàn toàn (icon, text, styling)
- [ ] Nếu Supabase Realtime không khả dụng → hearts local vẫn hoạt động 100%
- [ ] EnvelopeCard `HeartBurst` không bị ảnh hưởng

### Testing approach

- [ ] Manual test trên Chrome DevTools mobile emulator (iPhone 14, Pixel 7)
- [ ] Performance tab: verify rAF stops khi idle
- [ ] Network tab: verify broadcast payload size (< 100 bytes)
- [ ] Mở 2 browser windows: verify realtime sync
