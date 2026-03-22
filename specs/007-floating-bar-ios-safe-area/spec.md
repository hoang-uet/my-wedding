# Feature Specification: FloatingBar iOS Safe Area & Liquid Glass Redesign

**Feature ID**: 007-floating-bar-ios-safe-area
**Created**: 2026-03-22
**Status**: Chưa triển khai
**Dependencies**: CSS `env(safe-area-inset-*)`, CSS `dvh` units, `backdrop-filter`
**Affected Components**: `App.tsx`, `FloatingBar.tsx`, `index.html`

---

## Tổng quan

FloatingBar (thanh tương tác gửi lời chúc, bắn tim, xem album) bị **che khuất hoặc hoàn toàn ẩn** trên trình duyệt mobile iOS do vấn đề viewport height và safe area insets.

### Báo cáo lỗi

| # | Thiết bị | Trình duyệt | HĐH | Triệu chứng |
|---|----------|-------------|------|-------------|
| 1 | iPhone 16 Pro Max | Safari | iOS 26 | FloatingBar bị che **một phần** bởi thanh URL bar của Safari |
| 2 | iPhone 16 Pro Max | Chrome Mobile | iOS 26 | FloatingBar **hoàn toàn ẩn**, phải zoom-in mới thấy |
| 3 | iPhone 15 Pro | Safari | iOS 26 | Tương tự lỗi #1 |

### Impact

- **UX tệ**: FloatingBar là phần tương tác nổi bật nhất của thiệp cưới (gửi lời chúc, bắn tim realtime, xem album). Khi bị ẩn, khách mời mất hoàn toàn khả năng tương tác.
- **Phạm vi ảnh hưởng**: Tất cả thiết bị iOS (iPhone, iPad) trên Safari và Chrome. Android ít bị ảnh hưởng hơn nhưng có thể gặp vấn đề tương tự.

---

## A. Phân tích nguyên nhân gốc (Root Cause Analysis)

### A1. `100vh` không phản ánh visible viewport trên iOS

**Phone frame** (`App.tsx:78`) sử dụng:
```css
height: 100vh;
```

Trên iOS Safari/Chrome, `100vh` là **Large Viewport Height (lvh)** — chiều cao viewport KHI thanh URL/toolbar đã ẩn (scroll down). Khi thanh URL ĐANG HIỆN (trạng thái mặc đến khi người dùng scroll), visible viewport **nhỏ hơn `100vh`** khoảng 50-90px (tùy trình duyệt).

```
┌─────────────────────┐
│    Status Bar        │ ← ~54px (Dynamic Island / notch)
├─────────────────────┤
│                     │
│   Visible Viewport  │ ← Người dùng thấy đây
│    (< 100vh)        │
│                     │
│   ┌─FloatingBar─┐   │ ← bottom: 0 của 100vh container
│   └─────────────┘   │    → nằm DƯỚI visible viewport
├─────────────────────┤
│  Safari URL Bar     │ ← ~50px, che FloatingBar
├─────────────────────┤
│  Home Indicator     │ ← ~34px safe area
└─────────────────────┘
```

**Kết quả**: FloatingBar dùng `position: absolute; bottom: 0` bên trong container `100vh` → vị trí thực tế nằm **dưới** vùng nhìn thấy, bị che bởi browser chrome.

### A2. Thiếu `viewport-fit=cover` trong meta tag

File `index.html:5`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Thiếu `viewport-fit=cover`**. Nếu không có thuộc tính này:
- Trình duyệt KHÔNG cung cấp giá trị cho `env(safe-area-inset-bottom)`
- Content bị constrain trong "safe area" mặc đến, không tận dụng được toàn bộ màn hình
- Trên iPhone có Dynamic Island/notch, có thể bị letterboxing

### A3. Không có safe area inset padding

FloatingBar (`FloatingBar.tsx:448`) có padding cố định:
```css
padding: 8px 10px;
```

Không tính đến **home indicator area** (34px trên iPhone X+). Ngay cả khi fix viewport height, FloatingBar vẫn có thể chồng lên home indicator.

### A4. `paddingBottom` cố định trên scroll container

Scroll container (`App.tsx:93`) dùng:
```css
paddingBottom: '56px';
```

Giá trị `56px` cố định không tính đến safe area inset. Nội dung cuối cùng (ThankYou section) có thể bị che khi safe area inset > 0.

---

## B. Giải pháp kỹ thuật

### B1. Thêm `viewport-fit=cover` vào meta tag

**File**: `index.html`

