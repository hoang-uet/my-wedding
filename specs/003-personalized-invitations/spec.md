# Feature Specification: Thiệp Mời Cá Nhân Hóa (Personalized Invitations)

**Feature ID**: 003-personalized-invitations
**Created**: 2026-03-21
**Status**: Chưa triển khai
**Dependencies**: Supabase (`@supabase/supabase-js`), React Router v7 (`react-router`), `nanoid`

---

## Tổng quan

Chuyển đổi thiệp cưới từ **tĩnh (chung)** sang **động (cá nhân hóa)** dựa trên URL hash. Mỗi khách mời nhận link riêng (`/thiep-moi/abc123`) hiển thị tên của họ trên thiệp. Admin (cô dâu/chú rể) quản lý danh sách khách qua dashboard mobile-first (`/thiep-moi`).

### Nguyên tắc cốt lõi

- **Fallback graceful:** Nếu hash không tồn tại hoặc không có hash → hiển thị thiệp chung như hiện tại ("Trân trọng kính mời")
- **Zero disruption:** Giữ nguyên toàn bộ layout, animation, và trải nghiệm trang chủ hiện tại
- **Mobile-first:** Admin dashboard tối ưu cho viewport 430px (phone frame)

---

## A. User Stories

### Góc nhìn Admin (Cô dâu / Chú rể)

**US-A1: Tạo thiệp mời cho khách**
> Là Admin, tôi muốn nhập tên khách mời và nhận link thiệp cá nhân, để gửi thiệp cho từng người qua tin nhắn.

**US-A2: Xem danh sách thiệp đã tạo**
> Là Admin, tôi muốn xem toàn bộ danh sách khách mời đã tạo thiệp, sắp xếp theo mới nhất trước, để quản lý và theo dõi.

**US-A3: Tìm kiếm khách mời**
> Là Admin, tôi muốn tìm khách mời theo tên (không phân biệt hoa thường, có dấu/không dấu), để nhanh chóng tìm link khi cần gửi lại.

**US-A4: Copy link thiệp**
> Là Admin, tôi muốn copy link thiệp của khách vào clipboard bằng 1 tap, để dán nhanh vào tin nhắn Zalo/Messenger.

**US-A5: Xóa thiệp mời**
> Là Admin, tôi muốn xóa thiệp mời đã tạo nhầm, với xác nhận trước khi xóa, để tránh gửi link sai.

### Góc nhìn Khách mời

**US-G1: Nhận thiệp cá nhân**
> Là Khách mời, khi tôi mở link thiệp nhận được, tôi muốn thấy tên mình hiển thị trên thiệp mời, để cảm nhận sự trân trọng.

**US-G2: Xem thiệp khi link không hợp lệ**
> Là Khách mời, khi tôi mở link thiệp không hợp lệ (hash sai/không tồn tại), tôi vẫn muốn xem được thiệp cưới chung, thay vì trang lỗi.

---

## B. Database Schema (Supabase)

### Bảng `invitations`

```sql
CREATE TABLE invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  hash text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index cho tìm kiếm nhanh theo hash
CREATE INDEX idx_invitations_hash ON invitations (hash);

-- Index cho tìm kiếm theo tên (case-insensitive)
CREATE INDEX idx_invitations_guest_name ON invitations USING gin (guest_name gin_trgm_ops);
-- Lưu ý: cần enable extension pg_trgm trước: CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- RLS Policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Guest: chỉ đọc thông qua hash (select cần filter theo hash)
CREATE POLICY "invitations_select_by_hash"
  ON invitations
  FOR SELECT
  USING (true);
  -- Note: Guest chỉ query WHERE hash = :hash nên không lộ toàn bộ danh sách.
  -- Hạn chế thêm nếu cần bảo mật cao hơn (xem mục Security).

-- Admin: full CRUD qua service_role key hoặc authenticated user
CREATE POLICY "invitations_admin_all"
  ON invitations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Logic tạo Hash

Sử dụng `nanoid` với custom alphabet (URL-safe, dễ đọc, tránh ký tự gây nhầm lẫn):

```typescript
import { nanoid, customAlphabet } from 'nanoid'

// Alphabet: lowercase + digits, bỏ 0/o/l/1 để tránh nhầm lẫn
const generateHash = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 8)

