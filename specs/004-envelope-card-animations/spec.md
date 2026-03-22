# Spec 004: Cải thiện EnvelopeCard Animations

## Trạng thái: Đang lên kế hoạch

## Tóm tắt

Sửa 3 vấn đề trên component `EnvelopeCard.tsx`:
1. Card content không hiển thị khi mở thiệp
2. Hiệu ứng trái tim xấu, cần thay bằng particle burst
3. Nắp thiệp đóng đè lên card trước khi card kết thúc animation

---

## Vấn đề 1: Card content bị che khuất

### Phân tích nguyên nhân

**Ảnh template mẫu:** Card nhô lên gần hết chiều cao, hiển thị rõ ràng: "Thiệp mời cưới", tên cặp đôi, ngày cưới, lời mời.

**Ảnh local hiện tại:** Card chỉ nhô ~98px, phần lớn nội dung bị pocket (z-index: 3) che khuất. Chỉ thấy phần ảnh nền ở đỉnh card.

**Root cause — 2 yếu tố:**

1. **`CARD_RISE` quá nhỏ:** Card cao ≈ 193px (90% của ENV_H=215px), nhưng `CARD_RISE = 98px` — card chỉ nhô ~50% chiều cao. Phần dưới card (chứa text) vẫn nằm sau pocket.

2. **Pocket z-index luôn = 3 > Card z-index = 2:** Dù card nhô lên, phần nào của card nằm trong vùng envelope đều bị pocket che. Với CARD_RISE=98, gần nửa card vẫn nằm sau pocket → text content hoàn toàn bị che.

### Giải pháp

**Tăng `CARD_RISE` lên ~170px** để card nhô lên gần hết chiều cao, giống template mẫu. Card sẽ chỉ còn ~23px nằm trong envelope (giữ kết nối thị giác rằng card "thuộc về" phong bì).

```
Trước:  CARD_RISE = 98    → card nhô 51% → text bị che
Sau:    CARD_RISE = 170   → card nhô 88% → text hiển thị đầy đủ
```

**Cập nhật `wrapperH`** tương ứng: `ENV_H + CARD_RISE + 10` sẽ tự động tăng theo.

### Thay đổi cụ thể

| File | Dòng | Thay đổi |
|------|------|----------|
| `EnvelopeCard.tsx` | L29 | `CARD_RISE = 98` → `CARD_RISE = 170` |

> **Lưu ý:** Có thể cần điều chỉnh fine-tune giá trị sau khi test trên mobile viewport (390x844). Giá trị 170 là ước tính dựa trên template, có thể ±10px.

---

## Vấn đề 2: Hiệu ứng trái tim cần thay thế hoàn toàn

### Phân tích hiện trạng

Hiện tại: 3 trái tim CSS cố định, float lên trên theo đường thẳng với sway nhẹ. Kích thước scale 0.6/1.0/0.8. Hiệu ứng đơn điệu, không tạo cảm giác "celebration".

### Giải pháp: Heart Burst Particle System

Thay thế toàn bộ hệ thống 3 trái tim bằng **particle burst** — nhiều trái tim (12-18) bắn ra từ vị trí con dấu (wax seal) khi mở thiệp, với:

#### Đặc tả kỹ thuật

**Số lượng:** 12-18 trái tim (randomized mỗi lần mở)

**Kích thước đa dạng:**
- Nhỏ: 8-12px (40% số lượng)
- Trung bình: 14-20px (40% số lượng)
- Lớn: 22-28px (20% số lượng)

**Màu sắc:** Gradient từ đỏ → hồng, mỗi trái tim một shade ngẫu nhiên:
- `#d00000` (đỏ đậm)
- `#e63946` (đỏ tươi)
- `#f4a0b5` (hồng nhạt)
- `#ff6b81` (hồng đậm)
- `#c1121f` (đỏ sẫm)

**Trajectory (đường bay):**
- Xuất phát: Tâm envelope (vị trí wax seal, ~50% width, ~50% height)
- Hướng: Phân bố đều 360° (hoặc ưu tiên bán cầu trên 70%, bán cầu dưới 30%)
- Khoảng cách bay: 80-250px (random per heart)
- Đường cong: cubic-bezier tạo cảm giác "bắn ra rồi rơi nhẹ"

**Animation per heart:**
```
Phase 1 — Burst (0-400ms):
  - scale: 0 → 1.2 → target_scale
  - opacity: 0 → 1
  - position: center → target (radial outward)
  - easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Phase 2 — Float & Fade (400ms-2500ms):
  - translateY: drift upward 30-80px
  - rotate: random(-30deg, 30deg) oscillation
  - opacity: 1 → 0
  - scale: target → target * 0.6
  - easing: ease-out
```