```html
<!-- TRƯỚC -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- SAU -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**Tác dụng**:
- Mở khóa `env(safe-area-inset-*)` CSS environment variables
- Cho phép content extend tới edges của thiết bị (full-bleed)
- Trình duyệt cung cấp giá trị chính xác cho safe area insets

### B2. Thay `100vh` bằng `100dvh` với fallback

**File**: `App.tsx` — Phone frame container

```tsx
// TRƯỚC
style={{
    height: '100vh',
    ...
}}

// SAU
style={{
    height: '100dvh',     // Dynamic Viewport Height — co giãn theo browser chrome
    ...
}}
```

Kèm CSS fallback cho trình duyệt cũ (đã có `<style>` block ở cuối App.tsx):

```css
/* Fallback cho trình duyệt không hỗ trợ dvh */
@supports not (height: 100dvh) {
    .phone-frame {
        height: 100vh !important;
        /* Trừ đi ước tính browser chrome height */
        height: calc(100vh - env(safe-area-inset-bottom, 0px)) !important;
    }
}
```

**Giải thích đơn vị viewport**:
| Đơn vị | Ý nghĩa | Khi nào dùng |
|--------|---------|-------------|
| `vh` | Large Viewport Height (URL bar ẩn) | Không nên dùng cho layout chính trên mobile |
| `svh` | Small Viewport Height (URL bar hiện) | Khi muốn content luôn vừa khung nhỏ nhất |
| `dvh` | Dynamic Viewport Height (co giãn theo URL bar) | **Tốt nhất cho app-like layout** |

`dvh` là lựa chọn tối ưu vì:
- Co giãn mượt khi Safari URL bar show/hide
- Reflect đúng visible viewport tại mọi thời điểm
- Support rộng: Safari 15.4+, Chrome 108+, Firefox 101+ (cover >98% iOS devices)

### B3. Thêm safe area inset cho FloatingBar

**File**: `FloatingBar.tsx` — BOTTOM BAR section

```tsx
// TRƯỚC
style={{
    padding: '8px 10px',
    ...
}}

// SAU
style={{
    padding: '8px 10px',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
    ...
}}
```

**Logic**: `max(8px, env(safe-area-inset-bottom))` đảm bảo:
- Trên thiết bị KHÔNG có home indicator: giữ nguyên 8px
- Trên thiết bị CÓ home indicator (34px): dùng 34px để FloatingBar nằm trên home indicator
- Fallback 8px nếu `env()` không có giá trị

### B4. Cập nhật scroll container paddingBottom

**File**: `App.tsx` — Scrollable content container

```tsx
// TRƯỚC
style={{
    paddingBottom: '56px',
    ...
}}

// SAU
style={{
    paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
    ...
}}
```

### B5. Cập nhật overlay positions tính safe area

**File**: `FloatingBar.tsx` — Peek mode và Full messages overlay

Cả hai overlay dùng `bottom-[56px]` (Tailwind) để nằm trên bottom bar. Cần cập nhật để tính thêm safe area:

```tsx
// Peek mode (line 197)
// TRƯỚC: className="absolute bottom-[56px] ..."
// SAU:   dùng inline style với calc

style={{
    bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
    ...
}}

