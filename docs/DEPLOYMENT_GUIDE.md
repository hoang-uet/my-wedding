# Deployment Guide - Wedding Invitation

> Website thiệp mời đám cưới | Vite + React 18 SPA | Supabase backend

---

## 1. Phân tích Stack

| Layer | Chi tiết |
|-------|---------|
| Framework | **Vite 6.3** + React 18.3 (SPA, client-side routing) |
| Build output | `dist/` (static HTML/JS/CSS) |
| Backend | Supabase (client-side SDK, realtime wishes + invitations) |
| Routing | React Router v7 — cần SPA rewrite (đã có `vercel.json`) |
| Images | 20 ảnh WebP (4 sizes mỗi ảnh, tổng ~4.5MB) + blur placeholders |
| Fonts | 8 self-hosted woff2 fonts |
| Audio | 1 file MP3 (nhạc nền) |

**Lưu ý quan trọng:** Đây KHÔNG phải Next.js — là Vite SPA thuần. Không cần SSR, serverless functions, hay edge middleware.

---

## 2. So sánh Platform

| Tiêu chí | Vercel (Free) | Netlify (Free) | Cloudflare Pages (Free) |
|----------|:------------:|:--------------:|:---------------------:|
| Bandwidth/tháng | 100 GB | 100 GB | Unlimited |
| Builds/tháng | 6000 phút | 300 phút | 500 builds |
| Vite SPA support | Native | Native | Native |
| Global CDN | 300+ PoPs | ~50 PoPs | 300+ PoPs |
| SPA Rewrites | `vercel.json` (done) | `_redirects` file | `_redirects` file |
| DDoS Protection | Included | Basic | Included (enterprise-grade) |
| Deploy speed | ~15s | ~30s | ~20s |
| Custom domain | Free SSL | Free SSL | Free SSL |
| Preview deployments | Per-commit | Per-commit | Per-commit |

### Best-fit: **Vercel Free Tier**

Lý do:
1. **Dự án đã có `vercel.json`** — zero config thêm
2. **Vite là framework được Vercel detect tự động** — build command + output directory tự nhận
3. **100GB bandwidth dư sức** cho 1 tháng đám cưới (tính toán bên dưới)
4. **Preview URLs** cho mỗi commit — test trước khi gửi khách
5. **Edge Network toàn cầu** — ảnh và fonts load nhanh từ PoP gần nhất

### Ước tính bandwidth

```
Mỗi page load ≈ 1.5MB (JS bundle + 4-5 ảnh WebP + fonts + audio)
200 khách × 3 lượt truy cập/người × 1.5MB = ~900MB
+ Supabase realtime overhead ≈ 100MB
Tổng ≈ 1GB << 100GB free tier
```

**Kết luận: Free tier thừa sức, không cần lo chi phí.**

---

## 3. Lộ trình triển khai

### Bước 0: Sửa vấn đề ảnh trong Git (QUAN TRỌNG)

`public/images/` đang bị gitignore, nghĩa là Vercel sẽ KHÔNG có ảnh khi build.

**Giải pháp:** Un-gitignore thư mục ảnh đã optimize (chỉ 4.5MB WebP):

```bash
# Xóa dòng gitignore cho public/images/
# Trong .gitignore, XÓA dòng: public/images/

# Sau đó commit ảnh vào repo
git add public/images/
git commit -m "chore: track optimized WebP images for deployment"
```

> **Tại sao không chạy optimize-images trên Vercel?**
> Vì raw images (395MB) cũng bị gitignore và quá nặng để commit.
> 4.5MB WebP đã optimize là giải pháp tối ưu nhất.

### Bước 1: Kết nối Vercel

```bash
# Cài Vercel CLI (nếu chưa có)
npm i -g vercel

# Login
vercel login

# Link project (chạy từ root dự án)
vercel link
# → Chọn scope (personal/team)
# → Chọn "Link to existing project" hoặc "Create new project"
# → Project name: wedding-invitation (hoặc tên bạn muốn)
```

