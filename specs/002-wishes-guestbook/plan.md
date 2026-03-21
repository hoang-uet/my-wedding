# Implementation Plan: Wishes Guestbook (002)

**Ngày tạo:** 2026-03-21
**Spec:** [spec.md](./spec.md)
**Trạng thái:** Chờ review

---

## Phân tích Project

| Aspect | Detail |
|--------|--------|
| **Type** | Vite + React 18 SPA (không phải Next.js) |
| **Package manager** | `yarn` |
| **FloatingBar hiện tại** | MOCK_MESSAGES, overlay cơ bản, hearts animation |
| **Thư mục `src/lib/`** | Chưa tồn tại — cần tạo |
| **Test files** | Chưa có, Playwright đã config (`testDir: ./specs`, match `**/*.test.ts`) |
| **Đã có sẵn** | `date-fns` v3.6.0, `motion` v12.23.x, `sonner` v2.0.3, `@radix-ui/react-dialog` |
| **`.env`** | Chưa có, `.gitignore` đã cover `.env.local` |

---

## Bước 1: Supabase Infrastructure

### 1.1 Cài đặt package

```bash
yarn add @supabase/supabase-js
```

### 1.2 Tạo Supabase client

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 1.3 Environment variables

**File:** `.env.example`

```bash
# Supabase — lấy từ https://supabase.com/dashboard → Settings → API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **Lưu ý:** User tự tạo `.env.local` từ `.env.example`. File `.env.local` KHÔNG commit (đã có trong `.gitignore`).

### 1.4 SQL Schema (chạy trên Supabase Dashboard → SQL Editor)

```sql
-- Tạo bảng wishes
CREATE TABLE wishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  message text NOT NULL CHECK (char_length(message) <= 1000),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Bật Row Level Security
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc (anonymous)
CREATE POLICY "wishes_select" ON wishes FOR SELECT USING (true);

-- Cho phép mọi người insert (anonymous)
CREATE POLICY "wishes_insert" ON wishes FOR INSERT WITH CHECK (true);

-- Bật Realtime cho bảng wishes
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
```

---

## Bước 2: Hook `useWishes`

**File:** `src/app/components/useWishes.ts`

### Interface

```typescript
interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}

interface UseWishesReturn {
  wishes: Wish[]
  isLoading: boolean
  sendWish: (message: string) => Promise<void>
  isSending: boolean
  error: string | null
  cooldownRemaining: number  // giây còn lại trước khi gửi tiếp (0 = sẵn sàng)
}
```

### Trách nhiệm

- **Fetch initial:** `SELECT * FROM wishes ORDER BY created_at ASC`
- **Realtime subscribe:** Listen INSERT events trên channel `wishes` → append vào cuối mảng
- **`sendWish(message)`:**
  - Đọc `guest_name` từ `localStorage`
  - Validate: message không rỗng, <= 1000 ký tự
  - INSERT vào Supabase
  - Client-side rate limit: 5s giữa 2 lần gửi, `cooldownRemaining` countdown mỗi giây
- **Error handling:** Set `error` state, giữ nguyên input
- **Cleanup:** Unsubscribe realtime channel on unmount

### Relative time

Dùng `date-fns/formatDistanceToNow` với locale `vi`:

```typescript
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const timeAgo = formatDistanceToNow(new Date(wish.created_at), {
  addSuffix: true,
  locale: vi,
})
```

---

## Bước 3: NameModal Component

**File:** `src/app/components/NameModal.tsx`

### Thiết kế

- Dùng `@radix-ui/react-dialog` (đã có trong project)
- Controlled bởi parent (FloatingBar) qua `open` + `onConfirm(name)` props
- Input "Tên của bạn" + nút "Xác nhận"
- Validate: tên không rỗng, >= 2 ký tự
- Inline error message khi validation fail
- Khi confirm: gọi `onConfirm(name)` → parent lưu vào `localStorage.guest_name`
- Styling: hài hòa với tone cream/beige, olive green accent

---

## Bước 4: Refactor FloatingBar

**File:** `src/app/components/FloatingBar.tsx` — thay đổi lớn nhất

### 4.1 Xóa

- `MOCK_MESSAGES` array
- `messages` state khởi tạo từ mock
- `sendMessage` function hiện tại

### 4.2 Giữ nguyên

- Layout bottom bar (ô input, nút Bắn tim, nút Camera)
- Hearts animation (`shootHearts`, `hearts` state, SVG + keyframes)
- Props `onScrollToGallery`, `onScrollToGift`
- Styling tổng thể (backdrop blur, colors, spacing)

### 4.3 Thêm: Peek Mode (mặc định khi vào trang)

- Semi-transparent overlay phía trên bottom bar
- Hiển thị ~5 lời chúc mới nhất (fetch riêng hoặc slice từ `wishes`)
- Opacity ~0.6, gradient fade top & bottom
- Auto-scroll loop liên tục (CSS animation hoặc JS interval)
- Nút [✕] góc phải trên để ẩn peek (state chỉ trong session, không persist)
- Empty state: không hiển thị peek nếu chưa có lời chúc
- Animation: `motion` fade in khi trang load, fade out khi ẩn

### 4.4 Thêm: Full Messages Overlay

- Trigger: click "Gửi lời chúc..."
- Nếu chưa có `guest_name` trong localStorage → mở NameModal trước
- Danh sách lời chúc đầy đủ (từ `useWishes`), cũ → mới (auto-scroll xuống cuối)
- Auto-scroll: mới → cuộn xuống (smooth)
- Manual scroll: khi user scroll lên → tạm dừng auto-scroll
- Indicator "↓ Lời chúc mới" khi có tin mới và user đang đọc lời chúc cũ
- Input gửi lời chúc (thay thế placeholder "Gửi lời chúc...")
- Rate limit: hiển thị countdown (5s) thay nút gửi sau mỗi lần submit
- Loading state: disable nút gửi + spinner
- Error: inline error, giữ nội dung input

### 4.5 Thêm: Animations (motion library)

- Peek overlay: `AnimatePresence` + `motion.div` fade in/out
- Full messages overlay: slide-up transition
- Message items: subtle slide-up + fade entrance
- Transition peek ↔ full: smooth cross-fade

### 4.6 State machine tổng thể

```
                    ┌─────────────┐
    trang load ───▶ │  PEEK MODE  │ ◀─── đóng full overlay (nếu chưa dismiss peek)
                    └─────┬───────┘
                          │
              ┌───────────┼───────────┐
              ▼                       ▼
    ┌─────────────────┐     ┌─────────────────┐
    │  PEEK DISMISSED │     │   FULL OVERLAY   │
    │  (chỉ bar)      │     │ (messages+input) │
    └─────────────────┘     └─────────────────┘