// Full messages overlay (line 285) — tương tự
style={{
    bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
    ...
}}
```

---

## C. Tổng hợp thay đổi

### C1. Files cần sửa

| File | Thay đổi | Mức độ |
|------|----------|--------|
| `index.html` | Thêm `viewport-fit=cover` | 1 dòng |
| `App.tsx:78` | `height: 100vh` → `100dvh` | 1 dòng |
| `App.tsx:93` | `paddingBottom: 56px` → `calc(56px + env(...))` | 1 dòng |
| `App.tsx:135-146` | Thêm CSS fallback cho dvh | ~6 dòng |
| `FloatingBar.tsx:448` | Thêm `paddingBottom: max(8px, env(...))` | 1 dòng |
| `FloatingBar.tsx:197` | `bottom-[56px]` → inline calc với env() | 2 dòng |
| `FloatingBar.tsx:285` | `bottom-[56px]` → inline calc với env() | 2 dòng |

### C2. Browser Support

| Feature | Safari | Chrome iOS | Chrome Android | Firefox |
|---------|--------|-----------|---------------|---------|
| `dvh` | 15.4+ (2022) | 108+ (2022) | 108+ (2022) | 101+ (2022) |
| `env(safe-area-inset-*)` | 11.2+ (2017) | 69+ (2018) | 69+ (2018) | N/A* |
| `viewport-fit=cover` | 11+ (2017) | All iOS | N/A (Android) | N/A |
| CSS `max()` | 11.1+ (2018) | 79+ (2020) | 79+ (2020) | 75+ (2020) |

*Firefox Android: `env(safe-area-inset-*)` trả về 0 — vô hại, fallback giá trị mặc đến hoạt động.

**Kết luận**: Tất cả target devices (iPhone 15+, iOS 26) đều hỗ trợ đầy đủ. Fallback cho trình duyệt cũ đảm bảo không breaking.

### C3. Thứ tự triển khai

1. **Bước 1**: Sửa `index.html` — thêm `viewport-fit=cover`
2. **Bước 2**: Sửa `App.tsx` — đổi `100vh` → `100dvh`, cập nhật paddingBottom, thêm CSS fallback
3. **Bước 3**: Sửa `FloatingBar.tsx` — thêm safe area padding, cập nhật overlay bottom positions
4. **Bước 4**: Test trên thiết bị thực (iPhone Safari + Chrome)

---

## D. Test Plan

### D1. Test Cases

| # | Thiết bị | Trình duyệt | Kiểm tra |
|---|----------|-------------|----------|
| 1 | iPhone 16 Pro Max | Safari iOS 26 | FloatingBar hiển thị đầy đủ, không bị URL bar che |
| 2 | iPhone 16 Pro Max | Chrome iOS | FloatingBar hiển thị đầy đủ, không bị ẩn |
| 3 | iPhone 15 Pro | Safari | FloatingBar hiển thị đầy đủ |
| 4 | iPhone SE 3 | Safari | FloatingBar hiển thị đúng trên màn hình nhỏ |
| 5 | Desktop Chrome | 1440x900 | Phone frame hiển thị đúng, FloatingBar ở bottom |
| 6 | Android (Pixel/Samsung) | Chrome | FloatingBar không bị ảnh hưởng bởi thay đổi |

### D2. Checklist cho mỗi test case

- [ ] FloatingBar hiển thị hoàn toàn, không bị cắt
- [ ] Peek mode (lời chúc) hiển thị trên FloatingBar
- [ ] Full messages overlay mở đúng vị trí
- [ ] Input gửi lời chúc hoạt động bình thường
- [ ] Nút "Bắn tim" click được
- [ ] Nút Album click được
- [ ] Scroll nội dung không bị che bởi FloatingBar
- [ ] ThankYou section (cuối trang) nhìn thấy đầy đủ khi scroll hết
- [ ] Landscape mode: FloatingBar vẫn hiển thị đúng
- [ ] Khi Safari URL bar ẩn/hiện (scroll up/down): layout co giãn mượt, không giật

---

## E. Ghi chú kỹ thuật

### E1. Tại sao không dùng `position: fixed`?

FloatingBar hiện dùng `position: absolute; bottom: 0` bên trong phone frame. **Không chuyển sang `fixed`** vì:
- Phone frame có `maxWidth: 430px` và centered. `fixed` sẽ thoát khỏi phone frame, chiếm toàn bộ chiều rộng viewport.
- Trên desktop, phone frame có `border-radius: 36px`. FloatingBar cần nằm bên trong rounded frame.
- `absolute` + container đúng height = hiệu quả tương đương `fixed`, an toàn hơn.

### E2. Tương tác với HeartCanvas

`HeartCanvas` cũng dùng `position: absolute` trong phone frame. Không cần thay đổi vì canvas phủ toàn bộ phone frame (inset: 0) và không bị ảnh hưởng bởi safe area.

### E3. iOS 26 (beta) considerations

iOS 26 thay đổi đáng kể giao diện Safari (Liquid Glass design). URL bar có thể ở bottom hoặc top tùy thiết lập. Fix bằng `dvh` + `env()` hoạt động đúng cho cả hai trường hợp vì đây là cơ chế browser-level, không phụ thuộc vị trí URL bar.

---

## F. Liquid Glass Redesign

### F1. Tổng quan thiết kế

Áp dụng ngôn ngữ thiết kế **Liquid Glass** (Apple iOS 26, WWDC 2025) cho FloatingBar, biến thanh tương tác thành một **floating glass pill** hiện đại, hài hòa với thiết kế Liquid Glass của Safari iOS 26.

**Nguyên tắc Liquid Glass:**
- **Translucency**: Bề mặt bán trong suốt, nhìn thấy nội dung phía sau
- **Specular Highlight**: Viền sáng phía trên mô phỏng ánh sáng phản chiếu trên kính
- **Floating**: Thanh bar tách rời khỏi edges, tạo cảm giác lơ lửng
- **Concentric Shapes**: Bo tròn đồng tâm, pill-shape
- **Depth**: Đổ bóng nhiều lớp tạo chiều sâu

### F2. Thiết kế chi tiết — Floating Glass Pill Bar

**TRƯỚC** (Edge-attached solid bar):
```
┌─────────────────────────────────────┐
│ [Gửi lời chúc... 😊] [❤ Bắn tim] [📷]│
├─────────────────────────────────────┤ ← border-top, solid white
│ (edge-to-edge, no radius)          │
└─────────────────────────────────────┘
```

**SAU** (Floating glass pill):
```
        ╭─────────────────────────────────╮
        │ ✧ specular highlight (top edge) │
        │ [Gửi lời chúc... 😊] [❤ Bắn tim] [📷]│
        │         translucent glass       │
        ╰─────────────────────────────────╯
              ░░░ subtle shadow ░░░
         ↕ 6px (hoặc safe-area-inset) ↕
