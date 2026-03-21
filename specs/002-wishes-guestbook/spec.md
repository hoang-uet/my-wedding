# Feature Specification: Lời chúc từ khách mời (Guestbook)

**Feature ID**: 002-wishes-guestbook
**Created**: 2026-03-21
**Status**: Chưa triển khai
**Dependencies**: Supabase (`@supabase/supabase-js`)

## Tổng quan

Cho phép khách mời gửi lời chúc đến cô dâu chú rể. Tất cả lời chúc hiển thị realtime kiểu **livestream chat** để mọi người cùng đọc. Không yêu cầu đăng nhập — chỉ cần nhập tên lần đầu qua modal.

## Vị trí trong UI

Tính năng này **tích hợp vào FloatingBar hiện có** (`src/app/components/FloatingBar.tsx`), thay thế hệ thống `MOCK_MESSAGES` bằng dữ liệu thật từ Supabase.

### Trạng thái mặc định: Peek Mode

Khi vào trang, hiển thị sẵn **~5 lời chúc mới nhất** dạng semi-transparent overlay phía trên bottom bar. Mục đích: thu hút sự chú ý, khuyến khích khách gửi lời chúc.

```
┌─────────────────────────────────────┐
│                                     │
│    (nội dung trang cuộn phía trên)  │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────[✕]──┐  │  ← Peek overlay (opacity ~0.6)
│  │  Thanh: 🌸 Chúc mừng!       │  │     Auto-scroll loop liên tục
│  │  Ngọc: 🎉 Hạnh phúc!        │  │     Hiển thị mặc định khi vào trang
│  │  Erik: 💕 Mãi bên nhau!     │  │     Gradient fade ở top & bottom
│  └──────────────────────────────┘  │
├─────────────────────────────────────┤
│ [Gửi lời chúc...] [♥ Bắn tim] [📷] │  ← Bottom bar (giữ nguyên layout)
└─────────────────────────────────────┘
```

### Trạng thái mở rộng: Full Messages Overlay

Khi khách click "Gửi lời chúc...", peek mode tắt, chuyển sang overlay đầy đủ với input gửi lời chúc.

```
┌─────────────────────────────────────┐
│                                     │
│    (nội dung trang cuộn phía trên)  │
│                                     │
├─────────────────────────────────────┤  ← bottom-[56px]
│  ┌───────────────────────────────┐  │
│  │  Danh sách lời chúc           │  │  ← Messages overlay (max 55vh)
│  │  auto-scroll kiểu livestream  │  │     Hiển thị khi showMessages=true
│  │  ┌─────────────────────────┐  │  │
│  │  │ Thanh: 🌸 Chúc mừng!   │  │  │
│  │  │ Ngọc: 🎉 Hạnh phúc!    │  │  │
│  │  │ Erik: 💕 Mãi bên nhau! │  │  │
│  │  └─────────────────────────┘  │  │
│  │         [↓ Lời chúc mới]     │  │  ← Indicator khi có tin mới
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│ [Gửi lời chúc...] [♥ Bắn tim] [📷] │  ← Bottom bar (giữ nguyên layout)
└─────────────────────────────────────┘
```

## User Flow

```
Trang load xong
        │
        ▼
  Fetch ~5 lời chúc mới nhất từ Supabase
        │
        ▼
  Hiển thị PEEK MODE (mặc định)
  → Semi-transparent overlay (~0.6 opacity)
  → Auto-scroll loop liên tục
  → Gradient fade ở top & bottom
        │
        ├── User click [✕] trên peek → Ẩn peek overlay
        │   (không persist, chỉ trong session)
        │
        └── User click "Gửi lời chúc..."
                │
                ▼
          localStorage có tên?
            │         │
           CÓ       KHÔNG
            │         │
            │         ▼
            │   Modal nhập tên
            │   [Tên của bạn: ____]
            │   [Xác nhận]
            │         │
            │         ▼
            │   Lưu tên vào localStorage
            │         │
            ◄─────────┘
                │
                ▼
          Tắt peek mode
          Mở FULL MESSAGES OVERLAY
          + hiện input lời chúc
          + hiện danh sách realtime đầy đủ
                │
                ▼
          Khách nhập lời chúc → Gửi
                │
                ▼
          INSERT vào Supabase
          → Realtime broadcast
          → Tất cả khách thấy ngay
```

## Yêu cầu chức năng

### 0. Peek Mode — Preview lời chúc mặc định