**Stagger:** Mỗi trái tim delay 30-80ms (tạo cảm giác burst tự nhiên, không đồng loạt)

#### Cách triển khai

**Approach:** Generate mảng hearts config với `useMemo` + random values, render bằng CSS animations với `@keyframes` dynamic (CSS custom properties per heart).

**Lý do chọn CSS animations thay vì Motion.js:**
- Hiệu năng tốt hơn cho nhiều phần tử nhỏ (compositor thread)
- Không cần JS frame-by-frame cho trajectory đơn giản
- Consistent với approach hiện tại của EnvelopeCard (toàn bộ dùng CSS transitions/keyframes)

**Cấu trúc code:**

```tsx
// Thay thế toàn bộ block hearts (L398-L473)

interface HeartParticle {
  id: number
  size: number        // 8-28px
  color: string       // random from palette
  angle: number       // 0-360 degrees (hướng bay)
  distance: number    // 80-250px (khoảng cách bay)
  delay: number       // 0-80ms (stagger)
  duration: number    // 1800-2500ms (tổng thời gian)
  drift: number       // 30-80px (float upward sau burst)
  rotation: number    // -30 to 30 degrees
}

function generateHearts(count: number): HeartParticle[] { ... }
```

**Heart shape:** Giữ nguyên CSS `::before/::after` trick hiện tại nhưng sử dụng biến `--heart-size` thay vì hardcode 28x45px. Hoặc chuyển sang SVG heart inline cho đơn giản hơn:

```tsx
// SVG heart - dễ scale, dễ color
<svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
           2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
           C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>
```

> **Khuyến nghị:** Dùng SVG heart vì: (1) scale chính xác mọi kích thước, (2) fill color đơn giản, (3) không cần pseudo-elements phức tạp.

### Thay đổi cụ thể

| File | Dòng | Thay đổi |
|------|------|----------|
| `EnvelopeCard.tsx` | L398-L473 | Xóa toàn bộ block hearts cũ (3 hearts CSS shape) |
| `EnvelopeCard.tsx` | — | Thêm `generateHearts()` function + `HeartParticle` interface |
| `EnvelopeCard.tsx` | — | Thêm component render hearts burst (SVG hearts + CSS keyframes) |
| `EnvelopeCard.tsx` | L527-L574 | Xóa CSS `.heart-shape`, `.heart-wrap`, `heartScaleWrap`, `heartFloat`, `sideSway` |
| `EnvelopeCard.tsx` | — | Thêm CSS `@keyframes heartBurst` và `@keyframes heartFade` (sử dụng CSS custom properties) |

---

## Vấn đề 3: Nắp thiệp đóng đè lên card khi closing

### Phân tích nguyên nhân

**Sequence hiện tại khi `closing`:**

```
T=0ms:    state='closing'
          → flap z-index: 5 (NGAY LẬP TỨC, vì isClosed || isClosing ? 5 : 1)
          → card bắt đầu descend: 0.2s delay + 0.6s animation = 0.8s
          → flap bắt đầu đóng: 0.8s delay + 0.8s animation = 1.6s

T=0ms:    ❌ BUG: Flap z-index nhảy từ 1→5 ngay lập tức
          → Flap (z:5) đè lên card (z:2) TRƯỚC khi card descend xong
          → Card đang ở vị trí nhô lên, bị flap che mất → hiệu ứng xấu

T=800ms:  Card vừa descend xong
T=800ms:  Flap bắt đầu rotate đóng (delay 0.8s)
T=1600ms: Flap đóng xong → state='closed'
```

**Vấn đề cốt lõi:** `z-index` thay đổi đồng bộ với state, không chờ card animation kết thúc.

### Giải pháp: Thêm state `closing-card` trung gian

Tách phase closing thành 2 bước:

```
closing-card:  Card descend + flap vẫn mở (z-index thấp)
closing-flap:  Card đã vào trong → flap đóng lại (z-index cao)
```

#### Đặc tả state machine mới

```
States: 'closed' | 'opening' | 'open' | 'closing-card' | 'closing-flap'

Transitions:
  closed    → opening       (click)
  opening   → open          (after 1700ms)
  open      → closing-card  (click)
  closing-card → closing-flap (after 900ms — card descend xong)
  closing-flap → closed     (after 1000ms — flap đóng xong)
```