──────────────── bottom edge ────────────────
```

### F3. CSS Properties — Main Bar

```css
/* Floating position */
position: absolute;
bottom: max(6px, env(safe-area-inset-bottom, 6px));
left: 10px;
right: 10px;

/* Pill shape */
border-radius: 22px;

/* Glass material — warm adaptation cho wedding theme */
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);

/* Subtle border — warm white */
border: 0.5px solid rgba(255, 255, 255, 0.65);

/* Depth — layered shadows + specular highlight */
box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.08),      /* Elevation shadow */
    0 1px 3px rgba(0, 0, 0, 0.04),       /* Close shadow */
    inset 0 1px 0 0 rgba(255, 255, 255, 0.5);  /* Specular highlight top edge */

/* Content padding */
padding: 8px 12px;
```

### F4. CSS Properties — Inner Elements

**Input area** (glass-tinted cream):
```css
background: rgba(240, 235, 226, 0.5);  /* Warm cream, semi-transparent */
border-radius: 18px;
border: 0.5px solid rgba(212, 204, 190, 0.25);
padding: 7px 12px;
```

**"Bắn tim" button** (warm coral glass):
```css
background: rgba(232, 180, 160, 0.25);
border-radius: 18px;
border: 0.5px solid rgba(232, 180, 160, 0.15);
padding: 7px 12px;
```

**Album button** (elevated coral circle with glass shadow):
```css
background: #D4856A;
border-radius: 50%;
box-shadow:
    0 2px 12px rgba(212, 133, 106, 0.35),
    0 1px 3px rgba(0, 0, 0, 0.06);
```

### F5. Color Palette Harmony

| Element | Color | Opacity | Rationale |
|---------|-------|---------|-----------|
| Bar background | `#FFFFFF` | 55% | Đủ trong suốt để nhìn thấy content, đủ đậm để đọc text |
| Bar border | `#FFFFFF` | 65% | Viền nhẹ định hình glass edge |
| Specular highlight | `#FFFFFF` | 50% | Mô phỏng ánh sáng, inset 1px top |
| Shadow primary | `#000000` | 8% | Elevation shadow, soft |
| Input background | `#F0EBE2` | 50% | Cream tint, hài hòa với page background |
| Bắn tim background | `#E8B4A0` | 25% | Coral tint, hài hòa với accent color |

### F6. Accessibility — `prefers-reduced-transparency`

```css
@media (prefers-reduced-transparency: reduce) {
    .floating-bar-glass {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 1px solid rgba(212, 204, 190, 0.5);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
}
```

Fallback về solid background khi người dùng yêu cầu giảm transparency (WCAG compliance).

### F7. Overlay Adjustments

Peek mode và Full messages overlay cần cập nhật `bottom` position để khớp với thanh bar mới (floating, có bottom offset):

```css
/* Bar effective height ≈ 50px, bottom offset ≈ max(6px, safe-area) */
/* Overlay bottom = bar_height + bar_bottom_offset */
bottom: calc(56px + max(6px, env(safe-area-inset-bottom, 6px)));
```

### F8. Tổng hợp thay đổi (cập nhật Section C)

| File | Thay đổi | Mức độ |
|------|----------|--------|
| `index.html` | Thêm `viewport-fit=cover` | 1 dòng |
| `App.tsx:78` | `height: 100vh` → `100dvh` | 1 dòng |
| `App.tsx:93` | `paddingBottom` → `calc(66px + env(...))` | 1 dòng |
| `App.tsx:135-146` | Thêm CSS fallback cho dvh | ~6 dòng |
| `FloatingBar.tsx` | Redesign BOTTOM BAR → Liquid Glass floating pill | ~25 dòng |
| `FloatingBar.tsx` | Cập nhật overlay bottom positions | 4 dòng |
| `FloatingBar.tsx` | Thêm CSS `prefers-reduced-transparency` fallback | ~10 dòng |