// Ví dụ output: "k7m3xp9a", "nh5vw2ec"
// URL: /thiep-moi/k7m3xp9a
// Xác suất trùng: ~1/2^40 → đủ an toàn cho vài trăm khách
```

**Dependency mới cần cài:** `nanoid`

```bash
yarn add nanoid
```

---

## C. Frontend Architecture

### C.1. Routing Setup (React Router v7)

Dự án hiện tại là SPA không có routing. Cần thêm React Router v7 (đã cài sẵn nhưng chưa dùng).

#### Cấu trúc route

```
/                       → Trang chủ (thiệp chung, layout hiện tại giữ nguyên)
/thiep-moi/:hash        → Thiệp cá nhân (cùng layout, tên khách thay thế text generic)
/tao-thiep             → Admin dashboard (trang riêng, layout khác)
```

#### File mới: `src/router.tsx`

```typescript
import { createBrowserRouter } from 'react-router'
import App from './app/App'
import { AdminDashboard } from './app/components/AdminDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/thiep-moi/:hash',
    element: <App />,
  },
  {
    path: '/tao-thiep',
    element: <AdminDashboard />,
  },
])
```

#### Cập nhật `src/main.tsx`

```typescript
import { RouterProvider } from 'react-router'
import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

#### Vercel SPA Routing — `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> **Lưu ý:** File `vercel.json` đảm bảo tất cả route được serve bởi `index.html` (SPA behavior). Nếu file đã tồn tại, chỉ thêm mục `rewrites`.

### C.2. Guest Page (`/thiep-moi/:hash`)

#### User Flow

```
Khách mở link /thiep-moi/k7m3xp9a
        │
        ▼
  React Router match route
  → useParams() lấy hash = "k7m3xp9a"
        │
        ▼
  Custom hook useInvitation(hash)
  → Supabase SELECT guest_name FROM invitations WHERE hash = :hash
        │
        ├── Loading → Skeleton/spinner nhẹ trên card text
        │
        ├── Found → guestName = "Anh Tuấn & Gia Đình"
        │             → Truyền vào EnvelopeCard
        │             → Card hiển thị: "Trân trọng kính mời\nAnh Tuấn & Gia Đình"
        │
        └── Not Found (hash sai/không tồn tại)
                      → guestName = null
                      → Fallback: hiển thị thiệp chung ("Trân trọng kính mời")
                      → Không hiển thị error page
```

#### Hook mới: `useInvitation`

```typescript
// src/app/components/useInvitation.ts
interface UseInvitationReturn {
  guestName: string | null   // null = chưa load xong hoặc không tìm thấy
  isLoading: boolean
  isFound: boolean            // true nếu hash khớp với DB
}

function useInvitation(hash: string | undefined): UseInvitationReturn
```

**Trách nhiệm:**
- Nếu `hash` undefined (route `/`) → return `{ guestName: null, isLoading: false, isFound: false }`
- Nếu `hash` có giá trị → query Supabase `SELECT guest_name FROM invitations WHERE hash = :hash LIMIT 1`
- Cache kết quả trong component lifetime (không re-fetch mỗi render)
- Không throw error khi hash không tồn tại → graceful fallback

#### Thay đổi EnvelopeCard

**Prop mới:**
```typescript
interface EnvelopeCardProps {
  onOpen?: () => void
  guestName?: string | null  // Tên khách (null = hiển thị text generic)
}
```

**Thay đổi trong card content (line 317-327 hiện tại):**

```
// Hiện tại (generic):
"Trân trọng kính mời"     ← dòng 1 (font-formal, 13px)

// Khi có guestName (personalized):
"Trân trọng kính mời"     ← dòng 1 (font-formal, 13px)
"Anh Tuấn & Gia Đình"     ← dòng 2 (font nổi bật, xem mục D.1)
```

**Khi `guestName` = null hoặc undefined:** Giữ nguyên text hiện tại "Trân trọng kính mời".

#### Truyền guestName từ App vào EnvelopeCard

```typescript
// Trong App.tsx
import { useParams } from 'react-router'
import { useInvitation } from './components/useInvitation'

export default function App() {
  const { hash } = useParams<{ hash?: string }>()
  const { guestName } = useInvitation(hash)

  // ... existing code ...

  return (
    // ... existing layout ...
    <EnvelopeCard onOpen={handleEnvelopeOpen} guestName={guestName} />
    // ...
  )
}
```

### C.3. Admin Page (`/tao-thiep`)

