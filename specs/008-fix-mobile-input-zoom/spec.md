# Spec 008: Fix Mobile Auto-Zoom on Input Focus

## Problem

Trên iOS Safari, khi người dùng focus vào các trường `<input>`, `<textarea>`, `<select>` có `font-size` < **16px**, trình duyệt tự động zoom vào (auto-zoom). Sau khi blur, tỷ lệ zoom không reset về ban đầu — gây hiện tượng **"Sticky Zoom"** khiến toàn bộ trang bị phóng to, layout bị lệch.

### Ngưỡng kích hoạt

iOS Safari auto-zoom khi `font-size` của input element **computed value < 16px** tại thời điểm focus. Đây là hành vi mặc định của WebKit trên iOS, không phải bug.

### Các phần tử bị ảnh hưởng

| Component | File | Element | Font Size hiện tại | Mức ảnh hưởng |
|-----------|------|---------|-------------------|---------------|
| NameModal | `NameModal.tsx:116` | `<input>` nhập tên | **14px** (inline style) | CAO — modal nhập tên lần đầu |
| FloatingBar | `FloatingBar.tsx:484` | `<input>` gửi lời chúc | **13px** (inline style) | CAO — input dùng thường xuyên nhất |
| RSVPForm | `RSVPForm.tsx:76` | `inputStyle` (input, select, textarea) | **14px** (inline style) | TRUNG BÌNH — form RSVP |

### Viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

Hiện tại **đúng chuẩn** — không có `maximum-scale=1` (sẽ vi phạm accessibility, chặn pinch-to-zoom).

### CSS base layer

`theme.css` đã khai báo `input { font-size: var(--text-base) }` (= 16px), nhưng các component trên **override bằng inline style** với giá trị nhỏ hơn.

## Đánh giá giải pháp

### Option 1: Nâng font-size lên 16px cho mobile (CHỌN)

- Sửa inline `fontSize` trong 3 component thành `16px`
- Thêm CSS safety net: `@media (max-width: 768px)` đảm bảo tất cả input/textarea/select có `font-size >= 16px`
- **Ưu điểm:** Clean, đúng best practice, không ảnh hưởng accessibility
- **Nhược điểm:** Text input hơi to hơn một chút — nhưng phù hợp mobile UX

### Option 2: CSS `transform: scale()` trick

- Giữ font-size nhỏ, dùng `font-size: 16px; transform: scale(0.875)` để hiển thị 14px
- **Ưu điểm:** Giữ nguyên visual size
- **Nhược điểm:** Phức tạp, ảnh hưởng layout flow, khó maintain, caret position bị lệch

### Option 3: `maximum-scale=1` trên viewport

- Thêm `maximum-scale=1, user-scalable=no` vào meta viewport
- **Ưu điểm:** Fix nhanh 1 dòng
- **Nhược điểm:** **VI PHẠM WCAG 1.4.4** — chặn người dùng khiếm thị zoom trang. KHÔNG chấp nhận.

## Kế hoạch triển khai

### Files cần sửa

1. **`src/app/components/NameModal.tsx`** — Line 116: `fontSize: '14px'` → `'16px'`
2. **`src/app/components/FloatingBar.tsx`** — Line 484: `fontSize: '13px'` → `'16px'`
3. **`src/app/components/RSVPForm.tsx`** — Line 76: `fontSize: '14px'` → `'16px'` trong `inputStyle`
4. **`src/styles/theme.css`** — Thêm CSS safety net cho mobile

### CSS Safety Net

```css
/* Prevent iOS Safari auto-zoom on input focus */
@media screen and (max-width: 768px) {
    input,
    textarea,
    select {
        font-size: 16px !important;
    }
}
```

Đặt trong `@layer base` để có specificity hợp lý, dùng `!important` vì inline styles override CSS.

### Không sửa

- `src/app/components/ui/input.tsx` — shadcn/ui đã dùng `text-base` (16px) trên mobile, `md:text-sm` trên desktop. Đúng pattern.
- `src/app/components/ui/textarea.tsx` — Tương tự, đã đúng.
- Radio buttons trong RSVPForm — Không trigger auto-zoom.
- Admin components — Không phải mobile-facing.

## Verification

- Giả lập iPhone Safari viewport (390x844) trên Playwright
- Kịch bản: Focus input → kiểm tra không zoom → Blur → kiểm tra scale không thay đổi
- Test trên: NameModal, FloatingBar wish input, RSVPForm
