# Wedding Invitation - Project Memory Bank

## 1. Tổng quan dự án

Website thiệp mời đám cưới dạng single-page application, thiết kế theo phong cách **mobile-first** (430px phone frame). Dự án tập trung vào trải nghiệm tương tác: phong bì mở animation, đếm ngược, gallery ảnh, timeline sự kiện, RSVP form, lời chúc từ khách mời.

- **Loại dự án:** SPA với Supabase backend (lời chúc realtime, thiệp cá nhân hóa)
- **Đối tượng:** Khách mời đám cưới, truy cập qua mobile
- **Ngôn ngữ nội dung:** Tiếng Việt
- **Package manager:** `yarn`
- **Hosting:** Vercel
- **Routing:** React Router v7 (`/`, `/thiep-moi/:hash`, `/thiep-cuoi`)

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.x |
| Build Tool | Vite | 6.3.x |
| Language | TypeScript | 5.9.x (strict mode) |
| CSS | Tailwind CSS v4 | via @tailwindcss/vite |
| UI Primitives | Radix UI + shadcn/ui style | 20+ components |
| Icons | Lucide React | 0.487.x |
| Animation | Motion.js | 12.23.x |
| Forms | React Hook Form | 7.55.x |
| Routing | React Router | 7.13.x |
| Backend/DB | Supabase (`@supabase/supabase-js`) | 2.99.x (realtime wishes, invitations) |
| ID Generation | nanoid | 5.1.x |
| Image Processing | Sharp (build-time) | 0.34.x |
| E2E Testing | Playwright | 1.58.x |
| Carousel | Embla Carousel | 8.6.x |
| Masonry | react-responsive-masonry | 2.7.x |

### Path Aliases
```
@ -> src/
```

## 3. Kiến trúc & Patterns

### Component Architecture
- **Flat component structure:** Tất cả page sections nằm trong `src/app/components/`
- **UI library:** shadcn/ui primitives tại `src/app/components/ui/` (65+ components, KHÔNG sửa trực tiếp)
- **Config-driven:** Dữ liệu cưới centralized tại `wedding-config.ts`
- **Image manifest:** Auto-generated bởi script, KHÔNG sửa thủ công `image-manifest.ts`

### State Management
- **Local state only:** useState, useRef, useCallback - KHÔNG có global state manager
- **Custom hooks:**
  - `useAudioPlayer()` - Audio lazy-load, fade in/out
  - `useScrollAnimation()` - Intersection Observer animations
  - `useChildrenStagger()` - Staggered child animations
  - `useWishes()` - Supabase realtime wishes (fetch, subscribe, send, rate limit)
  - `useInvitation()` - Fetch guest name by URL hash from Supabase
  - `useInvitations()` - Admin CRUD for invitations + realtime subscription

### Key Components

| Component | Chức năng | Độ phức tạp |
|-----------|----------|-------------|
| `EnvelopeCard` | Phong bì tương tác, 4 states animation, trigger nhạc | CAO |
| `Gallery` | Masonry grid + lightbox overlay + keyboard nav | CAO |
| `FloatingBar` | Bottom bar + Peek Mode + Full Messages Overlay + realtime wishes | CAO |
| `NameModal` | Modal nhập tên lần đầu cho guestbook | THẤP |
| `Countdown` | Đếm ngược tới ngày cưới | THẤP |
| `RSVPForm` | Form đăng ký tham dự | TRUNG BÌNH |
| `WeddingGift` | Thông tin chuyển khoản | THẤP |
| `AdminDashboard` | Quản lý thiệp mời: PIN gate + CRUD + search + realtime | CAO |
| `CreateInvitationModal` | Modal tạo thiệp mới với preview realtime | TRUNG BÌNH |

### Hệ thống Styling
- **Tailwind CSS v4** với custom theme tại `src/styles/theme.css`
- **11 custom fonts** (woff2, self-hosted tại `public/fonts/`)
- **CSS custom properties** cho colors, spacing, typography
- **Background chính:** #F0EBE2 (cream/beige)