#### Chi tiết timing

```
Khi user click đóng (state: open → closing-card):

T=0ms:      state = 'closing-card'
            Card: bắt đầu descend (0.2s delay + 0.6s = 0.8s)
            Flap: VẪN mở (z-index: 1, rotateX: 180deg)

T=900ms:    state = 'closing-card' → 'closing-flap'  (setTimeout)
            Card: đã descend xong (ở vị trí gốc bên trong envelope)
            Flap: z-index → 5, bắt đầu rotateX: 180→0 (0.8s animation)

T=1900ms:   state = 'closing-flap' → 'closed'  (setTimeout)
            Hoàn thành chu trình.

Tổng: 1.9s (vs 1.6s hiện tại — thêm 0.3s nhưng mượt mà hơn nhiều)
```

#### Z-index logic mới

```tsx
// Flap z-index
const flapZ = (isClosed || isClosingFlap) ? 5 : 1

// Card z-index
const cardZ = (isOpen || isOpening || isClosingCard) ? 2 : 1

// Flap transform
const flapOpen = isOpening || isOpen || isClosingCard  // Flap vẫn mở trong closing-card
```

### Thay đổi cụ thể

| File | Dòng | Thay đổi |
|------|------|----------|
| `EnvelopeCard.tsx` | L22 | Type `EnvelopeState` thêm `'closing-card' \| 'closing-flap'` |
| `EnvelopeCard.tsx` | L41-L58 | `handleClick`: closing branch → set `'closing-card'`, setTimeout chain 2 bước |
| `EnvelopeCard.tsx` | L60-L68 | Cập nhật derived booleans: `isClosingCard`, `isClosingFlap`, `flapOpen` includes `isClosingCard` |
| `EnvelopeCard.tsx` | L361 | Flap z-index: `isClosed \|\| isClosingFlap ? 5 : 1` |
| `EnvelopeCard.tsx` | L213 | Card z-index: `isOpen \|\| isOpening \|\| isClosingCard ? 2 : 1` |
| `EnvelopeCard.tsx` | L219-L221 | Card transition: thêm case `isClosingCard` |

---

## Tổng hợp thay đổi

### File duy nhất: `src/app/components/EnvelopeCard.tsx`

**Thứ tự triển khai (quan trọng):**

1. **Fix #3 trước** (state machine) — vì ảnh hưởng đến derived booleans mà #1 và #2 phụ thuộc
2. **Fix #1** (CARD_RISE) — thay đổi nhỏ, 1 constant
3. **Fix #2 cuối** (hearts) — thay đổi lớn nhất, độc lập logic

### Checklist triển khai

- [ ] **Step 1:** Mở rộng `EnvelopeState` type thêm `'closing-card' | 'closing-flap'`
- [ ] **Step 2:** Cập nhật `handleClick` — closing flow 2 phase với setTimeout chain
- [ ] **Step 3:** Cập nhật derived booleans (`isClosingCard`, `isClosingFlap`, `flapOpen`)
- [ ] **Step 4:** Cập nhật z-index logic cho flap và card
- [ ] **Step 5:** Cập nhật card/flap transitions cho states mới
- [ ] **Step 6:** Cập nhật `wrapperH` logic cho states mới
- [ ] **Step 7:** Tăng `CARD_RISE` = 170 (hoặc giá trị phù hợp sau test)
- [ ] **Step 8:** Xóa hearts cũ (HTML + CSS)
- [ ] **Step 9:** Thêm `HeartParticle` interface + `generateHearts()`
- [ ] **Step 10:** Thêm hearts burst render (SVG hearts + CSS keyframes)
- [ ] **Step 11:** Test trên mobile viewport 390x844
- [ ] **Step 12:** Fine-tune CARD_RISE, heart count, timing nếu cần

### Ước lượng impact

- **Không breaking change:** State machine mở rộng, không thay đổi API (`onOpen` callback giữ nguyên)
- **Không ảnh hưởng components khác:** EnvelopeCard là self-contained
- **CSS keyframes mới:** Thêm ~30 dòng, xóa ~50 dòng hearts cũ
- **Performance:** SVG hearts nhẹ hơn CSS pseudo-element hearts, compositor-friendly animations

---

## Tham chiếu

- Template mẫu: `src/app/components/template-envelope-card.png`
- Ảnh hiện tại: `src/app/components/local-envelope-card.png`
- Component: `src/app/components/EnvelopeCard.tsx`
- Animation reference: cinelove.me/template/pc/thiep-cuoi-48