```

States:
- `peekDismissed: boolean` — user đã ẩn peek (session only)
- `showMessages: boolean` — full overlay đang mở
- Peek hiển thị khi: `!showMessages && !peekDismissed && wishes.length > 0`

---

## Bước 5: Playwright Tests

**File:** `specs/002-wishes-guestbook/guestbook.test.ts`

> **Lưu ý:** Playwright config đã set `testDir: ./specs` và `testMatch: **/*.test.ts`, nên file test đặt trong thư mục spec là đúng.

### Test cases

1. **Gửi lời chúc thành công**
   - Set localStorage `guest_name` = "TestUser"
   - Click "Gửi lời chúc..." → messages overlay mở
   - Nhập nội dung → Enter/click Send
   - Verify: input cleared, lời chúc xuất hiện trong danh sách

2. **Hiển thị lỗi khi input không hợp lệ**
   - Submit lời chúc rỗng → error message
   - Submit lời chúc > 1000 ký tự → error message

3. **Name Modal hiển thị lần đầu**
   - Clear localStorage
   - Click "Gửi lời chúc..." → modal nhập tên xuất hiện
   - Nhập tên < 2 ký tự → validation error
   - Nhập tên hợp lệ → modal đóng, overlay mở

4. **Danh sách lời chúc hiển thị**
   - Verify danh sách lời chúc hiển thị sau khi submit
   - Verify thứ tự: cũ nhất trên, mới nhất dưới

> **Giới hạn:** Tests cần Supabase running. Có thể cần mock Supabase cho CI hoặc chạy với `.env.local` thật.

---

## Bước 6: Cập nhật CLAUDE.md

- **Tech Stack table:** Thêm row Supabase `@supabase/supabase-js`
- **Feature table (Section 4):** Cập nhật status 002 → "Đã triển khai"
- **Cấu trúc dự án (Section 7):** Thêm `src/lib/supabase.ts`, `NameModal.tsx`, `useWishes.ts`

---

## Tổng kết files

### Files tạo mới

| File | Mục đích |
|------|---------|
| `src/lib/supabase.ts` | Supabase client singleton |
| `src/app/components/useWishes.ts` | Hook: fetch, subscribe, insert wishes |
| `src/app/components/NameModal.tsx` | Modal nhập tên lần đầu |
| `.env.example` | Template biến môi trường |
| `specs/002-wishes-guestbook/guestbook.test.ts` | Playwright UI tests |

### Files thay đổi

| File | Thay đổi |
|------|---------|
| `src/app/components/FloatingBar.tsx` | Refactor lớn: xóa mock, thêm peek + full overlay + animations |
| `package.json` | Thêm `@supabase/supabase-js` |
| `CLAUDE.md` | Cập nhật tech stack + feature status |

### Files KHÔNG thay đổi

- `src/app/App.tsx` — FloatingBar props giữ nguyên
- `src/app/components/ui/*` — shadcn/ui library
- `wedding-config.ts` — không liên quan
- `image-manifest.ts` — auto-generated

---

## Checklist trước khi triển khai

- [ ] User đã có Supabase project (URL + anon key)
- [ ] User đã review và approve plan này
- [ ] User đã chạy SQL schema trên Supabase Dashboard