- **Mặc định khi vào trang:** Hiển thị ~5 lời chúc mới nhất dạng semi-transparent overlay phía trên bottom bar
- **Opacity:** ~0.6 (mờ nhẹ, đủ để đọc nhưng không che nội dung chính)
- **Auto-scroll loop:** Cuộn liên tục từ trên xuống dưới, lặp lại khi hết danh sách (hoặc cuộn chậm nếu ít tin)
- **Gradient fade:** Top & bottom của peek overlay có gradient fade-out để hòa vào background
- **Nút ẩn:** Icon [✕] nhỏ góc phải trên peek overlay để ẩn đi
- **Không persist:** Trạng thái ẩn/hiện peek chỉ trong session hiện tại, không lưu localStorage
- **Chuyển đổi sang Full Mode:** Khi user click "Gửi lời chúc..." → peek tắt, chuyển sang full messages overlay
- **Khi đóng Full Mode:** Quay lại peek mode (trừ khi user đã ẩn peek trước đó)
- **Empty state:** Nếu chưa có lời chúc nào → không hiển thị peek mode
- **Styling:** Màu sắc hài hòa với tone cream/beige (#F0EBE2), green (#4A5D3A), warm accents (#D4856A, #E87461) của trang
- **Animation:** Fade in mượt khi trang load, fade out khi ẩn. Sử dụng `motion` library

### 1. Modal nhập tên (lần đầu)

- **Trigger:** Khách click vào ô "Gửi lời chúc..." khi `localStorage` chưa có key `guest_name`
- **Nội dung modal:** Input "Tên của bạn" + nút "Xác nhận"
- **Validate:** Tên không rỗng, tối thiểu 2 ký tự
- **Sau khi xác nhận:** Lưu tên vào `localStorage` key `guest_name`, đóng modal, mở messages overlay + input lời chúc
- **Lần sau:** Nếu `localStorage` đã có `guest_name` → bỏ qua modal, mở thẳng messages overlay

### 2. Gửi lời chúc

- **Input:** Nội dung lời chúc (ô text trong FloatingBar khi đã mở)
- **Tên người gửi:** Tự động lấy từ `localStorage` key `guest_name`
- **Validate:** Nội dung không rỗng, giới hạn 1000 ký tự
- **Submit:** INSERT vào bảng `wishes` trên Supabase
- **Loading state:** Disable nút gửi + hiện spinner trong khi chờ
- **Limit rate:** Tối thiểu 5s giữa 2 lần gửi để tránh spam, hiển thị countdown thay thế cho button submit để biết khi nào có thể gửi tiếp
- **Thành công:** Clear input, lời chúc xuất hiện trong danh sách qua realtime
- **Lỗi:** Hiện toast/inline error, giữ nguyên nội dung input để thử lại
- **Enter key:** Gửi khi nhấn Enter (giữ nguyên behavior hiện tại)

### 3. Hiển thị lời chúc (Livestream style)

- **Mặc định:** Danh sách auto-scroll từ dưới lên, giống comment section của livestream
- **Auto-scroll:** Khi có lời chúc mới từ realtime → tự cuộn xuống cuối (smooth)
- **Manual scroll:** Khi user scroll lên đọc lời chúc cũ → **tạm dừng auto-scroll**
- **Resume auto-scroll:** Khi user scroll về cuối danh sách (hoặc click nút "↓ Lời chúc mới")
- **Mỗi lời chúc hiển thị:** Tên người gửi (bold, #4A5D3A) + nội dung + thời gian gửi (relative: "vừa xong", "5 phút trước"...)
- **Sắp xếp:** Cũ nhất ở trên, mới nhất ở dưới (auto-scroll tới cuối)
- **Chỉ đọc:** Không có reply, reaction hay bất kỳ tương tác nào khác
- **Empty state:** Khi chưa có lời chúc nào → "Hãy là người đầu tiên gửi lời chúc! 💌"

### 4. Supabase

#### Bảng `wishes`
```sql
CREATE TABLE wishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  message text NOT NULL CHECK (char_length(message) <= 500),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Cho phép mọi người đọc
CREATE POLICY "wishes_select" ON wishes FOR SELECT USING (true);

-- Cho phép mọi người insert (anonymous)
CREATE POLICY "wishes_insert" ON wishes FOR INSERT WITH CHECK (true);

-- Bật RLS
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Bật Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
```

#### Supabase Client
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

#### Environment Variables
```bash
# .env.local (KHÔNG commit)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **Lưu ý:** Vite yêu cầu prefix `VITE_` để expose env vars cho client-side code.

## Acceptance Scenarios

1. **Given** khách mời mở trang lần đầu (localStorage trống), **When** click vào "Gửi lời chúc...", **Then** modal nhập tên xuất hiện. Nhập tên "Minh" + nhấn Xác nhận → modal đóng, messages overlay mở, input lời chúc sẵn sàng.

2. **Given** khách đã nhập tên trước đó (localStorage có `guest_name`), **When** click "Gửi lời chúc...", **Then** messages overlay mở thẳng, không hiện modal.

3. **Given** messages overlay đang mở, **When** danh sách lời chúc hiển thị, **Then** auto-scroll xuống cuối giống livestream chat. Lời chúc mới nhất xuất hiện ở dưới cùng.

4. **Given** khách nhập "Chúc hai bạn trăm năm hạnh phúc" và nhấn gửi, **When** Supabase insert thành công, **Then** input clear, lời chúc xuất hiện trong danh sách kèm tên và thời gian.

5. **Given** 2 khách cùng mở trang, **When** khách A gửi lời chúc, **Then** khách B thấy lời chúc mới xuất hiện realtime (auto-scroll nếu đang ở cuối).

6. **Given** khách đang đọc lời chúc cũ (đã scroll lên), **When** lời chúc mới đến, **Then** auto-scroll KHÔNG cuộn (không gây mất chỗ đọc). Hiện indicator "↓ Lời chúc mới" để quay lại cuối.

7. **Given** khách gửi lời chúc rỗng hoặc > 500 ký tự, **When** nhấn gửi, **Then** hiển thị validation error inline, không gửi request.

8. **Given** Supabase bị lỗi hoặc mất kết nối, **When** khách gửi lời chúc, **Then** hiển thị thông báo lỗi, giữ nguyên nội dung trong input.

### Peek Mode Scenarios

9. **Given** trang vừa load xong và có ít nhất 1 lời chúc trong DB, **When** render hoàn tất, **Then** peek overlay hiển thị ~5 lời chúc mới nhất dạng semi-transparent, auto-scroll loop liên tục.

10. **Given** peek mode đang hiển thị, **When** khách click nút [✕] trên peek overlay, **Then** peek overlay fade out và ẩn đi. Bottom bar vẫn hiển thị bình thường.

11. **Given** peek mode đang hiển thị, **When** khách click "Gửi lời chúc...", **Then** peek tắt, chuyển sang full messages overlay (có name modal nếu lần đầu).

12. **Given** full messages overlay đang mở, **When** khách click đóng overlay, **Then** quay lại peek mode (nếu chưa bị ẩn thủ công trước đó).

13. **Given** chưa có lời chúc nào trong DB, **When** trang load, **Then** peek mode KHÔNG hiển thị. Chỉ hiện bottom bar với placeholder "Gửi lời chúc...".

## Cấu trúc code

### Files cần thay đổi
```
src/app/components/FloatingBar.tsx     # Thay MOCK_MESSAGES bằng Supabase realtime
                                       # Thêm modal nhập tên
                                       # Thêm logic auto-scroll livestream
```

### Files cần tạo mới
```
src/lib/supabase.ts                    # Supabase client instance
src/app/components/useWishes.ts        # Hook: fetch, subscribe realtime, insert
src/app/components/NameModal.tsx        # Modal nhập tên lần đầu
```

### Chi tiết hook `useWishes`
```typescript
// Interface gợi ý
interface UseWishesReturn {
  wishes: Wish[]              // Danh sách lời chúc (cũ → mới)
  isLoading: boolean          // Đang tải danh sách ban đầu
  sendWish: (message: string) => Promise<void>  // Gửi lời chúc
  isSending: boolean          // Đang gửi
  error: string | null        // Lỗi gần nhất
}

interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}
```

**Trách nhiệm:**
- Fetch danh sách wishes ban đầu (ORDER BY created_at ASC)
- Subscribe Supabase Realtime trên bảng `wishes` (event: INSERT)
- Khi nhận INSERT event → append vào cuối mảng `wishes`
- `sendWish`: đọc `guest_name` từ localStorage, INSERT vào Supabase
- Cleanup subscription khi unmount

### Những gì GIỮA NGUYÊN trong FloatingBar
- Layout bottom bar (ô input, nút Bắn tim, nút Camera)
- Hearts animation (shootHearts)
- Nút scroll to Gallery
- Styling tổng thể (backdrop blur, colors, spacing)

### Những gì XÓA trong FloatingBar
- `MOCK_MESSAGES` array
- `messages` state khởi tạo từ mock
- `sendMessage` function hiện tại (thay bằng `sendWish` từ hook)

## Yêu cầu UI/UX & Styling

- **Tone màu chủ đạo:** Hài hòa với palette hiện tại của trang:
  - Background: #F0EBE2 (cream/beige)
  - Text accent: #4A5D3A (olive green) cho tên người gửi
  - Warm accents: #D4856A, #E87461 cho highlights
  - Neutral text: #4A4A4A, #8B7355
- **Font:** Sử dụng `var(--font-primary)` nhất quán với toàn trang
- **Border & Shadow:** Nhẹ nhàng, subtle — `rgba(212,204,190,0.4)` border, `rgba(0,0,0,0.04)` shadow
- **Animation:** Sử dụng `motion` library cho:
  - Peek overlay fade in khi trang load
  - Peek overlay fade out khi ẩn
  - Transition giữa peek mode ↔ full messages overlay
  - Message item entrance animation (subtle slide-up + fade)
- **Backdrop blur:** Giữ nhất quán với bottom bar hiện tại (`blur(12px)`)
- **Mobile-first:** Thiết kế tối ưu cho viewport 430px (phone frame)

## Ghi chú bổ sung

- **Rate limit:** Tối thiểu 5s giữa 2 lần gửi, hiển thị countdown thay thế nút gửi
- **Thời gian relative:** Dùng `date-fns/formatDistanceToNow` (đã có trong project) với locale tiếng Việt
- **Không phân trang:** Load toàn bộ wishes (dự kiến < 200 lời chúc cho 1 đám cưới). Nếu tương lai cần, thêm LIMIT + load more
- **Không cần emoji picker:** Giữ đơn giản, khách tự gõ emoji từ bàn phím
- **Peek mode:** Chỉ fetch ~5 lời chúc mới nhất cho peek. Full overlay load toàn bộ
