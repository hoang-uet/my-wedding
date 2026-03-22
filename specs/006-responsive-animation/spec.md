# Spec 006: Responsive & Scroll Animation Optimization

> **Trạng thái:** Draft — Chờ duyệt
> **Phạm vi:** Toàn bộ components trong `src/app/components/`
> **Mục tiêu:** Tối ưu responsive layout + nâng cấp scroll animation cho trải nghiệm "Elegant Reveal"
> **Ưu tiên:** Mobile-first (430px), mở rộng dần lên Tablet/Desktop

---

## Mục lục

1. [Audit hiện trạng](#1-audit-hiện-trạng)
2. [Chiến lược Responsive](#2-chiến-lược-responsive)
3. [Scroll Animation — "Elegant Reveal"](#3-scroll-animation--elegant-reveal)
4. [Danh sách lỗi & kế hoạch sửa chữa](#4-danh-sách-lỗi--kế-hoạch-sửa-chữa)
5. [Chỉ dẫn kỹ thuật cho Agent](#5-chỉ-dẫn-kỹ-thuật-cho-agent)

---

## 1. Audit hiện trạng

### 1.1 Tổng quan kiến trúc hiện tại

Dự án sử dụng **phone frame wrapper** (`App.tsx`) với `maxWidth: 430px` + `overflow: hidden`. Mọi component con đều render bên trong container này. Đây là nền tảng tốt, nhưng có những hạn chế cần giải quyết.

**Hệ thống animation hiện tại:**

| Cơ chế | File | Mô tả |
|--------|------|-------|
| `useScrollAnimation()` | `useScrollAnimation.ts:1-46` | IntersectionObserver + `opacity 0→1` + `translateY(24px→0)`, 600ms |
| `useChildrenStagger()` | `useScrollAnimation.ts:48-93` | Như trên nhưng stagger delay cho children |
| CSS Keyframes | `EnvelopeCard.tsx`, `Countdown.tsx`, `Gallery.tsx`, `FloralOverlay.tsx`, `MusicButton.tsx` | Decorative animations (float, flip, sway, spin) |
| Motion.js (`motion/react`) | `FloatingBar.tsx` | Animate Presence cho peek/overlay transitions |
| Canvas 2D | `HeartCanvas.tsx` | Particle system — object pool, idle-stop, DPR-aware |

**Components đã có scroll animation:**

| Component | Hook | Stagger (ms) |
|-----------|------|-------------|
| `PhotoHero` | `useScrollAnimation()` | — |
| `Countdown` | `useScrollAnimation()` | — |
| `RSVPForm` | `useScrollAnimation()` | — |
| `ThankYou` | `useScrollAnimation()` | — |
| `WeddingGift` | `useScrollAnimation()` | — |
| `PhotoQuoteSplit` | `useScrollAnimation()` | — |
| `CouplePortraits` | `useScrollAnimation()` | — |
| `EventDetails` | `useChildrenStagger(80)` | 80 |
| `WeddingTimeline` | `useChildrenStagger(200)` | 200 |
| `FamilyInfo` | `useChildrenStagger(120)` | 120 |
| `OurStory` | `useChildrenStagger(150)` | 150 |
| `Gallery` | Custom IntersectionObserver | ~100 (inline) |

**Components CHƯA có scroll animation:**

| Component | Lý do | Đề xuất |
|-----------|-------|---------|
| `EnvelopeCard` | Có state machine riêng (closed→opening→open→closing) | Giữ nguyên — không cần scroll animation |
| `CalendarHighlight` | Chưa implement | Thêm fade-in reveal |
| `InvitationInfo` | Chưa implement | Thêm fade-in cho guest name + info |
| `FloatingBar` | Fixed bottom position | Giữ nguyên — đã có Motion.js transitions |
| `FloralOverlay` | Có hook `useFloralReveal()` riêng | Nâng cấp thành parallax nhẹ |
| `MusicButton` | Floating UI element | Giữ nguyên |

### 1.2 Điểm mạnh hiện tại

1. **Canvas HeartCanvas** — Xuất sắc: object pool, idle-stop, DPR-aware, `prefers-reduced-motion` support
2. **IntersectionObserver** — Đúng cách: không dùng scroll event listener cho animation trigger
3. **GPU-accelerated properties** — Chỉ animate `transform` + `opacity` (không có layout-triggering properties)
4. **`will-change: transform, opacity`** — Đã áp dụng đúng chỗ (EnvelopeCard heart SVGs)
5. **`prefers-reduced-motion`** — Đã implement trong `useScrollAnimation`, `useChildrenStagger`, `HeartCanvas`, `FloralOverlay`

### 1.3 Vấn đề phát hiện

#### A. Hardcoded pixel values gây rủi ro responsive

| File | Giá trị | Rủi ro | Mức độ |
|------|---------|--------|--------|
| `EnvelopeCard.tsx` | `ENV_W=310`, `ENV_H=215`, `FLAP_H=108`, `CARD_RISE=170` | Envelope cố định kích thước, không scale theo viewport | **TRUNG BÌNH** — chấp nhận được trong 430px frame |
| `EnvelopeCard.tsx` | Title `46px`, couple names `28px`, orchid offsets `right:-20px`, `left:-14px` | Font quá lớn trên < 360px; orchid overflow ra ngoài | **TRUNG BÌNH** |
| `Countdown.tsx` | `CARD_W=72`, `CARD_H=82`, `FONT_SIZE=36` | Flip card cố định, không scale | **THẤP** — 72px × 4 cards + gaps < 430px |
| `PhotoHero.tsx` | Section `height: 480px`, quote margins `30px` | Height cố định chiếm nhiều viewport; margin cứng | **THẤP** |
| `CouplePortraits.tsx` | `maxWidth: 380px`, `height: 480px`, photo sizes `170×215` / `175×220` | Cố định kích thước, không responsive | **TRUNG BÌNH** |
| `EventDetails.tsx` | Date font `72px`, venue name `26px`, divider `48px` | Typography quá lớn, không fluid | **TRUNG BÌNH** |
| `OurStory.tsx` | Title `55px` | Có thể overflow trên < 320px | **THẤP** |
| `ThankYou.tsx` | Section `height: 450px`, text `52px` | Cố định height + font lớn | **THẤP** |
| `WeddingTimeline.tsx` | Icon circles `72×72px`, 3-column grid | Chật trên < 380px | **THẤP** |
| `FamilyInfo.tsx` | Divider image `36×36px`, divider lines `32px` | Decorative — chấp nhận được | **RẤT THẤP** |

#### B. Thiếu responsive breakpoints

- **App.tsx** chỉ có 2 media queries: `min-width: 768px` (desktop border-radius) và `max-width: 767px` (mobile full-width)
- **Không có breakpoint** cho small phones (< 375px), landscape mode, hoặc tablets
- **Không component nào** sử dụng Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- **Typography** hoàn toàn cố định — không có `clamp()` hay responsive font-size

#### C. Animation đơn điệu

- **Tất cả scroll animations** đều cùng pattern: `opacity 0→1` + `translateY(24px→0)` + `600ms ease`
- Không có variation giữa các loại content (text, image, decorative)
- Không có **parallax** cho elements trang trí (FloralOverlay, orchids)
- Không có **scale reveal** cho images
- Thiếu **"elegance"** — hiệu ứng hiện tại quá generic, chưa mang hơi thở wedding

#### D. Rủi ro performance tiềm ẩn

| Vấn đề | File | Mức độ |
|--------|------|--------|
| FloatingBar render 100+ wish items bằng `motion.div` individual | `FloatingBar.tsx:336-387` | **THẤP** — chưa nhiều wishes |
| Multiple `setTimeout` chains trong EnvelopeCard | `EnvelopeCard.tsx:148-162` | **THẤP** — sparse, không trong rAF loop |
| Inline object literals trong motion component props | `FloatingBar.tsx` | **RẤT THẤP** — Motion.js optimize nội bộ |

---

## 2. Chiến lược Responsive

### 2.1 Breakpoints

Dự án sử dụng phone-frame wrapper (max 430px), nên breakpoints tập trung vào việc **scale content bên trong frame** thay vì thay đổi layout toàn trang.

```
┌─────────────────────────────────────────────────┐
│  Breakpoint       │  Width        │  Mục đích    │
├───────────────────┼───────────────┼──────────────┤
│  xs (small phone) │  < 375px      │  Giảm font,  │
│                   │               │  thu gọn gap  │
├───────────────────┼───────────────┼──────────────┤
│  base (target)    │  375–430px    │  Default      │
│                   │               │  design       │
├───────────────────┼───────────────┼──────────────┤
│  md (tablet)      │  ≥ 768px      │  Phone frame  │
│                   │               │  with border  │
│                   │               │  radius       │
├───────────────────┼───────────────┼──────────────┤
│  lg (desktop)     │  ≥ 1024px     │  Frame +      │
│                   │               │  background   │
│                   │               │  decoration   │
└─────────────────────────────────────────────────┘
```

**Tại sao chọn chiến lược này?**

Vì app render bên trong container max-width 430px, responsive chủ yếu xảy ra ở 2 chiều:
1. **Bên trong frame** (xs ↔ base): Scale typography và spacing cho phones nhỏ (iPhone SE = 375px, iPhone 16 Pro Max = 430px)
2. **Bên ngoài frame** (md, lg): Xử lý how the frame looks trên viewport lớn hơn (padding, background, shadow)

### 2.2 Fluid Typography

Thay thế hardcoded font-size bằng hệ thống `clamp()` để chữ tự co giãn mượt mà giữa 320px–430px.

**Bảng fluid font-size đề xuất:**

| Token | Min (320px) | Preferred | Max (430px) | Áp dụng cho |
|-------|------------|-----------|------------|-------------|
| `--text-hero` | 42px | 12vw | 52px | ThankYou title, major headings |
| `--text-display` | 44px | 13vw | 55px | OurStory title |
| `--text-section-title` | 36px | 10vw | 46px | EnvelopeCard title |
| `--text-date-large` | 56px | 16vw | 72px | EventDetails date |
| `--text-couple-names` | 22px | 6.5vw | 28px | Card couple names |
| `--text-quote` | 30px | 8.5vw | 38px | PhotoHero quote |
| `--text-countdown` | 28px | 8vw | 36px | Countdown digits |
| `--text-body` | 13px | 3.6vw | 15px | Body text |
| `--text-label` | 11px | 3.2vw | 13px | Labels, small text |

**Cách implement:** Định nghĩa trong `theme.css` dưới dạng CSS custom properties với `clamp()`:

```css
/* Ví dụ minh họa — Agent sẽ tính toán chính xác khi implement */
:root {
  --text-hero: clamp(2.625rem, 12vw, 3.25rem);
  --text-display: clamp(2.75rem, 13vw, 3.4375rem);
  /* ... */
}
```

**Tại sao dùng `clamp()` thay vì media queries cho font?**

- Mượt mà hơn: chữ scale liên tục thay vì nhảy bậc tại breakpoint
- Ít code hơn: 1 dòng `clamp()` thay cho 2-3 media queries
- Phone-frame context: viewport chỉ dao động 320–430px, `clamp()` hoạt động tối ưu trong khoảng hẹp này

### 2.3 Fluid Spacing

Tương tự typography, spacing cũng nên fluid cho padding/margin lớn:

| Token | Min (320px) | Max (430px) | Áp dụng |
|-------|------------|------------|---------|
| `--space-section-y` | 40px | 52px | Section vertical padding |
| `--space-section-x` | 16px | 28px | Section horizontal padding |
| `--space-quote-x` | 20px | 30px | Quote margins (PhotoHero) |

### 2.4 Touch-friendly Guidelines

Đảm bảo mọi interactive element tuân thủ **minimum 44×44px touch target** (WCAG 2.5.5):

| Element | Hiện tại | Đạt? | Hành động |
|---------|---------|------|-----------|
| Envelope tap area | ~310×215px | ✅ | Giữ nguyên |
| Gallery lightbox nav buttons | 44×44px | ✅ | Giữ nguyên |
| MusicButton | 26×26px | ❌ | Tăng lên 44×44px (visual size giữ 26px, hit area expand bằng padding) |
| FloatingBar send button | ~30px | ❌ | Tăng hit area lên 44px |
| FloatingBar "Bắn tim" button | ~34px | ⚠️ | Padding thêm cho đạt 44px |
| FloatingBar album button | 34×34px | ⚠️ | Padding thêm cho đạt 44px |
| RSVPForm submit button | Full width, 13px padding | ✅ | Đạt rồi |
| RSVPForm radio buttons | Browser default | ⚠️ | Wrap trong label lớn hơn |

---

## 3. Scroll Animation — "Elegant Reveal"

### 3.1 Triết lý thiết kế

> Một thiệp cưới sang trọng **không la hét** — nó **thì thầm**.

**Nguyên tắc:**
1. **Subtlety over spectacle** — Chuyển động nhẹ nhàng, khoảng cách di chuyển ngắn (12–24px thay vì 40–60px)
2. **Rhythm & Cadence** — Mỗi section có tempo riêng, tạo nhịp "hít vào – thở ra" khi scroll
3. **Content hierarchy** — Quan trọng hơn thì appear trước, decorative elements follow sau
4. **Organic movement** — Dùng easing curves mềm mại (ease-out, cubic-bezier), tránh linear
5. **Respect user preference** — Tắt hoàn toàn animation khi `prefers-reduced-motion: reduce`

### 3.2 Animation Vocabulary

Định nghĩa bộ **5 kiểu animation** chuẩn, mỗi kiểu cho một loại content khác nhau:

#### A. `fadeInUp` — Cho text blocks, headings, paragraphs

```
Initial:  opacity: 0, translateY(16px)
Final:    opacity: 1, translateY(0)
Duration: 700ms
Easing:   cubic-bezier(0.25, 0.46, 0.45, 0.94)  — "easeOutQuad"
```

**Tại sao 16px thay vì 24px hiện tại?**
- 24px tạo cảm giác "nhảy lên" — quá mạnh cho wedding aesthetic
- 16px vừa đủ để người dùng nhận ra chuyển động mà không bị distracted khỏi nội dung

#### B. `fadeInScale` — Cho images, photos, gallery items

```
Initial:  opacity: 0, scale(0.95)
Final:    opacity: 1, scale(1)
Duration: 800ms
Easing:   cubic-bezier(0.16, 1, 0.3, 1)  — "easeOutExpo" (dramatic reveal)
```

**Tại sao dùng scale cho ảnh?**
- Scale tạo hiệu ứng "mở rộng nhẹ" — như đang unfold một bức ảnh
- Kết hợp với opacity tạo soft focus → sharp reveal, rất phù hợp wedding photography

#### C. `staggerChildren` — Cho lists, grids, timeline items

```
Initial:  opacity: 0, translateY(12px)
Final:    opacity: 1, translateY(0)
Duration: 500ms per child
Stagger:  100–200ms between children
Easing:   cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

**Tại sao stagger 100–200ms?**
- < 80ms: quá nhanh, children xuất hiện gần như đồng thời — mất hiệu ứng
- \> 300ms: quá chậm, người dùng phải đợi — frustrating trên mobile
- 100–200ms là "sweet spot" cho danh sách 3–6 items

#### D. `parallaxFloat` — Cho decorative elements (floral, orchids)

```
Behavior:  translateY varies based on scroll position
Range:     ±20px relative to natural position
Speed:     0.15x scroll speed (rất nhẹ)
Easing:    none (linear follow scroll)
```

**Tại sao chọn parallax factor 0.15?**
- Factor quá lớn (> 0.3): elements di chuyển rõ rệt — gây mất tập trung
- Factor quá nhỏ (< 0.05): không nhận ra — lãng phí performance
- 0.15 tạo **depth illusion** tinh tế: bông hoa "lơ lửng" nhẹ khi scroll, tạo cảm giác 3D mà không overwhelming

#### E. `revealLine` — Cho decorative dividers, horizontal lines

```
Initial:  scaleX(0), transformOrigin: center
Final:    scaleX(1)
Duration: 600ms
Delay:    200ms (after parent text appears)
Easing:   cubic-bezier(0.65, 0, 0.35, 1)  — "easeInOutCubic"
```

**Tại sao dùng scaleX thay vì width animation?**
- `scaleX` là **transform** → GPU-accelerated, 0 layout reflow
- `width` animation triggers layout recalculation mỗi frame → jank

### 3.3 Áp dụng cho từng Component

```
┌──────────────────────────────────────────────────────────────┐
│  SCROLL DIRECTION ↓                                          │
│                                                              │
│  ┌─ EnvelopeCard ─────────────────────────────────────────┐  │
│  │  ❌ Không thêm scroll animation                        │  │
│  │  Giữ nguyên state machine (closed→open→closing)        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ InvitationInfo ───────────────────────────────────────┐  │
│  │  🆕 fadeInUp: guest name (delay 0ms)                   │  │
│  │  🆕 fadeInUp: invitation text (delay 150ms)            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ PhotoHero ────────────────────────────────────────────┐  │
│  │  ✅ fadeInScale: background image (đã có, nâng cấp)    │  │
│  │  ✅ fadeInUp: quote text (đã có, tinh chỉnh timing)    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ CouplePortraits ─────────────────────────────────────┐  │
│  │  ✅ fadeInScale: polaroid photos (nâng cấp từ fadeIn)  │  │
│  │  🆕 parallaxFloat: orchid decorations                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ OurStory ─────────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: title (đã có)                            │  │
│  │  ✅ staggerChildren: paragraphs (đã có, tinh chỉnh)   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ FamilyInfo ───────────────────────────────────────────┐  │
│  │  ✅ staggerChildren: family members (đã có)            │  │
│  │  🆕 revealLine: divider lines                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ PhotoQuoteSplit ──────────────────────────────────────┐  │
│  │  ✅ fadeInScale: photo (nâng cấp từ fadeIn)            │  │
│  │  ✅ fadeInUp: quote (đã có)                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ EventDetails ─────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: date display (đã có, tinh chỉnh)        │  │
│  │  ✅ staggerChildren: venue cards (đã có)               │  │
│  │  🆕 revealLine: divider between date elements          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ CalendarHighlight ────────────────────────────────────┐  │
│  │  🆕 fadeInScale: calendar image/section                │  │
│  │  🆕 fadeInUp: month/year label                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ WeddingTimeline ─────────────────────────────────────┐  │
│  │  ✅ staggerChildren: timeline items (đã có)            │  │
│  │  🆕 revealLine: timeline connector (nếu có)            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Countdown ────────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: section (đã có, giữ nguyên)              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Gallery ──────────────────────────────────────────────┐  │
│  │  ✅ fadeInScale: grid items (nâng cấp từ scale-only)   │  │
│  │  ✅ staggerChildren: grid (đã có)                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ RSVPForm ─────────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: form container (đã có)                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ WeddingGift ──────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: section (đã có)                          │  │
│  │  🆕 fadeInScale: gift illustration                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ ThankYou ─────────────────────────────────────────────┐  │
│  │  ✅ fadeInUp: text (đã có, tinh chỉnh)                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ FloralOverlay (decorative, xuyên suốt) ──────────────┐  │
│  │  🆕 parallaxFloat: tất cả floral elements              │  │
│  │     Factor: 0.15 (top elements di chuyển chậm hơn)     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ FloatingBar (bottom, fixed) ──────────────────────────┐  │
│  │  ❌ Không thêm scroll animation                        │  │
│  │  Giữ nguyên Motion.js AnimatePresence                  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Kỹ thuật implement

#### Nâng cấp `useScrollAnimation` hook

Hook hiện tại (`useScrollAnimation.ts`) cần được mở rộng để hỗ trợ nhiều kiểu animation. Đề xuất API mới:

```typescript
// Signature mới — backwards-compatible
function useScrollAnimation(options?: {
  variant?: 'fadeInUp' | 'fadeInScale' | 'revealLine';
  delay?: number;        // ms, default 0
  duration?: number;     // ms, default theo variant
  threshold?: number;    // 0-1, default 0.15
  once?: boolean;        // default true — chỉ animate 1 lần
}): React.RefObject<HTMLElement>;

// Giữ nguyên cách gọi cũ cho backwards compatibility
const ref = useScrollAnimation(); // = fadeInUp, mặc định
```

**Tại sao mở rộng hook thay vì tạo hook mới?**
- Giữ API quen thuộc cho codebase
- Tránh thêm import mới vào 12+ components
- Backwards-compatible: `useScrollAnimation()` không tham số vẫn hoạt động như cũ

#### Parallax Implementation

Cho `parallaxFloat`, sẽ tạo hook riêng `useParallax()` vì cơ chế khác biệt căn bản:

```typescript
function useParallax(options?: {
  speed?: number;        // 0-1, default 0.15
  direction?: 'up' | 'down'; // default 'up'
  maxOffset?: number;    // px, default 20
}): React.RefObject<HTMLElement>;
```

**Cách hoạt động (KHÔNG dùng scroll event listener):**

Sử dụng **CSS `scroll-timeline`** nếu browser hỗ trợ, fallback về **IntersectionObserver + requestAnimationFrame** throttled:

1. IntersectionObserver detect khi element vào viewport
2. Chỉ khi visible: attach rAF loop đọc `element.getBoundingClientRect()` mỗi frame
3. Tính toán offset dựa trên vị trí tương đối với viewport center
4. Apply `transform: translateY(offset)` trực tiếp (không qua React state → zero re-render)
5. Khi element rời viewport: detach rAF loop

**Tại sao phương pháp này an toàn về performance?**
- rAF chỉ chạy khi element visible (không phải mọi scroll event)
- Transform applied qua `element.style.transform` (bypass React reconciliation)
- `getBoundingClientRect()` là cheap operation trong rAF context
- `will-change: transform` hint cho browser pre-composite

### 3.5 Easing Curves Reference

Bộ easing curves cho toàn dự án, định nghĩa tại `theme.css`:

```css
:root {
  /* Elegant Reveal — smooth deceleration */
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Dramatic Reveal — fast start, very slow end (for images) */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* Symmetric — smooth start and end (for dividers) */
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);

  /* Organic bounce — subtle overshoot (for decorative elements) */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Tại sao cần bộ easing riêng?**
- CSS `ease` / `ease-in-out` mặc định quá generic — mọi animation trông giống nhau
- Bộ curve được chọn mang cá tính "wedding": mềm mại, elegant, không có mechanical feel
- `easeOutExpo` cho ảnh tạo hiệu ứng "mở mắt" — focus nhanh rồi settle chậm

---

## 4. Danh sách lỗi & kế hoạch sửa chữa

### 4.1 Priority: CAO — Cần sửa trước khi thêm animation

| # | File | Vấn đề | Giải pháp |
|---|------|--------|-----------|
| H1 | `theme.css` | Thiếu fluid typography tokens | Thêm CSS custom properties `clamp()` (Section 2.2) |
| H2 | `theme.css` | Thiếu easing curve tokens | Thêm 4 custom properties easing (Section 3.5) |
| H3 | `useScrollAnimation.ts` | Hook chỉ hỗ trợ 1 kiểu animation | Mở rộng API hỗ trợ `variant` option (Section 3.4) |

### 4.2 Priority: TRUNG BÌNH — Sửa song song với animation

| # | File | Vấn đề | Giải pháp |
|---|------|--------|-----------|
| M1 | `EventDetails.tsx` | Date font `72px` cứng | Đổi sang `var(--text-date-large)` với `clamp()` |
| M2 | `EnvelopeCard.tsx` | Title `46px`, couple names `28px` cứng | Đổi sang fluid tokens |
| M3 | `EnvelopeCard.tsx` | Orchid offsets `right: -20px`, `left: -14px` | Đổi sang percentage hoặc clamp: `max(-20px, -5%)` |
| M4 | `OurStory.tsx` | Title `55px` cứng | Đổi sang `var(--text-display)` |
| M5 | `PhotoHero.tsx` | Quote `38px` cứng, margins `30px` | Đổi sang fluid tokens |
| M6 | `CouplePortraits.tsx` | Photo sizes hardcoded, container `380×480px` | Scale proportionally: dùng `aspect-ratio` + percentage widths |
| M7 | `ThankYou.tsx` | Title `52px` cứng | Đổi sang `var(--text-hero)` |
| M8 | `MusicButton.tsx` | Touch target `26×26px` | Tăng hit area lên 44px bằng invisible padding |
| M9 | `PhotoHero.tsx` | Section `height: 480px` cứng | Đổi sang `min-height: clamp(400px, 65vh, 520px)` |
| M10 | `ThankYou.tsx` | Section `height: 450px` cứng | Đổi sang `min-height: clamp(380px, 60vh, 480px)` |

### 4.3 Priority: THẤP — Nice-to-have

| # | File | Vấn đề | Giải pháp |
|---|------|--------|-----------|
| L1 | `Countdown.tsx` | Card `72×82px` cứng | Có thể giữ nguyên — đủ nhỏ cho 430px frame |
| L2 | `WeddingTimeline.tsx` | 3-column grid chật trên < 380px | Có thể giữ nguyên — minimum target là 375px |
| L3 | `Gallery.tsx` | Grid gap `3px` nhỏ | Có thể tăng lên `4px` cho visual clarity |
| L4 | `RSVPForm.tsx` | Label font `13px` nhỏ | Đổi sang `var(--text-label)` fluid |
| L5 | `FloatingBar.tsx` | Album/send button < 44px touch | Tăng hit area |

### 4.4 Tổng hợp files cần chỉnh sửa

```
Tạo mới:
  ✦ src/app/components/useParallax.ts        — Parallax hook mới

Chỉnh sửa (core):
  ✎ src/styles/theme.css                     — Fluid tokens + easing curves
  ✎ src/app/components/useScrollAnimation.ts  — Mở rộng variant API

Chỉnh sửa (components - responsive):
  ✎ src/app/components/EventDetails.tsx       — Fluid typography (M1)
  ✎ src/app/components/EnvelopeCard.tsx       — Fluid typography + orchid offsets (M2, M3)
  ✎ src/app/components/OurStory.tsx           — Fluid typography (M4)
  ✎ src/app/components/PhotoHero.tsx          — Fluid typography + height (M5, M9)
  ✎ src/app/components/CouplePortraits.tsx    — Proportional sizing (M6)
  ✎ src/app/components/ThankYou.tsx           — Fluid typography + height (M7, M10)
  ✎ src/app/components/MusicButton.tsx        — Touch target (M8)

Chỉnh sửa (components - animation upgrade):
  ✎ src/app/components/PhotoHero.tsx          — fadeInScale cho image
  ✎ src/app/components/CouplePortraits.tsx    — fadeInScale cho photos
  ✎ src/app/components/PhotoQuoteSplit.tsx     — fadeInScale cho image
  ✎ src/app/components/Gallery.tsx            — fadeInScale cho items
  ✎ src/app/components/FamilyInfo.tsx         — revealLine cho dividers
  ✎ src/app/components/EventDetails.tsx       — revealLine cho dividers
  ✎ src/app/components/WeddingGift.tsx        — fadeInScale cho illustration
  ✎ src/app/components/FloralOverlay.tsx      — parallaxFloat integration
  ✎ src/app/components/CalendarHighlight.tsx  — fadeInScale + fadeInUp (mới)
  ✎ src/app/components/InvitationInfo.tsx     — fadeInUp (mới)

Không chỉnh sửa:
  ✗ src/app/components/EnvelopeCard.tsx       — Animation state machine giữ nguyên
  ✗ src/app/components/FloatingBar.tsx        — Motion.js transitions giữ nguyên
  ✗ src/app/components/HeartCanvas.tsx        — Canvas particle system giữ nguyên
  ✗ src/app/components/ui/*                   — shadcn/ui không sửa
  ✗ src/app/components/image-manifest.ts      — Auto-generated
```

---

## 5. Chỉ dẫn kỹ thuật cho Agent

### 5.1 Performance Rules (BẮT BUỘC)

1. **Chỉ animate `transform` và `opacity`** — KHÔNG animate `width`, `height`, `top`, `left`, `margin`, `padding`, `border`, `box-shadow`
2. **Dùng `will-change: transform, opacity`** trên elements SẮP ĐƯỢC animate — remove sau khi animation complete (tránh memory overhead)
3. **KHÔNG dùng scroll event listener** cho animation trigger — dùng IntersectionObserver hoặc CSS scroll-timeline
4. **Parallax rAF loop** chỉ chạy khi element visible — detach ngay khi rời viewport
5. **`requestAnimationFrame`** — KHÔNG dùng `setTimeout` / `setInterval` cho visual animations
6. **Composite-friendly transforms** — Gom nhiều transforms thành 1 string: `transform: translateY(16px) scale(0.95)` thay vì 2 properties riêng

### 5.2 Accessibility Rules (BẮT BUỘC)

1. **`prefers-reduced-motion: reduce`** — TẤT CẢ scroll animations PHẢI bị disabled. Elements hiển thị ngay ở final state
2. Implement bằng check trong hook:
   ```
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (prefersReducedMotion) {
     // Hiển thị ngay ở final state, không animate
     return;
   }
   ```
3. Parallax cũng phải tôn trọng `prefers-reduced-motion` — elements ở static position
4. **Focus management** — Animation KHÔNG được gây mất focus cho screen readers

### 5.3 Consistency Rules

1. **Easing curves** — Chỉ sử dụng 4 curves đã định nghĩa ở Section 3.5. KHÔNG tạo curve mới trừ khi có lý do rõ ràng
2. **Duration range** — Mọi scroll animation phải nằm trong 500–800ms. KHÔNG dưới 400ms (quá nhanh, không elegant) hoặc trên 1000ms (quá chậm, gây khó chịu)
3. **Stagger range** — 80–200ms giữa children. KHÔNG dưới 50ms hoặc trên 300ms
4. **Animation `once: true` mặc định** — Mỗi element chỉ animate 1 lần khi scroll vào viewport lần đầu. Scroll ngược lên rồi xuống lại KHÔNG trigger lại animation
5. **Threshold `0.15`** — Trigger khi 15% element visible. Đủ sớm để user thấy animation bắt đầu, không quá sớm để element animate ngoài viewport
6. **Font chữ** — KHÔNG thay đổi font families. Chỉ thay đổi font-size thông qua fluid tokens
7. **Màu sắc** — KHÔNG thay đổi color palette. Animation chỉ liên quan đến transform + opacity

### 5.4 Thứ tự implement

Để đảm bảo an toàn và dễ review, implement theo 4 phases:

```
Phase 1: Foundation (không ảnh hưởng visual)
  ├── Thêm fluid tokens vào theme.css
  ├── Thêm easing curves vào theme.css
  ├── Mở rộng useScrollAnimation hook
  └── Tạo useParallax hook

Phase 2: Responsive fixes (visual changes, no animation)
  ├── Áp dụng fluid typography cho các components (M1-M7)
  ├── Fix section heights (M9, M10)
  ├── Fix touch targets (M8, L5)
  └── Fix orchid overflow (M3)

Phase 3: Animation upgrade (visual changes)
  ├── Áp dụng fadeInScale cho image components
  ├── Áp dụng revealLine cho dividers
  ├── Thêm scroll animation cho CalendarHighlight, InvitationInfo
  └── Tinh chỉnh timing/easing cho components đã có animation

Phase 4: Parallax (final polish)
  ├── Integrate useParallax vào FloralOverlay
  ├── Thêm parallax cho CouplePortraits orchids
  └── Fine-tune parallax speed/range
```

**Sau mỗi phase:** Test trên mobile viewport (390×844) để verify không có regression.

### 5.5 Testing Checklist

Mỗi component sau khi sửa phải verify:

- [ ] Hiển thị đúng trên 375px width (iPhone SE)
- [ ] Hiển thị đúng trên 430px width (iPhone Pro Max)
- [ ] Animation smooth (no jank) — verify bằng Chrome DevTools Performance tab, target 60fps
- [ ] `prefers-reduced-motion` — tắt animation, elements visible ở final state
- [ ] Scroll nhanh qua nhiều sections — không có visual artifact
- [ ] Scroll ngược lại — animations không re-trigger (once: true)
- [ ] Touch targets ≥ 44×44px cho interactive elements
- [ ] Không có horizontal scroll (overflow-x check)
- [ ] Font sizes readable trên smallest viewport

---

## Appendix: Animation Timing Map

Visual reference cho rhythm khi scroll qua toàn bộ trang:

```
Section              │ Animation          │ Duration │ Delay │ Stagger
─────────────────────┼────────────────────┼──────────┼───────┼────────
InvitationInfo       │ fadeInUp           │ 700ms    │ 0     │ 150ms
PhotoHero (image)    │ fadeInScale        │ 800ms    │ 0     │ —
PhotoHero (quote)    │ fadeInUp           │ 700ms    │ 200ms │ —
CouplePortraits      │ fadeInScale        │ 800ms    │ 0     │ —
CouplePortraits orch │ parallaxFloat      │ cont.    │ —     │ —
OurStory (title)     │ fadeInUp           │ 700ms    │ 0     │ —
OurStory (paras)     │ staggerChildren    │ 500ms    │ 100ms │ 150ms
FamilyInfo           │ staggerChildren    │ 500ms    │ 0     │ 120ms
FamilyInfo dividers  │ revealLine         │ 600ms    │ 200ms │ —
PhotoQuoteSplit (img)│ fadeInScale        │ 800ms    │ 0     │ —
PhotoQuoteSplit (txt)│ fadeInUp           │ 700ms    │ 150ms │ —
EventDetails (date)  │ fadeInUp           │ 700ms    │ 0     │ —
EventDetails divider │ revealLine         │ 600ms    │ 200ms │ —
EventDetails venues  │ staggerChildren    │ 500ms    │ 300ms │ 80ms
CalendarHighlight    │ fadeInScale        │ 800ms    │ 0     │ —
WeddingTimeline      │ staggerChildren    │ 500ms    │ 0     │ 200ms
Countdown            │ fadeInUp           │ 700ms    │ 0     │ —
Gallery              │ fadeInScale+stagger│ 800ms    │ 0     │ 100ms
RSVPForm             │ fadeInUp           │ 700ms    │ 0     │ —
WeddingGift (illus)  │ fadeInScale        │ 800ms    │ 0     │ —
WeddingGift (text)   │ fadeInUp           │ 700ms    │ 150ms │ —
ThankYou             │ fadeInUp           │ 700ms    │ 0     │ —
FloralOverlay (all)  │ parallaxFloat 0.15 │ cont.    │ —     │ —
```