### Responsive Images
- Script `optimize-images.mts` tạo 4 kích thước WebP (320w, 640w, 960w, 1280w)
- Blur placeholders (base64) cho progressive loading
- Component `WeddingImage` xử lý srcSet tự động

## 4. Feature Specs

Mỗi tính năng có spec riêng trong thư mục `specs/`. Đọc spec trước khi triển khai hoặc sửa đổi tính năng tương ứng.

| ID | Tính năng | Trạng thái | Spec |
|----|-----------|-----------|------|
| 001 | Landing Page - Thiệp cưới chính | Đã triển khai | [`specs/001-wedding-landing-page/spec.md`](specs/001-wedding-landing-page/spec.md) |
| 002 | Lời chúc từ khách mời (Guestbook) | Đã triển khai | [`specs/002-wishes-guestbook/spec.md`](specs/002-wishes-guestbook/spec.md) |
| 003 | Thiệp mời cá nhân hóa (Personalized Invitations) | Đã triển khai (FE) | [`specs/003-personalized-invitations/spec.md`](specs/003-personalized-invitations/spec.md) |

> **Quy ước thêm tính năng mới:**
> 1. Tạo thư mục `specs/{ID}-{tên-tính-năng}/spec.md`
> 2. Cập nhật bảng trên với link tới spec
> 3. ID tăng dần: 003, 004, ...

## 5. Development Workflow

### Commands

```bash
# Development
yarn dev              # Khởi động Vite dev server (localhost:5173)

# Build
yarn build            # Build production (output: dist/)
yarn preview          # Preview production build

# Code Quality
yarn lint             # ESLint check
yarn lint:fix         # ESLint auto-fix
yarn format           # Prettier format
yarn format:check     # Prettier check

# Image Processing
yarn optimize-images  # Tạo WebP từ src/assets/wedding-images/ -> public/images/
                      # Tự động cập nhật image-manifest.ts
```

### Development Flow
1. Sửa code trong `src/app/components/`
2. Dev server auto-reload (Vite HMR)
3. Khi thêm ảnh mới: đặt vào `src/assets/wedding-images/` → chạy `yarn optimize-images`
4. KHÔNG sửa `image-manifest.ts` thủ công (auto-generated)
5. KHÔNG sửa files trong `src/app/components/ui/` (shadcn boilerplate)

### Deploy
- Hosting trên **Vercel** (static build từ Vite)
- Build output: `dist/`
- Framework preset: Vite
- Không yêu cầu server-side rendering

## 6. Quy tắc cho Agent

### Tiêu chuẩn code
- **DRY:** Tái sử dụng components và hooks. Nếu logic lặp lại 3+ lần, tạo shared utility
- **SOLID:** Mỗi component chỉ đảm nhận 1 nhiệm vụ rõ ràng
- **TypeScript strict:** KHÔNG dùng `any`, KHÔNG dùng `@ts-ignore` trừ khi giải thích rõ lý do
- **Comments:** Viết comment cho logic phức tạp (animation states, audio lifecycle, scroll calculations)
- **JSDoc:** Cập nhật JSDoc cho các hàm utility và custom hooks

### Quy ước đặt tên file
- Component files: PascalCase (`EnvelopeCard.tsx`)
- Hooks: camelCase với prefix `use` (`useAudioPlayer.ts`)
- Config files: kebab-case (`wedding-config.ts`)
- CSS: Dùng Tailwind utility classes, tránh inline styles

### KHÔNG ĐƯỢC sửa
- `src/app/components/ui/*` - shadcn/ui library (chỉ thêm mới qua CLI)
- `src/app/components/image-manifest.ts` - Auto-generated bởi script
- `public/images/` - Generated bởi optimize-images script
- `public/fonts/` - Static font assets

### Hướng dẫn Animation
- Sử dụng `motion` library cho complex animations
- Tôn trọng `prefers-reduced-motion` (đã implement trong useScrollAnimation)
- EnvelopeCard có 4 states: `closed` → `opening` → `open` → `closing` (KHÔNG thay đổi state machine)