#### Layout & Structure

```
┌─────────────────────────────────────┐
│          Quản Lý Thiệp Mời         │  ← Header (sticky top)
│         Minh Hoàng & Thanh Thư      │     Couple names từ wedding-config
├─────────────────────────────────────┤
│  🔍 [ Tìm khách mời...          ]  │  ← Search bar (sticky)
│  [+ Tạo thiệp mới]                 │     CTA button
├─────────────────────────────────────┤
│                                     │
│  ┌─ Invitation Card ──────────────┐ │
│  │  👤 Anh Tuấn & Gia Đình       │ │  ← Tên khách (bold)
│  │  🔗 /thiep-moi/k7m3xp9a      │ │  ← Hash (mono, truncated)
│  │  📅 5 phút trước              │ │  ← Relative time
│  │  [📋 Copy Link]  [🗑 Xóa]    │ │  ← Actions
│  └────────────────────────────────┘ │
│                                     │
│  ┌─ Invitation Card ──────────────┐ │
│  │  👤 Cô Lan                    │ │
│  │  🔗 /thiep-moi/nh5vw2ec      │ │
│  │  📅 1 giờ trước               │ │
│  │  [📋 Copy Link]  [🗑 Xóa]    │ │
│  └────────────────────────────────┘ │
│                                     │
│          ... more cards ...         │
│                                     │
│  ┌─ Empty State ──────────────────┐ │
│  │  📭 Chưa có thiệp nào         │ │  ← Khi danh sách trống
│  │  Nhấn "Tạo thiệp mới" để      │ │
│  │  bắt đầu                       │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Create Modal (Tạo thiệp mới)

```
┌─────────────────────────────────────┐
│                                     │
│          Tạo Thiệp Mới             │  ← Title
│                                     │
│  Tên khách mời                      │  ← Label
│  ┌─────────────────────────────────┐│
│  │ Anh Tuấn & Gia Đình            ││  ← Input (autofocus)
│  └─────────────────────────────────┘│
│  Ví dụ: "Anh Tuấn & Gia Đình",     │  ← Helper text
│  "Cô Lan", "Bác Hùng"              │
│                                     │
│  ┌─ Preview ──────────────────────┐ │
│  │  "Trân trọng kính mời"         │ │  ← Preview realtime
│  │  "Anh Tuấn & Gia Đình"        │ │     cập nhật khi gõ
│  └────────────────────────────────┘ │
│                                     │
│       [Hủy]     [Tạo thiệp]        │  ← Actions
│                                     │
└─────────────────────────────────────┘
```

#### Components

| Component | File | Chức năng |
|-----------|------|-----------|
| `AdminDashboard` | `src/app/components/admin/AdminDashboard.tsx` | Layout chính, state management |
| `AdminHeader` | (inline trong AdminDashboard) | Tiêu đề + tên cặp đôi |
| `InvitationSearch` | (inline hoặc tách) | Thanh tìm kiếm debounced |
| `InvitationList` | (inline hoặc tách) | Danh sách cards |
| `InvitationCard` | (inline hoặc tách) | Card đơn lẻ: tên, hash, time, actions |
| `CreateInvitationModal` | `src/app/components/admin/CreateInvitationModal.tsx` | Modal tạo mới với preview |

#### Hook: `useInvitations`

```typescript
// src/app/components/admin/useInvitations.ts
interface Invitation {
  id: string
  guest_name: string
  hash: string
  created_at: string
}