Hoặc **dùng Dashboard** (đơn giản hơn):
1. Truy cập [vercel.com/new](https://vercel.com/new)
2. Import Git repository
3. Vercel tự detect Vite framework

### Bước 2: Cấu hình Build

Vercel tự detect Vite, nhưng nếu cần override:

| Setting | Giá trị |
|---------|---------|
| **Framework Preset** | Vite |
| **Build Command** | `yarn build` |
| **Output Directory** | `dist` |
| **Install Command** | `yarn install` |
| **Node.js Version** | 20.x (recommend) |

File `vercel.json` hiện tại đã đủ:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Rewrite này đảm bảo React Router hoạt động cho cả 3 routes:
- `/` — Landing page
- `/thiep-moi/:hash` — Thiệp cá nhân hóa
- `/tao-thiep` — Admin dashboard

### Bước 3: Cấu hình Environment Variables

Trên Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Giá trị | Environment | Ghi chú |
|----------|---------|-------------|---------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development | Lấy từ Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview, Development | Anon key (public, an toàn để expose trong client) |
| `VITE_ADMIN_PIN` | `XXXX` | Production only | PIN 4-6 chữ số cho admin dashboard |
| `VITE_SITE_URL` | `https://your-domain.vercel.app` | Production only | (Optional) Dùng cho copy link thiệp |

> **Lưu ý bảo mật:**
> - `VITE_SUPABASE_ANON_KEY` là **public anon key**, an toàn cho client-side. Bảo mật thực sự nằm ở Supabase RLS (Row Level Security).
> - `VITE_ADMIN_PIN` chỉ là lớp bảo vệ UI, không phải bảo mật thật sự. Nếu cần bảo mật admin, dùng Supabase Auth.
> - **KHÔNG BAO GIỜ** đặt `service_role` key vào biến `VITE_*` — nó sẽ bị bundle vào client JS.

Hoặc dùng CLI:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ADMIN_PIN
```

### Bước 4: Deploy

```bash
# Preview deployment (test trước)
vercel

# Production deployment (khi đã OK)
vercel --prod
```

Hoặc **auto-deploy qua Git** (khuyến nghị):
1. Push code lên GitHub/GitLab
2. Vercel auto-deploy mỗi khi push
3. Mỗi branch/PR → Preview URL riêng
4. Push lên `main` → Production auto-deploy

---

## 4. Tối ưu hóa hiệu năng

### 4.1 Images (đã tối ưu)

Dự án đã làm rất tốt:
- 4 sizes WebP responsive (320w → 1280w) qua `optimize-images.mts`
- Blur placeholders (base64) cho progressive loading
- `WeddingImage` component với `srcSet` tự động
- Tổng ảnh chỉ **4.5MB** cho 20 bộ ảnh

### 4.2 Fonts

8 custom fonts (woff2) được self-host tại `public/fonts/`. Vercel CDN cache chúng tự động.

Cân nhắc thêm vào `vercel.json` để cache lâu hơn:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 4.3 Vite Build Optimizations

Vite đã tự động:
- Tree-shaking unused code
- Code splitting (lazy routes)
- Asset hashing (cache busting)
- CSS minification
- JS minification (esbuild)

### 4.4 Supabase Realtime

- Realtime WebSocket kết nối trực tiếp tới Supabase, không đi qua Vercel
- Không tốn bandwidth Vercel cho realtime updates
- Supabase Free Tier: 500MB database, 50k monthly active users — dư sức

---

## 5. Bảo mật & Scaling

### 5.1 DDoS Protection

Vercel cung cấp **tự động** trên tất cả plans (kể cả Free):
- Layer 3/4 DDoS mitigation
- Layer 7 protection
- Edge Network absorb traffic trước khi tới origin

### 5.2 Supabase RLS

Đảm bảo Supabase tables có Row Level Security (RLS) enabled:

```sql
-- Ví dụ cho bảng wishes
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc
CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT USING (true);

-- Cho phép mọi người tạo (với rate limit ở client)
CREATE POLICY "Anyone can insert wishes"
  ON wishes FOR INSERT WITH CHECK (true);
```

### 5.3 Rate Limiting

- Client-side rate limit đã implement trong `useWishes.ts`
- Supabase anon key có rate limit mặc định
- Vercel Edge Network tự chặn traffic bất thường

### 5.4 Custom Domain (Optional)

```bash
# Thêm domain qua CLI
vercel domains add ten-cua-ban.com

# Hoặc dùng Dashboard → Project → Settings → Domains
```

Vercel tự cấp SSL certificate (Let's Encrypt). Nếu chỉ dùng 1 tháng, subdomain miễn phí `*.vercel.app` là đủ.

---

## 6. Checklist trước khi gửi link cho khách

### Build & Deploy
- [ ] `public/images/` đã commit vào git (un-gitignore)
- [ ] `yarn build` thành công local, không error/warning
- [ ] Vercel project đã link và auto-deploy từ `main`
- [ ] Environment variables đã set đúng trên Vercel Dashboard
- [ ] Production deployment thành công (check Vercel Dashboard)

### Chức năng
- [ ] Landing page (`/`) load đúng, ảnh hiển thị
- [ ] Envelope animation hoạt động (mở/đóng)
- [ ] Nhạc nền phát được (sau user interaction)
- [ ] Countdown đếm ngược đúng ngày
- [ ] Gallery + lightbox hoạt động
- [ ] Gửi lời chúc thành công (test trên Supabase)
- [ ] Lời chúc realtime hiển thị (mở 2 tab test)
- [ ] Thiệp cá nhân hóa (`/thiep-moi/:hash`) hiển thị đúng tên
- [ ] Admin dashboard (`/tao-thiep`) accessible với đúng PIN
- [ ] RSVP form submit thành công

### Hiệu năng
- [ ] Test trên mobile thật (iPhone/Android)
- [ ] Ảnh load progressive (blur → sharp)
- [ ] Fonts render đúng (không flash of unstyled text)
- [ ] Page load < 3s trên 4G

### Bảo mật
- [ ] `.env.local` KHÔNG có trong git (`git status` clean)
- [ ] Supabase RLS enabled cho tất cả tables
- [ ] `VITE_ADMIN_PIN` chỉ set cho Production environment
- [ ] Không có secret nào bị log trong browser console

---

## 7. Troubleshooting

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|------------|-----------|
| Ảnh 404 trên Vercel | `public/images/` chưa commit | Un-gitignore + commit |
| Refresh → 404 | SPA rewrite thiếu | Check `vercel.json` rewrites |
| Wishes không hoạt động | Env vars sai/thiếu | Check Vercel Dashboard → Env vars |
| Admin 403 | PIN sai hoặc chưa set | Set `VITE_ADMIN_PIN` trên Vercel |
| Build fail | Node version mismatch | Set Node.js 20.x trong Vercel settings |
| Fonts không load | Cache cũ | Hard refresh (Ctrl+Shift+R) |

---

## 8. Chi phí tổng kết

| Dịch vụ | Plan | Chi phí/tháng | Giới hạn |
|---------|------|:------------:|----------|
| **Vercel** | Hobby (Free) | **$0** | 100GB bandwidth, 6000 build min |
| **Supabase** | Free | **$0** | 500MB DB, 1GB file storage, 50k MAU |
| **Domain** (optional) | .com | ~$10/năm | Hoặc dùng `*.vercel.app` miễn phí |
| **Tổng** | | **$0** | Đủ cho 200+ concurrent users trong 1 tháng |

---

## Quick Deploy Commands

```bash
# One-time setup
npm i -g vercel
vercel login
vercel link

# Set env vars
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ADMIN_PIN

# Deploy
vercel          # Preview
vercel --prod   # Production
```

Sau khi push lên Git + liên kết Vercel, mọi thứ sẽ tự động.
