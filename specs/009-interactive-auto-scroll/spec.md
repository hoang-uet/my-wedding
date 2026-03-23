# 009 — Interactive Auto-scroll cho Peek Mode (Wishes)

## Trạng thái: Đang triển khai

## Vấn đề

Peek Mode hiện dùng CSS `@keyframes peekScrollLoop` với `overflow: hidden` trên container. Điều này:
- **Khóa hoàn toàn** quyền scroll thủ công của người dùng
- Không thể vuốt lên xem lời chúc cũ
- Gây ức chế trải nghiệm trên mobile

## Giải pháp: Interactive Auto-scroll

Chuyển từ CSS animation sang **`requestAnimationFrame`-based scroll** để có thể pause/resume dựa trên tương tác người dùng.

### Cơ chế hoạt động

```
┌─────────────────────────────────────────────────┐
│  AUTO-SCROLLING (default)                       │
│  rAF loop: scrollTop += speed * deltaTime       │
│                                                 │
│  ──── user touches/wheels ────►                 │
│                                                 │
│  PAUSED (isInteracting = true)                  │
│  rAF loop stops, user scrolls freely            │
│                                                 │
│  ──── touchend/mouseup + 3s debounce ────►      │
│                                                 │
│  RESUMING (ease-in transition ~0.5s)            │
│  rAF loop restarts with gradual speed ramp      │
│                                                 │
│  ──── speed reaches target ────►                │
│                                                 │
│  AUTO-SCROLLING (loop continues)                │
└─────────────────────────────────────────────────┘
```

### Interaction Logic

| Sự kiện | Hành động |
|---------|-----------|
| `touchstart`, `wheel`, `mousedown` | Pause auto-scroll ngay lập tức |
| `touchend`, `mouseup`, `scrollend` | Bắt đầu debounce timer (3 giây) |
| Debounce timer hết | Resume auto-scroll với ease-in |
| Scroll đến cuối danh sách | Wrap lại đầu (seamless loop) |

### Chi tiết kỹ thuật

1. **Container**: Đổi `overflow: hidden` → `overflow-y: auto` (cho phép scroll thủ công)
2. **Auto-scroll engine**: `requestAnimationFrame` loop thay CSS animation
3. **Seamless loop**: Khi `scrollTop` >= content height (1 bản copy), reset về 0
4. **Speed**: ~30px/s (giữ nguyên tốc độ cũ)
5. **Resume ease-in**: Speed ramp từ 0 → 30px/s trong ~500ms
6. **Debounce**: 3 giây sau interaction cuối cùng mới resume

### Edge Cases

- **Scroll hết danh sách**: Wrap tự động khi đang auto-scroll; khi user scroll thủ công thì để tự nhiên
- **Content thay đổi**: Recalculate wrap point khi `peekWishes` thay đổi
- **Reduced motion**: Nếu `prefers-reduced-motion`, tắt auto-scroll hoàn toàn, chỉ cho scroll thủ công

### Scrollbar Styling

- Ẩn scrollbar mặc định (webkit-scrollbar + scrollbar-width)
- Peek mode không cần hiển thị scrollbar vì container nhỏ

## Files cần sửa

- `src/app/components/FloatingBar.tsx` — Thay CSS animation bằng rAF-based auto-scroll với pause/resume logic