interface UseInvitationsReturn {
  invitations: Invitation[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredInvitations: Invitation[]    // Đã filter theo searchQuery
  createInvitation: (guestName: string) => Promise<Invitation>
  deleteInvitation: (id: string) => Promise<void>
  isCreating: boolean
  isDeleting: string | null            // id đang xóa
}
```

**Trách nhiệm:**
- Fetch toàn bộ invitations (ORDER BY created_at DESC)
- Realtime subscribe cho INSERT/DELETE events (list luôn up-to-date)
- Search filter: client-side, case-insensitive, normalize dấu tiếng Việt
- `createInvitation`: generate hash → INSERT vào Supabase → return record mới
- `deleteInvitation`: DELETE FROM invitations WHERE id = :id
- Error handling cho duplicate hash (auto-retry với hash mới)

#### Logic chi tiết

**Search (Case-insensitive, Vietnamese-friendly):**
```typescript
// Normalize tiếng Việt cho search
// "Nguyễn" match "nguyen", "NGUYỄN", "nguyễn"
const normalizeVN = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const filtered = invitations.filter(inv =>
  normalizeVN(inv.guest_name).includes(normalizeVN(searchQuery))
)
```

**Copy to Clipboard:**
```typescript
const copyLink = async (hash: string) => {
  const url = `${window.location.origin}/thiep-moi/${hash}`
  await navigator.clipboard.writeText(url)
  toast.success('Đã copy link thiệp!')  // sonner toast
}
```

**Delete Confirmation:**
- Sử dụng `AlertDialog` từ shadcn/ui (`@radix-ui/react-alert-dialog`)
- Text: "Xóa thiệp mời cho [Tên Khách]? Link sẽ không còn hoạt động."
- Actions: "Hủy" / "Xóa"

#### Admin Authentication (Đơn giản)

Vì đây là dự án cá nhân với số lượng admin nhỏ (chỉ cô dâu + chú rể), sử dụng phương pháp **PIN code đơn giản**:

```
┌─────────────────────────────────────┐
│                                     │
│       🔐 Quản Lý Thiệp Mời        │
│                                     │
│       Nhập mã PIN để truy cập       │
│                                     │
│         ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│         │ • │ │ • │ │ _ │ │ _ │       │  ← 4 digit PIN
│         └──┘ └──┘ └──┘ └──┘       │
│                                     │
│  Sai mã PIN. Vui lòng thử lại.     │  ← Error (nếu sai)
│                                     │
└─────────────────────────────────────┘
```

**Implementation:**
- PIN lưu trong environment variable: `VITE_ADMIN_PIN` (4-6 digits)
- Sau khi nhập đúng → lưu vào `sessionStorage` key `admin_authenticated`
- Mỗi lần vào `/tao-thiep` → kiểm tra `sessionStorage` trước
- **Không cần Supabase Auth** — PIN check thuần client-side (đủ cho use case này)
- Admin operations sử dụng Supabase **anon key** với RLS policy `FOR ALL USING (true)` (xem mục Security)

> **Lưu ý:** Đây là bảo mật tối thiểu phù hợp cho thiệp cưới cá nhân. Nếu cần bảo mật cao hơn, xem Alternative ở mục Security.

---

## D. UI/UX Specifications

### D.1. Guest Name trên Thiệp (Personalized Card)

Khi có `guestName`, phần invitation text trên EnvelopeCard thay đổi:

**Layout trên card:**
```
    ┌──────────────────────────┐
    │                          │
    │     THIỆP MỜI CƯỚI      │  ← font-formal, 13px, uppercase, tracking wide
    │     ─────────────        │  ← decorative line
    │   Minh Hoàng &           │  ← font-envelope-guest (Carlytte), 33px
    │     Thanh Thư            │
    │      05.04.2026          │  ← font-primary, 14px
    │                          │
    │  Trân trọng kính mời     │  ← font-formal, 13px (mới, thay text cũ)
    │  Anh Tuấn & Gia Đình    │  ← GUEST NAME (xem style bên dưới)
    │                          │
    └──────────────────────────┘
```

**Style cho Guest Name:**

| Property | Value | Ghi chú |
|----------|-------|---------|
| Font family | `var(--font-calligraphy-vn)` (`HoaTay1`) | Thư pháp Việt, cảm giác trân trọng |
| Font size | `22px` | Đủ nổi bật nhưng không lấn át tên cặp đôi (33px) |
| Color | `#FFD700` → vàng gold nhạt hoặc `#FFECD2` (peach cream) | Nổi bật trên nền ảnh tối, sang trọng |
| Text shadow | `0 1px 8px rgba(0,0,0,0.4)` | Đảm bảo đọc được trên mọi ảnh nền |
| Text align | `center` | Căn giữa |
| Line height | `1.3` | Thoáng đãng |
| Margin top | `4px` (sau dòng "Trân trọng kính mời") | Gắn kết với dòng trên |
| Max width | `90%` của card width | Tránh tràn viền |
| Word break | `break-word` | Xử lý tên dài |

**Dòng "Trân trọng kính mời":**

| Property | Value |
|----------|-------|
| Font family | `var(--font-formal)` (giữ nguyên) |
| Font size | `13px` |
| Color | `rgba(255,255,255,0.82)` |
| Margin top | `14px` (giữ nguyên) |
| Letter spacing | `0.05em` |

**Khi KHÔNG có guestName (generic):**
- Giữ nguyên dòng: `"Trân trọng kính mời"` (như hiện tại, không thay đổi gì)

**Khi đang loading (isLoading = true):**
- Hiển thị dòng `"Trân trọng kính mời"` + skeleton placeholder mờ nhạt thay cho tên (width ~60%, height 22px, rounded, pulse animation)
- Duration loading rất ngắn (~100-300ms từ Supabase) nên trải nghiệm gần như instant

### D.2. Admin Dashboard Styling

**Color Palette (kế thừa từ trang chính):**

| Element | Color | Hex |
|---------|-------|-----|
| Background | Cream/beige | `#F0EBE2` |
| Header text | Olive đậm | `#3C4E34` |
| Card background | White semi | `rgba(255,255,255,0.7)` |
| Card border | Warm border | `rgba(212,204,190,0.4)` |
| Primary button | Olive | `#4A5D3A` |
| Danger button | Coral/rose | `#E87461` |
| Search input border | Neutral | `rgba(139,115,85,0.3)` |
| Placeholder text | Brown muted | `#8B7355` |
| Guest name text | Dark | `#2D2D2D` |
| Hash text | Mono olive | `#5A7247` |
| Timestamp | Muted | `#8B7355` |

**Typography:**
- Header title: `var(--font-display-serif)` (Playfair Display), 24px
- Couple names: `var(--font-couple-names)` (Soul Note Display), 18px
- Guest name in card: `var(--font-primary)` (Quicksand), 16px, semibold
- Hash: `var(--font-primary)`, 13px, mono-style (`font-variant-numeric: tabular-nums`)
- Buttons: `var(--font-primary)`, 14px

**Layout:**
- Max width: `430px` (giữ nhất quán phone-frame concept)
- Centered trên desktop (giống trang chính)
- Padding: `16px` horizontal
- Card spacing: `12px` gap
- Border radius: `12px` cho cards, `8px` cho buttons, `10px` cho input

**Animations (Motion.js):**
- Card list: stagger entrance (`y: 20 → 0, opacity: 0 → 1`, delay 50ms mỗi card)
- Create modal: slide up + fade in
- Delete card: slide out + fade
- Toast: sonner default animation

### D.3. Responsive

- **Mobile (<768px):** Full width, không có phone frame border radius
- **Desktop (≥768px):** Phone frame 430px, centered, border-radius 36px (giống trang chính)
- Admin dashboard sử dụng cùng logic responsive với trang chính

---

## E. API & Security

### E.1. Supabase RLS Policies

**Approach đơn giản (phù hợp cho thiệp cưới cá nhân):**

```sql
-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- SELECT: Cho phép tất cả đọc (guest cần đọc theo hash)
CREATE POLICY "invitations_select"
  ON invitations FOR SELECT
  USING (true);

-- INSERT: Cho phép tất cả insert (admin qua client với PIN check)
CREATE POLICY "invitations_insert"
  ON invitations FOR INSERT
  WITH CHECK (true);

-- DELETE: Cho phép tất cả delete (admin qua client với PIN check)
CREATE POLICY "invitations_delete"
  ON invitations FOR DELETE
  USING (true);

-- UPDATE: Không cần (không có tính năng sửa tên)
```

**Giải thích:**
- RLS permissive tương tự bảng `wishes` (spec 002)
- Bảo vệ lớp 1: PIN check client-side trước khi truy cập admin dashboard
- Bảo vệ lớp 2: Guest chỉ biết hash của mình, không biết hash người khác → không truy cập được danh sách
- Bảo vệ lớp 3: Dữ liệu chỉ là tên khách (không nhạy cảm)

**Alternative (nếu cần bảo mật cao hơn):**
- Sử dụng Supabase Auth + `auth.role() = 'authenticated'` cho admin operations
- Guest read vẫn public (anon key + SELECT policy)
- Cần thêm: login UI, Supabase Auth setup, token management

### E.2. Environment Variables

```bash
# .env.local (KHÔNG commit)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PIN=1234                          # PIN 4-6 digits cho admin dashboard
VITE_SITE_URL=https://your-wedding-site.vercel.app  # Base URL cho copy link
```

> **Lưu ý:** `VITE_ADMIN_PIN` và `VITE_SITE_URL` là biến mới. Cập nhật `.env.example`.

### E.3. Rate Limiting

- **Create invitation:** Client-side chỉ, không cần server rate limit (admin-only feature, số lượng thấp)
- **Read by hash:** Supabase xử lý, không cần thêm logic

---

## F. Acceptance Criteria

### Guest Flow

1. **Given** URL `/thiep-moi/k7m3xp9a` với hash hợp lệ trong DB (`guest_name = "Anh Tuấn & Gia Đình"`), **When** khách mở link, **Then** EnvelopeCard hiển thị "Trân trọng kính mời" + "Anh Tuấn & Gia Đình" thay vì text generic. Toàn bộ nội dung trang (gallery, countdown, RSVP...) giữ nguyên.

2. **Given** URL `/thiep-moi/invalid_hash` với hash KHÔNG tồn tại trong DB, **When** khách mở link, **Then** trang hiển thị thiệp chung như bình thường ("Trân trọng kính mời"). KHÔNG hiển thị trang lỗi 404.

3. **Given** URL `/` (không có hash), **When** khách mở link, **Then** trang hiển thị thiệp chung như hiện tại. Không có thay đổi gì.

4. **Given** tên khách rất dài (ví dụ: "Ông Bà Nguyễn Văn An & Toàn Thể Gia Đình"), **When** hiển thị trên card, **Then** text wrap đẹp trong card, không tràn ra ngoài, font size tự động giảm nếu cần (hoặc truncate với ellipsis).

5. **Given** Supabase bị lỗi kết nối, **When** khách mở link có hash, **Then** fallback hiển thị thiệp chung (không crash, không blank screen).

### Admin Flow

6. **Given** admin truy cập `/tao-thiep` lần đầu, **When** chưa nhập PIN, **Then** hiển thị form nhập PIN. Nhập đúng PIN → vào dashboard. Nhập sai → hiển thị lỗi, cho phép thử lại.

7. **Given** admin đã authenticated, **When** vào dashboard, **Then** hiển thị danh sách invitations mới nhất trước (ORDER BY created_at DESC). Nếu chưa có invitation nào → hiển thị empty state.

8. **Given** admin nhấn "Tạo thiệp mới", **When** modal hiển thị, **Then** input autofocus, có helper text và preview realtime. Nhập "Cô Lan" → preview hiển thị "Trân trọng kính mời / Cô Lan".

9. **Given** admin nhập tên và nhấn "Tạo thiệp", **When** Supabase insert thành công, **Then** modal đóng, invitation mới xuất hiện đầu danh sách (realtime), toast "Đã tạo thiệp cho [Tên Khách]".

10. **Given** admin nhấn icon Copy trên một invitation card, **When** clipboard ghi thành công, **Then** toast "Đã copy link thiệp!" xuất hiện (sonner). Link có format: `https://[domain]/thiep-moi/[hash]`.

11. **Given** admin gõ "lan" vào ô tìm kiếm, **When** danh sách filter, **Then** chỉ hiển thị invitations có `guest_name` chứa "lan" (case-insensitive, ví dụ: "Cô Lan", "Lan Anh", "NGUYỄN LAN").

12. **Given** admin gõ "nguyen" (không dấu) vào ô tìm kiếm, **When** filter chạy, **Then** match cả "Nguyễn" (có dấu) nhờ normalize dấu tiếng Việt.

13. **Given** admin nhấn nút Xóa trên invitation, **When** AlertDialog hiển thị "Xóa thiệp mời cho [Tên]?", **Then** nhấn "Xóa" → record bị xóa khỏi DB, card biến mất khỏi list (animation). Nhấn "Hủy" → không làm gì.

14. **Given** admin tạo thiệp mới trên device A, **When** admin mở dashboard trên device B, **Then** device B thấy thiệp mới ngay lập tức (realtime subscription).

### Validation

15. **Given** admin nhập tên rỗng hoặc chỉ có spaces, **When** nhấn "Tạo thiệp", **Then** hiển thị validation error "Vui lòng nhập tên khách mời", button disable.

16. **Given** admin nhập tên > 100 ký tự, **When** input đạt giới hạn, **Then** hiển thị character counter, không cho nhập thêm.

---

## G. Cấu trúc Code

### Files cần thay đổi

```
src/main.tsx                                # Thêm RouterProvider, import router
src/app/App.tsx                             # Thêm useParams, useInvitation, truyền guestName
src/app/components/EnvelopeCard.tsx          # Thêm prop guestName, conditional render
.env.example                                # Thêm VITE_ADMIN_PIN, VITE_SITE_URL
```

### Files cần tạo mới

```
src/router.tsx                              # React Router config
src/app/components/useInvitation.ts          # Hook: fetch guest name by hash
src/app/components/admin/AdminDashboard.tsx   # Admin layout + PIN gate + dashboard
src/app/components/admin/CreateInvitationModal.tsx  # Modal tạo thiệp mới với preview
src/app/components/admin/useInvitations.ts   # Hook: CRUD invitations + realtime
vercel.json                                 # SPA rewrites (nếu chưa có)
```

### Vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### SQL Migration (chạy trong Supabase Dashboard > SQL Editor)

```sql
-- 1. Enable pg_trgm extension (cho search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create invitations table
CREATE TABLE invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  hash text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Indexes
CREATE INDEX idx_invitations_hash ON invitations (hash);

-- 4. RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invitations_select" ON invitations FOR SELECT USING (true);
CREATE POLICY "invitations_insert" ON invitations FOR INSERT WITH CHECK (true);
CREATE POLICY "invitations_delete" ON invitations FOR DELETE USING (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE invitations;
```

---

## H. Implementation Notes (Hướng dẫn cho Agent)

### Dependency cần cài

```bash
yarn add nanoid
```

> `react-router`, `sonner`, `lucide-react`, `@supabase/supabase-js` đã có sẵn.

### Icons (Lucide React)

| Action | Icon |
|--------|------|
| Tạo mới | `Plus` hoặc `UserPlus` |
| Copy link | `Copy` hoặc `Link` |
| Xóa | `Trash2` |
| Tìm kiếm | `Search` |
| Pin lock | `Lock` |
| Back to site | `ArrowLeft` |
| Guest name | `User` |

### Toast Notifications (Sonner)

```typescript
import { toast } from 'sonner'

// Thêm <Toaster /> vào layout (chỉ 1 lần)
// Admin dashboard:
toast.success('Đã tạo thiệp cho Anh Tuấn!')
toast.success('Đã copy link thiệp!')
toast.error('Không thể tạo thiệp. Vui lòng thử lại.')
toast.success('Đã xóa thiệp.')
```

> **Lưu ý:** Cần thêm `<Toaster />` component từ sonner vào `AdminDashboard` layout. Trang chính (`App.tsx`) không cần nếu không dùng toast.

### Quy tắc giữ nguyên

- **KHÔNG thay đổi** layout, order, hay styling của các section hiện tại trong App.tsx
- **KHÔNG thay đổi** EnvelopeCard state machine (4 states, timings, z-index)
- **KHÔNG thay đổi** bất kỳ file nào trong `src/app/components/ui/`
- **KHÔNG thay đổi** `image-manifest.ts`, `public/images/`, `public/fonts/`
- **KHÔNG thay đổi** `wedding-config.ts` (trừ khi cần thêm field mới)
- **KHÔNG** thêm `<Toaster />` vào trang chính (chỉ dùng trong admin)

### Thứ tự triển khai đề xuất

1. **Phase 1 — Routing & Guest Page:**
   - Cài `nanoid`
   - Tạo `router.tsx`, cập nhật `main.tsx`
   - Tạo `useInvitation.ts` hook
   - Cập nhật `EnvelopeCard.tsx` nhận prop `guestName`
   - Cập nhật `App.tsx` sử dụng `useParams` + `useInvitation`
   - Tạo `vercel.json`
   - Test: truy cập `/` (giữ nguyên), `/thiep-moi/invalid` (fallback)

2. **Phase 2 — Database:**
   - Chạy SQL migration trong Supabase
   - Test: Insert thủ công 1 record → truy cập `/thiep-moi/[hash]` → thấy tên

3. **Phase 3 — Admin Dashboard:**
   - Tạo `AdminDashboard.tsx` với PIN gate
   - Tạo `useInvitations.ts` hook
   - Tạo `CreateInvitationModal.tsx`
   - Implement: list, search, create, copy, delete
   - Test: full CRUD flow, realtime sync, search Vietnamese

4. **Phase 4 — Polish:**
   - Animation entrance cho invitation cards
   - Loading states và error handling
   - Empty states
   - Long name handling
   - Cross-device testing (mobile viewport 430px)