### Giao thức An toàn (Safety Protocol)
Khi chạy với `--dangerously-skip-permissions`, Agent **KHÔNG ĐƯỢC PHÉP:**
- Xóa các file core: `App.tsx`, `main.tsx`, `wedding-config.ts`, `vite.config.ts`, `tsconfig.json`
- Thực hiện `rm -rf` ở root hoặc thư mục hệ thống
- Gửi dữ liệu bí mật (API Keys, thông tin ngân hàng từ wedding-config) ra endpoint bên ngoài
- Thay đổi cấu hình bảo mật của repo (`.gitignore`, permissions)
- Xóa hoặc ghi đè toàn bộ `src/styles/` (hệ thống typography phức tạp)

### Trước khi thay đổi lớn
- Lập kế hoạch (Plan) và trình bày trong terminal TRƯỚC KHI thực thi
- Giải thích impact lên các components liên quan
- Nếu thay đổi `wedding-config.ts`: kiểm tra tất cả components đang sử dụng config đó
- Nếu thay đổi animation logic: test trên mobile viewport (390x844)

## 7. Cấu trúc dự án

```
src/
  main.tsx                          # Entry point (RouterProvider)
  router.tsx                        # React Router config (3 routes)
  lib/
    supabase.ts                     # Supabase client singleton
  app/
    App.tsx                         # Root component (phone frame wrapper)
    components/
      ui/                           # shadcn/ui library (KHÔNG SỬA)
      figma/                        # Figma-imported components
      EnvelopeCard.tsx              # Phong bì tương tác (phức tạp)
      Countdown.tsx                 # Đếm ngược ngày cưới
      Gallery.tsx                   # Gallery ảnh + lightbox
      EventDetails.tsx              # Địa điểm & thời gian
      FamilyInfo.tsx                # Thông tin gia đình
      FloatingBar.tsx               # Bottom bar + wishes peek/full overlay (phức tạp)
      NameModal.tsx                 # Modal nhập tên lần đầu
      useWishes.ts                  # Hook: fetch, subscribe, send wishes via Supabase
      RSVPForm.tsx                  # Form xác nhận tham dự
      WeddingGift.tsx               # Thông tin mừng cưới
      ThankYou.tsx                  # Phần kết thúc
      CalendarHighlight.tsx         # Widget lịch
      WeddingTimeline.tsx           # Lịch trình sự kiện
      PhotoQuoteSplit.tsx           # Layout trích dẫn + ảnh
      PhotoHero.tsx                 # Ảnh hero toàn chiều rộng
      FloralOverlay.tsx             # Trang trí hoa lan
      CouplePortraits.tsx           # Ảnh đôi
      OurStory.tsx                  # Câu chuyện tình yêu
      MusicButton.tsx               # Nút bật/tắt nhạc
      WeddingImage.tsx              # Component ảnh responsive
      wedding-config.ts             # Dữ liệu cưới tập trung
      image-manifest.ts             # Metadata ảnh (auto-generated)
      useAudioPlayer.ts             # Hook phát nhạc nền
      useScrollAnimation.ts         # Hook animation khi cuộn
      useInvitation.ts              # Hook: fetch guest name by hash
      admin/                        # Admin dashboard components
        AdminDashboard.tsx           # PIN gate + quản lý thiệp mời
        CreateInvitationModal.tsx    # Modal tạo thiệp mới với preview
        useInvitations.ts            # Hook: CRUD invitations + realtime
  assets/
    music/golden-hour.mp3           # Nhạc nền
    wedding-images/                 # Ảnh gốc chưa tối ưu
    *.png                           # Tài nguyên trang trí
  styles/
    index.css                       # Import CSS chính
    tailwind.css                    # Tailwind v4 directives
    theme.css                       # Custom properties & màu sắc
    fonts.css                       # Khai báo @font-face
scripts/
  optimize-images.mts               # Script tối ưu ảnh (Sharp)
public/
  images/                           # WebP đã tối ưu (KHÔNG SỬA)
  fonts/                            # Font tự host (woff2)
specs/                              # Feature specs (xem bảng ở Section 4)
vercel.json                         # SPA rewrites cho client-side routing
```
