# Page Design: Wedding Landing Page

> **Based on**: [cinelove.me/template/pc/thiep-cuoi-48](https://cinelove.me/template/pc/thiep-cuoi-48) layout reference
> **Role**: Expert UI/UX Designer spec

---

## Design Philosophy (Triết lý thiết kế)

Thiết kế mang **tone thiên nhiên – cổ điển – trang nhã (Nature-Classic-Elegant)**, sử dụng bảng màu xanh olive/rêu kết hợp kem ấm. Bố cục trang theo dạng cuộn dọc liên tục (single-scroll) trong một khung điện thoại mô phỏng, dẫn dắt người xem từ phong bì mở thiệp → thông tin gia đình → chi tiết sự kiện → chân dung đôi uyên ương → câu chuyện tình yêu → lịch & đếm ngược → album ảnh → RSVP → lời chúc & cảm ơn.

**Triết lý chính:**

* **Câu chuyện liền mạch (Seamless Storytelling):** Không có menu chuyển trang phức tạp. Mỗi section đóng vai trò như một chương trong cuốn tiểu thuyết tình yêu — phong bì mở ra → thiệp mời → chân dung → kỷ niệm → ăn mừng. Mạch cảm xúc không bị đứt đoạn.
* **Tập trung vào nội dung và hình ảnh (Content & Imagery Focus):** Sử dụng các khoảng trắng không gian hợp lý trên nền giấy mời kem có texture nhẹ, kết hợp các font chữ viết tay/thư pháp (Aquarelle, HoaTay1, Monsieur La Doulaise) để làm nổi bật tên cô dâu chú rể và những mốc thời gian quan trọng. Hoa lan trắng và lá xanh được dùng làm chi tiết trang trí xuyên suốt.
* **Tương tác tinh tế (Subtle Interactions):** Các chi tiết như phong bì animated mở ra khi chạm, hiệu ứng bắn tim, lời chúc realtime hiện floating bar, và form RSVP được đặt khéo léo để tạo tương tác hai chiều mà không phá vỡ vẻ trang nhã tổng thể.
* **Tối ưu hóa thiết bị di động (Mobile-first mindset):** Toàn bộ layout được thiết kế trong một khung phone-frame (~405px), cấu trúc xếp chồng dọc hoàn hảo cho thao tác vuốt. Trên desktop, hiển thị trong khung mockup device có viền bo tròn, centered trên nền xám nhạt.
* **Trang trí thiên nhiên (Nature Decorative):** Họa tiết hoa lan trắng + lá xanh nhẹ được đặt xuyên suốt các section (góc trên, góc dưới, chia cách section), tạo cảm giác trang trọng nhưng tươi mát, gắn kết với tone xanh olive chủ đạo.

## Color Tokens (Hệ thống màu sắc)

Bảng màu lấy cảm hứng từ tone **xanh olive rừng + kem tự nhiên**, tạo cảm giác cổ điển, thanh lịch, gần gũi thiên nhiên:

| Token                  | Value                  | Note                                                                                                         |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--page-bg`            | `#FAF7F7`              | Nền chủ đạo (kem ấm hơi ngả hồng), tạo cảm giác giấy mời cao cấp. Áp dụng texture giấy nhẹ.                  |
| `--page-surface`       | `#FAF7F7`              | Nền form RSVP, card — đồng nhất với page-bg để liền mạch.                                                     |
| `--page-primary`       | `#3A4A3A`              | Xanh olive đậm — dùng cho heading chính, label "Nhà Trai"/"Nhà Gái", nút submit.                              |
| `--page-accent`        | `#4B5320`              | Xanh olive vàng (army olive) — dùng cho tên cặp đôi, tiêu đề section, body text "Our Story", countdown số.    |
| `--page-envelope`      | `#3C4E34`              | Xanh rêu đậm — màu phong bì và các chi tiết envelope (flap, pocket).                                          |
| `--page-text-primary`  | `#333333`              | Màu chữ chính cho nội dung body text, đảm bảo tương phản tốt.                                                 |
| `--page-text-light`    | `#FAF7F7`              | Màu chữ sáng trên nền tối (overlay ảnh, countdown, calendar header, phong bì mở).                              |
| `--page-text-muted`    | `#666666`              | Chữ phụ: địa chỉ chi tiết, chú thích nhỏ, âm lịch.                                                           |
| `--page-border`        | `#E8DCD0`              | Màu viền mảnh, divider giữa các section.                                                                      |
| `--page-overlay-dark`  | `rgba(58,74,58,0.55)`  | Lớp phủ trên ảnh nền (photo hero, calendar bg) để text hiện rõ.                                               |
| `--page-chat-bubble`   | `rgba(200,160,140,0.5)` | Nền chat bubble lời chúc — hồng cam nhạt mờ, bo tròn.                                                        |

### Background Texture
Toàn bộ page áp dụng một background texture dạng **giấy mời** (paper texture) — màu `#FAF7F7` với pattern nhẹ `noise` hoặc `linen` ở opacity 5-10%, tạo chiều sâu vi tế.

---

## Typography Scale (page-level)

Font stack gồm 6 font handwriting/decorative + 1 font sans-serif cho body:

| Role | Font | Size (mobile) | Weight | Note |
|------|------|---------------|--------|------|
| **Display Title** — "Save our date" | Aquarelle | 52px | 400 | Font script cursive chính cho tiêu đề lớn nhất |
| **Section Heading** — "Our story", "Timeline", tên chú rể/cô dâu | HoaTay1 | 44–50px | 400–500 | Font viết tay tiếng Việt, dùng cho heading section & tên cặp đôi trong portrait |
| **H1** — "THAM DỰ TIỆC CHUNG VUI" | Playfair Display | 21px | 400 | Serif cổ điển, text-transform: uppercase |
| **H2** — "Nhà Trai"/"Nhà Gái", label family | Quicksand | 21px | 700 | Sans-serif rounded, rõ ràng |
| **Display Name** — Tên cặp đôi hero (HẢI ĐĂNG / YẾN NHI) | Soul Note Display | 39px | 700 | Font display decorative, uppercase |
| **Venue Name** — "TƯ GIA NHÀ TRAI" | Scarlet Bradley | 34px | 400 | Script chữ ký, uppercase |
| **Decorative Script** — "Our story" heading | Monsieur La Doulaise | 63px | 500 | Script sang trọng, dùng rất chọn lọc |
| **Label** — "Chú rể", "Cô dâu", "Tháng 12" | Summerfun | 21–28px | 500 | Font handwriting vui tươi |
| **Quote Overlay** — "All of me loves All of you" | HoaTay1 | 44px | 500 | Trên nền ảnh tối, màu `--page-text-light` |
| **Body** — nội dung, địa chỉ, thông tin | Quicksand | 15–16px | 400–500 | Sans-serif rounded, dễ đọc |
| **Caption** — chú thích nhỏ, âm lịch | Quicksand | 14px | 400 | Italic cho location |
| **CTA Label** — "Chỉ đường", "Gửi xác nhận" | Scarlet Bradley / Quicksand | 27px / 16px | 400 / 600 | Scarlet cho Chỉ Đường; Quicksand cho Submit |

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Quicksand:wght@400;500;600;700&family=Monsieur+La+Doulaise&display=swap');
```
> Aquarelle, HoaTay1, Soul Note Display, Scarlet Bradley, Summerfun là custom fonts — cần host self-hosted trong `/public/fonts/`.

---

## Layout Grid

Thiết kế **Mobile-first Phone Frame**. Trên desktop, page content được wrap trong một khung device mockup, centered trên nền xám:

```
Desktop  (≥768px)  : phone-frame max-width 420px, min-height 100vh,
                     centered trên nền #E5E5E5,
                     border-radius: 32px, overflow: hidden,
                     box-shadow: 0 25px 50px rgba(0,0,0,0.15)
Mobile   (<768px)  : full-width, full-height, no frame
```

**Bên trong phone-frame:**
```
Content width : 100% (≈405px trong frame)
Padding       : 0 (section tự quản lý padding riêng)
Scroll        : overflow-y: auto bên trong frame, custom thin scrollbar
```

**Section vertical rhythm**: Không có gap cứng giữa các section — các section chuyển tiếp liền mạch, phân cách bằng floral decorations hoặc full-width photo.

---

## Page Scroll Flow (wireframe tuyến tính)

```
┌────────────────────────────────────────────────────────────┐
│  [S0]  ENVELOPE INTRO — phong bì xanh rêu + thiệp mời     │
│  Phong bì đóng → khách chạm → phong bì mở → thiệp mời lộ  │
├────────────────────────────────────────────────────────────┤
│  [S1]  FAMILY INFO — Nhà Trai / Nhà Gái (2 cột)            │
├────────────────────────────────────────────────────────────┤
│  [S2]  EVENT DETAILS — Tên đôi + Ngày giờ + Địa điểm       │
│  (layout typography lớn: ngày/tháng/năm/giờ)               │
├────────────────────────────────────────────────────────────┤
│  [S3]  PHOTO HERO — ảnh đôi full-width + quote overlay     │
│  "All of me loves / All of you"                            │
├────────────────────────────────────────────────────────────┤
│  [S4]  COUPLE PORTRAITS — ảnh chú rể & cô dâu             │
│  (polaroid frame xoay nghiêng + tên phía bên)              │
├────────────────────────────────────────────────────────────┤
│  [S5]  OUR STORY — câu chuyện tình yêu (3 đoạn)            │
├────────────────────────────────────────────────────────────┤
│  [S6]  CALENDAR — full-width photo bg + lịch tháng          │
├────────────────────────────────────────────────────────────┤
│  [S7]  TIMELINE — 3 mốc sự kiện ngang vớI icons hand-drawn │
├────────────────────────────────────────────────────────────┤
│  [S8]  PHOTO + QUOTE — ảnh trái + quote phải trên nền olive │
├────────────────────────────────────────────────────────────┤
│  [S9]  COUNTDOWN — nền xanh olive + đếm ngược 4 ô           │
├────────────────────────────────────────────────────────────┤
│  [S10] GALLERY — "ALBUM of LOVE" + masonry grid ảnh         │
├────────────────────────────────────────────────────────────┤
│  [S11] RSVP — form xác nhận tham dự                         │
├────────────────────────────────────────────────────────────┤
│  [S12] WEDDING GIFT — gửi mừng cưới + QR code               │
├────────────────────────────────────────────────────────────┤
│  [S13] THANK YOU / FOOTER — "Thankyou!" + ảnh nền           │
├────────────────────────────────────────────────────────────┤
│  [FLOAT] GUESTBOOK BAR — bottom bar cố định                 │
│  Gửi lời chúc + Bắn Tim + Mừng Cưới + Messages overlay     │
└────────────────────────────────────────────────────────────┘
```

---

## S0 — Envelope Intro Screen

### Mục đích UX
Tạo moment ngạc nhiên, kéo dài sự đón đợi như khi cầm thiệp giấy thật trong tay. Overlay chiếm toàn viewport (hoặc toàn phone-frame), block scroll cho đến khi khách chủ động "mở".

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│                                          │
│  [floral decoration: hoa lan trắng       │
│   góc trên trái + góc trên phải]         │
│                                          │
│       Save our date                      │  ← Aquarelle 52px, --page-envelope
│                                          │
│  ┌────────────────────────────────────┐  │
│  │      [PHONG BÌ SVG ANIMATED]       │  │  ← ~320×200px
│  │                                    │  │
│  │  ┌──── NẮP (flap) ──────────┐     │  │  ← border-color: #3C4E34
│  │  │  opens upward on click   │     │  │
│  │  └──────────────────────────┘     │  │
│  │                                    │  │
│  │  ┌── THIỆP MỜI (letter) ────┐    │  │  ← slides up from inside
│  │  │  Thiệp mời cưới          │    │  │
│  │  │  Minh Hoàng & Thanh Thư  │    │  │  ← HoaTay1 gold text
│  │  │  30.12.2026               │    │  │
│  │  │  Trân trọng mời Anh/Chị/Bạn  │    │  │  ← personalized ?guest=
│  │  └───────────────────────────┘    │  │
│  │                                    │  │
│  │  ┌── POCKET (túi dưới) ──────┐    │  │  ← border: #465C3D / #4A6240
│  │  └───────────────────────────┘    │  │
│  │                                    │  │
│  │  [WAX SEAL: ● sáp đỏ nâu]         │  │  ← centered on flap edge
│  └────────────────────────────────────┘  │
│                                          │
│         Chạm để mở thiệp                │  ← HoaTay1 ~28px, pulse anim
│                                          │
│     TRÂN TRỌNG KÍNH MỜI                 │  ← Quicksand uppercase, muted
│         Anh/Chị/Bạn                         │  ← Scarlet Bradley, personalized
│                                          │
│  [floral decoration: hoa lan trắng       │
│   góc dưới phải]                         │
└──────────────────────────────────────────┘
```

### Envelope Component Details
- **Envelope container**: `background: #3C4E34` (xanh rêu đậm), `perspective: 1000px`
- **Flap (nắp trên)**: Hình tam giác CSS tạo bằng `border`, `border-color: #3C4E34 transparent transparent`, `transform-origin: top center`. Mặt trong flap có thể có pattern lá nhẹ
- **Pocket (túi dưới)**: Hình thang ngược CSS, `border-color: transparent #465C3D #4A6240`
- **Wax Seal**: Circle `36px`, gradient nâu đỏ, positioned ở giao điểm nắp và thân, `box-shadow: 0 2px 8px rgba(0,0,0,0.3)`, có chữ ký hoặc monogram bên trong
- **Letter (thiệp)**: `background: white`, `border-radius: 4px`, chứa ảnh cưới crop nhỏ + text thông tin cơ bản

### Animation Sequence
1. **Tải trang (0–0.5s)**: Page hiện ra, phong bì scale từ 0.9→1.0 với `ease-out`. Floral decorations fade-in.
2. **Idle state**: Text "Chạm để mở thiệp" có `pulse` animation (opacity 0.6→1→0.6, 2s loop).
3. **Khách chạm (trigger)**: Nắp phong bì `rotateX(0→-180deg)` quanh trục **trên cùng** trong `0.6s ease-in-out`, shadow tăng dần. Wax seal tách ra (scale 1→0, opacity 1→0 trong 0.3s).
4. **Từ phong bì**: Thẻ thiệp `slide-up` từ bên trong phong bì `translateY(100%→0)`, `opacity: 0→1` trong `0.5s`.
5. **Transition out (1.5s sau trigger)**: Toàn bộ envelope section `translateY(0→-100%)` hoặc `opacity: 1→0` trong `0.8s`, scroll được mở khóa, section tiếp theo hiện ra.
6. **Skip fallback**: Sau 5s không tương tác → tự động trigger mở.
7. **`prefers-reduced-motion`**: Bỏ qua tất cả animation, chỉ simple fade-in 0.2s.

### Style
- Background: `--page-bg` (`#FAF7F7`) với paper texture
- Phong bì: `#3C4E34` (xanh rêu đậm), shadow-xl
- Floral decorations: SVG/PNG hoa lan trắng + lá xanh nhạt, positioned absolute ở 4 góc, `opacity: 0.9`
- Text "Save our date": Aquarelle 52px, `color: #465C3D`
- Text "Chạm để mở thiệp": HoaTay1 ~28px, `color: --page-text-primary`
- Text "TRÂN TRỌNG KÍNH MỜI": Quicksand uppercase, `letter-spacing: 0.15em`, `color: --page-text-muted`

---

## S1 — Family Info (Nhà Trai / Nhà Gái)

### Mục đích UX
Section đầu tiên sau khi mở thiệp — thông tin gia đình trang trọng theo đúng trình tự truyền thống (cha mẹ → con cái). Hiện ngay để tạo tính "thiệp mời chính thức".

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│  padding: 40px 24px                      │
│                                          │
│  [floral decoration: lá xanh top-center] │
│                                          │
│   Nhà Trai   [icon đôi]   Nhà Gái       │  ← Quicksand 21px bold, --page-primary
│                                          │
│  Ông. Lê Đình Thuật    Ông. Vũ Văn Thuân │  ← Quicksand 15px, --page-primary
│  Bà. Lê Thị Thúy       Bà. Phan Thị Yến │
│                                          │
│  TP. Hưng Yên           TP. Hưng Yên     │  ← Quicksand 15px italic, --page-text-muted
│                                          │
│  [divider: vertical line center hoặc     │
│   icon hoa/chuông giữa 2 cột]           │
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Layout: 2 cột equal, text center mỗi cột
- Header "Nhà Trai" / "Nhà Gái": Quicksand 21px bold, `color: #3A4A3A`
- Icon giữa: SVG nhỏ (chuông cưới hoặc hoa lan), `20px`, `color: --page-accent`
- Tên cha mẹ: Quicksand 15px regular, `color: #3A4A3A`
- Location: Quicksand 15px italic, `color: #333`
- Divider giữa: `1px solid --page-border` hoặc icon decorative

### Animation
- Fade-in từ dưới khi scroll vào, stagger 100ms giữa cột trái và phải

---

## S2 — Event Details (Thông tin lễ cưới)

### Mục đích UX
Section quan trọng nhất — tên cặp đôi, thời gian, địa điểm hiển thị to rõ dạng typography-driven, KHÔNG dùng card. Khách scan được trong 3 giây.

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│  padding: 40px 16px                      │
│                                          │
│     THAM DỰ TIỆC CHUNG VUI              │  ← PlayfairDisplay 21px uppercase
│     CÙNG GIA ĐÌNH CHÚNG TÔI             │     color: #4B5320
│                                          │
│        [floral: hoa lan phải]            │
│                                          │
│       MINH HOÀNG                         │  ← Soul Note Display 39px bold
│            &                             │     uppercase, color: #3A4A3A
│         THANH THƯ                        │
│                                          │
│    09 : 00 , THỨ TƯ                     │  ← Quicksand 24px, #3A4A3A
│                                          │
│  THÁNG 04    05    NĂM 2026             │  ← "05" = Quicksand 66px bold
│              ^^^                         │     "THÁNG 04"/"NĂM 2026" = 30px
│                                          │
│  (Tức ngày xx tháng xx năm 2026)         │  ← Quicksand 17px, #333 (âm lịch)
│                                          │
│     Hôn Lễ được tổ chức tại              │  ← Quicksand 18px bold, #3A4A3A
│     TƯ GIA NHÀ TRAI                     │  ← Scarlet Bradley 34px uppercase
│                                          │
│  Số 59, ngõ 119 Nguyễn Viết Xuân...     │  ← Quicksand 15px, #3A4A3A
│  phường ..., tỉnh ...                    │
│                                          │
│     📍 CHỈ ĐƯỜNG                         │  ← Scarlet Bradley 27px, clickable
│                                          │
│  [floral: hoa lan trái dưới]             │
│                                          │
└──────────────────────────────────────────┘
```

### Date Display (trọng tâm thiết kế)
Ngày cưới hiển thị theo layout đặc biệt — ngày (số lớn nhất) ở trung tâm, tháng và năm ở 2 bên:
```
   THÁNG 04         NĂM 2026
         ╲     05     ╱
          ← 66px →
```
- Ngày: Quicksand 66px, `color: --page-primary`
- Tháng/Năm: Quicksand 30px, cùng màu `--page-primary`
- Layout: `display: flex, align-items: baseline, justify-content: center, gap: 8px`

### Nút "Chỉ Đường"
- Text: Scarlet Bradley 27px uppercase, `color: --page-primary`
- Icon: SVG location pin phía trước, `16px`, cùng màu
- Clickable → mở `https://maps.google.com/?q=<encoded_address>` tab mới
- `rel="noopener noreferrer"`, `aria-label="Mở Google Maps chỉ đường đến ..."`

### Style
- Toàn bộ text center-aligned
- Background: `--page-bg` liền mạch, không viền, không card
- Floral decorations: Hoa lan + lá xanh positioned absolute phải trên & trái dưới

### Animation
- Text elements fade-in stagger 100ms từ trên xuống khi scroll vào
- Số ngày (05) có scale animation `0.8→1.0` nhẹ

---

## S3 — Photo Hero (Ảnh đôi full-width + Quote overlay)

### Mục đích UX
Visual impact mạnh — ảnh đôi uyên ương full-width với quote lãng mạn overlay. Chuyển tiếp từ text-heavy S2 sang visual-heavy.

### Layout
```
┌──────────────────────────────────────────┐
│  [FULL-WIDTH BACKGROUND PHOTO]           │  height: ~400–500px
│                                          │
│  [semi-transparent overlay: dark]        │
│                                          │
│      All of me loves                     │  ← HoaTay1 44px, --page-text-light
│            All of you                    │     position: center-right, staggered
│                                          │
│  [couple walking on green field]         │
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Ảnh nền: `width: 100%`, `object-fit: cover`, `object-position: center`
- Overlay: `linear-gradient(to bottom, rgba(58,74,58,0.15) 0%, rgba(58,74,58,0.4) 100%)`
- Quote text: HoaTay1 44px, `color: #FAF7F7`, `text-shadow: 0 2px 12px rgba(0,0,0,0.4)`
- Text position: Phía trên giữa ảnh, lines lệch nhau tạo cảm giác viết tay tự nhiên

### Animation
- Ảnh: Nhẹ parallax effect (`background-attachment: fixed` hoặc JS-based translateY chậm hơn scroll 0.3x)
- Text: Fade-in + `translateY(20px→0)` khi scroll vào view

---

## S4 — Couple Portraits (Chân dung Chú rể & Cô dâu)

### Mục đích UX
Giới thiệu chân dung riêng — ảnh phong cách polaroid/khung nghiêng tạo cảm giác album thật.

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│                                          │
│  [floral: hoa lan + lá trên phải]        │
│                                          │
│    ┌─────────────────┐                   │
│    │ [ẢNH CHÚ RỂ]   │                   │  ← rotated -5deg, white border 8px
│    │                 │    Chú rể         │  ← Summerfun 21px, #333
│    │                 │    Minh Hoàng      │  ← HoaTay1 39px, #4B5320
│    └─────────────────┘                   │
│                                          │
│  [floral: hoa lan center-left]           │
│                                          │
│                   ┌─────────────────┐    │
│      Cô dâu      │ [ẢNH CÔ DÂU]   │    │  ← rotated +5deg, white border 8px
│      Thanh Thư   │                 │    │
│                   │                 │    │
│                   └─────────────────┘    │
│                                          │
│  [floral: lá xanh dưới center]           │
│                                          │
└──────────────────────────────────────────┘
```

### Photo Frame Style (Polaroid)
- Container: `background: white`, `padding: 8px 8px 24px 8px`
- Shadow: `0 4px 12px rgba(0,0,0,0.15)`
- Rotation: Ảnh chú rể `transform: rotate(-5deg)`, ảnh cô dâu `rotate(+5deg)`
- Ảnh bên trong: `width: ~168px`, `height: ~207px`, `object-fit: cover`
- Positioned: Ảnh chú rể lệch trái, ảnh cô dâu lệch phải, tạo bố cục zigzag

### Text bên cạnh ảnh
- "Chú rể" / "Cô dâu": Summerfun 21px, `color: #333`
- Tên: HoaTay1 39px, `color: #4B5320`
- Position: Bên cạnh hoặc phía trên ảnh, aligned theo hướng nghiêng

### Animation
- Ảnh chú rể: slide-in từ trái `translateX(-30px→0)` + fade
- Ảnh cô dâu: slide-in từ phải `translateX(30px→0)` + fade
- Stagger 200ms giữa 2 ảnh
- Floral decorations fade-in sau ảnh

---

## S5 — Our Story (Câu chuyện tình yêu)

### Mục đích UX
Kết nối cảm xúc — khách đọc 3 đoạn ngắn về hành trình tình yêu của đôi. Đặt sau portrait để tạo mạch "gặp gỡ → yêu thương → kết hôn".

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│  padding: 48px 24px                      │
│                                          │
│  [floral: lá xanh nhỏ top-center]       │
│                                          │
│         Our story                        │  ← Monsieur La Doulaise 63px
│                                          │     color: #4B5320
│                                          │
│  Mọi thứ bắt đầu từ một lời chào giản   │  ← Quicksand 15px, color: #4B5320
│  đơn, nhưng đã thay đổi cả cuộc đời     │     line-height: 1.8
│  chúng tôi.                              │     text-align: center
│                                          │
│  Qua những khoảnh khắc cười đùa, những   │
│  buổi tối ấm áp bên nhau, chúng tôi đã  │
│  cùng nhau lớn lên, học hỏi và yêu      │
│  thương.                                 │
│                                          │
│  Hôm nay, chúng tôi hân hoan chia sẻ    │
│  hành trình này với những người thân yêu │
│  và mong chờ được cùng các bạn ăn mừng  │
│  tình yêu của chúng tôi.                │
│                                          │
│  [floral: lá xanh nhỏ bottom-center]    │
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Heading "Our story": Monsieur La Doulaise 63px, `color: #4B5320`, center
- Body text: Quicksand 15px weight 500, `color: #4B5320`, `line-height: 1.8`, center
- 3 paragraphs cách nhau `margin-bottom: 16px`
- Floral: SVG/PNG lá xanh nhỏ (không hoa — chỉ lá) ở trên và dưới text block

### Animation
- Heading fade-in trước
- Mỗi paragraph fade-in stagger 150ms
- Subtle: không dùng translate lớn, chỉ `opacity: 0→1`

---

## S6 — Calendar Highlight

### Mục đích UX
Visual reminder trực quan về ngày cưới. Lịch overlay trên full-width ảnh nền, tạo cảm giác cinematic — tái hiện cảm giác khoanh tròn ngày trên lịch giấy.

### Layout
```
┌──────────────────────────────────────────┐
│  [FULL-WIDTH BACKGROUND PHOTO]           │  ← ảnh đôi uyên ương scenic
│  [semi-transparent overlay: dark]        │
│                                          │
│          Tháng 12                        │  ← Summerfun 28px, --page-text-light
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  1   2   3   4   5   6   7      │    │  ← grid 7 cột
│  │  8   9  10  11  12  13  14      │    │     mỗi ô ~40x40px
│  │ 15  16  17  18  19  20  21      │    │     color: --page-text-light
│  │ 22  23  24  25  26  27  28      │    │
│  │ 29 [❤30] 31                     │    │  ← ngày 30: heart icon + highlight
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

### Calendar Grid
- Render từ `weddingDate` — tính tự động ngày bắt đầu tuần, số ngày trong tháng
- Không cần header T2/T3/T4... (tham khảo: reference site không hiển thị header ngày trong tuần)
- Mỗi ô: Quicksand 14px, `color: #FAF7F7`, text center

### Wedding Date Highlight (ngày 30)
- Ô wedding date: Overlay hình ảnh **heart SVG** phía trên số, SVG `width: ~30px`
- Heart image: `https://assets.cinelove.me/assets/plugins/calen_heart_1.png` hoặc custom SVG
- Số ngày: bold, `color: white`
- Animation: heart pulse nhẹ khi scroll vào

### Style
- Background: full-width photo, `object-fit: cover`, height ~400px
- Overlay: `rgba(58,74,58,0.5)` hoặc gradient tối nhẹ
- Calendar container: `max-width: 320px`, centered, no background (transparent trên overlay)

### Animation
- Các ô ngày fade-in lần lượt `stagger: 30ms/ô` khi scroll vào
- Heart icon scale `0→1.2→1.0` bounce nhẹ ở cuối

---

## S7 — Timeline (Event Flow)

### Mục đích UX
Visualize trực quan thứ tự các hoạt động trong ngày cưới — giúp khách biết khi nào nên tới, lịch trình diễn ra thế nào. Dùng hand-drawn icons tạo cảm giác thân thiện.

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg (paper texture)   │
│  padding: 48px 16px                      │
│                                          │
│            Timeline                      │  ← HoaTay1 49px, #4B5320
│                                          │
│  ┌──────────┬──────────┬──────────┐      │
│  │ [📷 icon]│ [🥂 icon]│ [💍 icon]│      │  ← hand-drawn SVG ~80x80px
│  │  camera  │ champagne│  rings   │      │
│  │          │  glasses │          │      │
│  │  09:30   │  11:00   │  12:00   │      │  ← Quicksand 16px bold
│  │ Checkin  │Khai Tiệc │Lễ Thành  │      │  ← Quicksand 16px regular
│  │          │          │  Hôn     │      │
│  └──────────┴──────────┴──────────┘      │
│                                          │
│  [NO connecting line — icons tự kể       │
│   chuyện qua visual hierarchy]           │
│                                          │
└──────────────────────────────────────────┘
```

### Hand-drawn Icons (SVG/PNG)
| Event | Icon | Style |
|-------|------|-------|
| Checkin (09:30) | Camera/máy ảnh vintage | Line-art sketch, stroke `#4B5320`, ~80×80px |
| Khai Tiệc (11:00) | 2 ly champagne chạm nhau (kèm ❤ nhỏ) | Line-art sketch, stroke `#4B5320` |
| Lễ Thành Hôn (12:00) | Nhẫn cưới đôi (kèm ❤ nhỏ) | Line-art sketch, stroke `#4B5320` |

### Style
- Layout: 3 cột equal, `gap: 12px`
- Time: Quicksand 16px bold, `color: #4B5320`
- Label: Quicksand 16px regular, `color: #4B5320`
- Icons: hand-drawn/sketch style, NOT flat/geometric — tạo cảm giác thủ công, ấm áp
- KHÔNG có timeline dot/line connecting — chỉ dùng icons + text

### Animation
- 3 icons lần lượt fade-in + scale `0.8→1.0` với stagger `200ms`
- Text bên dưới mỗi icon fade-in sau icon `100ms`

---

## S8 — Photo + Quote Split Section

### Mục đích UX
Tạo điểm thở visual giữa timeline và countdown — ảnh đẹp bên cạnh quote ý nghĩa, trên nền olive đậm tạo contrast mạnh.

### Layout
```
┌──────────────────────────────────────────┐
│  [2 cột: ảnh trái + quote phải]         │
│                                          │
│  ┌─────────────┐┌────────────────────┐   │
│  │             ││                    │   │
│  │  [ẢNH ĐÔI] ││  bg: #3C4E34      │   │
│  │  cưới đang  ││                    │   │
│  │  cầm hoa    ││  Being with you    │   │  ← HoaTay1/Summerfun script
│  │             ││  turns ordinary    │   │     ~22px, --page-text-light
│  │             ││  moments into      │   │
│  │             ││  timeless          │   │
│  │             ││  memories.         │   │
│  │             ││                    │   │
│  └─────────────┘└────────────────────┘   │
│                                          │
│  [floral: hoa lan nhỏ ở giao 2 cột]     │
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Photo: `width: 50%`, `height: auto (~300px)`, `object-fit: cover`
- Quote panel: `width: 50%`, `background: #3C4E34`, `padding: 32px 20px`
- Quote text: HoaTay1 hoặc Summerfun ~22px, `color: #FAF7F7`, `line-height: 1.6`
- Floral decoration: Hoa lan trắng nhỏ positioned ở giao điểm 2 panel, z-index trên
- Trên mobile: Có thể stack dọc (ảnh trên, quote dưới) hoặc giữ side-by-side thu nhỏ

### Animation
- Photo slide-in từ trái
- Quote text typewriter-style hoặc simple fade-in

---

## S9 — Countdown Timer

### Mục đích UX
Tạo excitement và urgency. Nền xanh olive đậm tạo contrast mạnh, đếm ngược realtime.

### Layout
```
┌──────────────────────────────────────────┐
│  background: #3C4E34 (dark olive)        │
│  padding: 48px 24px                      │
│                                          │
│          Countdown                       │  ← HoaTay1/Summerfun ~40px
│                                          │     color: --page-text-light
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  │  291   │ │   12   │ │   26   │ │   38   │
│  │  ngày  │ │  giờ   │ │  phút  │ │  giây  │
│  └────────┘ └────────┘ └────────┘ └────────┘
│                                          │
└──────────────────────────────────────────┘
```

### Countdown Box Style
- Container: `display: flex`, `gap: 12px`, `justify-content: center`
- Mỗi box: `background: rgba(255,255,255,0.15)`, `border-radius: 8px`, `padding: 16px 12px`, `min-width: 72px`
- Số: Quicksand bold 36px hoặc HoaTay1 36px, `color: #FAF7F7`
- Label (ngày/giờ/phút/giây): Quicksand 12px, `color: rgba(250,247,247,0.7)`, `letter-spacing: 0.1em`

### JavaScript Timer Logic
- Tính countdown từ `weddingDate` config
- Update mỗi giây: `setInterval(1000)`
- Khi hết thời gian (ngày cưới đã qua): Hiển thị "Hôm nay là ngày trọng đại! 🎉"
- Cleanup interval on unmount

### Animation
- Số `giây` flip nhẹ mỗi khi thay đổi: `rotateX` 3D flip hoặc simple crossfade `opacity: 1→0→1` trong 300ms
- Toàn bộ section fade-in khi scroll vào

---

## S10 — Gallery / Album

### Mục đích UX
Showcase ảnh cưới đẹp — mixed masonry grid tạo cảm giác album cao cấp, lightbox cho xem chi tiết.

### Header Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg                   │
│  padding: 48px 0 24px                    │
│                                          │
│       ALBUM                              │  ← PlayfairDisplay 36px bold
│          of                              │  ← HoaTay1/script italic 28px
│            LOVE                          │  ← PlayfairDisplay 36px bold
│                                          │
│  (bố trí lệch: ALBUM trái, of giữa,    │
│   LOVE phải, tạo layout typography       │
│   artistic)                              │
│                                          │
└──────────────────────────────────────────┘
```

### Gallery Grid (Masonry-style)
```
Row 1:  [   ẢNH LỚN full-width   ]         ← aspect-ratio: 16/9 hoặc 3/2
Row 2:  [ ẢNH NHỎ 50% ][ ẢNH NHỎ 50% ]    ← aspect-ratio: 3/4 mỗi ảnh
Row 3:  [   ẢNH LỚN full-width   ]         ← aspect-ratio: 4/3
Row 4:  [ ẢNH 50% ][ ẢNH nhỏ 25% ]        ← mixed sizes
         [ ẢNH nhỏ 25% ]
```

- Grid KHÔNG đều — dùng `display: grid` với `grid-template-columns: repeat(2, 1fr)` và `grid-column: span 2` cho ảnh lớn
- Gap: `4px` (rất nhỏ, tạo cảm giác album sát nhau)
- Mỗi ảnh: `object-fit: cover`, `border-radius: 0` (no rounded corners)

### Lightbox / Full-screen Viewer
- **Overlay:** `background: rgba(0,0,0,0.92)`, `z-index: 1000`, fade-in 300ms
- **Image display:** `max-width: 90vw`, `max-height: 90vh`, `object-fit: contain`, centered
- **Navigation arrows:** Circle buttons 48×48px, positioned `absolute left/right 16px`
  - Background: `rgba(255,255,255,0.2)`, color white
  - Hover: background `rgba(255,255,255,0.4)`
- **Close button (✗):** Absolute `top: 16px, right: 16px`, size 32px, color white
- **Image counter:** Quicksand caption `"3 / 12"`, `color: rgba(255,255,255,0.7)`
- **Keyboard:** ArrowLeft/Right navigate, Escape close
- **Touch:** Swipe left/right navigate, tap outside close
- **Accessibility:** `role="dialog"`, trap focus, `aria-label="Gallery image X of Y"`

### Image Loading & Performance
- `loading="lazy"` trên tất cả `<img>`
- Placeholder: `background: #E8DCD0` (cream) + shimmer animation khi loading
- Next.js `<Image>` component với `sizes` prop phù hợp
- WebP support với fallback JPG

---

## S11 — RSVP Form (Xác nhận tham dự)

### Mục đích UX
Form đơn giản, trang trọng — khách điền tên, chọn tham dự, chọn số người từ dropdown, gửi.

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg                   │
│  padding: 48px 24px                      │
│                                          │
│  Hãy xác nhận sự có mặt của bạn để      │  ← Quicksand 15px, --page-accent
│  chúng mình chuẩn bị đón tiếp một       │     text-align: center
│  cách chu đáo nhất.                      │
│  Trân trọng!                             │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │    Xác nhận tham dự              │    │  ← Quicksand 20px bold, center
│  │                                  │    │
│  │  Họ và tên                       │    │  ← Quicksand 14px, label
│  │  ┌──────────────────────────┐    │    │
│  │  │ Nhập tên của bạn         │    │    │  ← input text, border: #E8DCD0
│  │  └──────────────────────────┘    │    │
│  │                                  │    │
│  │  Bạn sẽ tham dự chứ?            │    │  ← label
│  │  ○ Có, tôi sẽ tham dự           │    │  ← radio button (checked default)
│  │  ○ Tôi bận, rất tiếc...         │    │  ← radio button
│  │                                  │    │
│  │  Số lượng người tham dự          │    │  ← label (chỉ hiện khi Yes)
│  │  ┌──────────────────────┐ ▼     │    │  ← <select> dropdown
│  │  │ 1 người               │      │    │     options: 1–10 người
│  │  └──────────────────────┘       │    │
│  │                                  │    │
│  │  ┌──────────────────────────┐    │    │
│  │  │     Gửi xác nhận        │    │    │  ← btn full-width
│  │  └──────────────────────────┘    │    │
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

### Form Component Specs
| Element | Style |
|---------|-------|
| **Form container** | `background: #FAF7F7`, `border-radius: 8px`, `padding: 32px 24px` |
| **Heading "Xác nhận tham dự"** | Quicksand 20px bold, `color: #3A4A3A`, center |
| **Labels** | Quicksand 14px medium, `color: #4B5320` |
| **Text Input** | `border: 1px solid #E8DCD0`, `border-radius: 4px`, `padding: 10px 12px`, Quicksand 15px |
| **Input Focus** | `border-color: #3A4A3A`, `box-shadow: 0 0 0 2px rgba(58,74,58,0.1)` |
| **Input Error** | `border-color: #EF4444`, error message Quicksand 12px red below |
| **Radio buttons** | Standard radio (có thể dùng Ant Design Radio nếu dùng Ant) |
| **Radio — checked** | `accent-color: #3A4A3A` hoặc custom style xanh olive |
| **Dropdown `<select>`** | Same border style as input, Quicksand 15px, options 1→10 người |
| **Submit button** | `background: #3A4A3A`, `color: white`, `border-radius: 4px`, `padding: 12px`, full-width, Quicksand 15px bold |
| **Submit hover** | `background: #4B5320`, transition 200ms |
| **Submit disabled** | opacity 0.5, cursor not-allowed |

### Validation Rules
| Field | Rules |
|-------|-------|
| **Họ và tên** | Required, 2–100 chars, trim whitespace |
| **Tham dự** | Required, must select one |
| **Số lượng** | Only shown khi "Có", required, integer 1–10 |

### Submit Behavior
- POST to `/api/rsvp` with `{ name, attendance, numberOfGuests }`
- Success: Form hide, show message "Cảm ơn bạn! Chúng mình mong gặp bạn nhé ♡"
- Rate limit: Disable button 10s sau khi gửi

---

## S12 — Wedding Gift (Gửi mừng cưới)

### Mục đích UX
Section mừng cưới trực tuyến — hiển thị QR code chuyển khoản hoặc link, kèm lời cảm ơn. Trang nhã, không "ép buộc".

### Layout
```
┌──────────────────────────────────────────┐
│  background: --page-bg                   │
│  padding: 48px 24px                      │
│                                          │
│  [floral: hoa lan trắng top]             │
│                                          │
│       Gửi mừng cưới                      │  ← HoaTay1 42px, #4B5320
│                                          │
│    ┌──────────────────────────┐          │
│    │                          │          │
│    │   [🎁 GIFT BOX icon]     │          │  ← SVG/PNG pink gift box ~120px
│    │                          │          │
│    └──────────────────────────┘          │
│                                          │
│  Cảm ơn bạn đã dành tình cảm cho        │  ← Quicksand 15px, #333
│  chúng mình! Sự hiện diện của bạn        │     text-align: center
│  chính là món quà ý nghĩa nhất, và      │
│  chúng mình vô cùng trân quý khi        │
│  được cùng bạn chia sẻ niềm hạnh        │
│  phúc trong ngày trọng đại này.          │
│                                          │
│  [floral: hoa lan trắng bottom]          │
│                                          │
│  [Nút/link hiện QR code nếu cần]        │
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Gift box icon: PNG/SVG style flat illustration, `width: 120px`, centered
- Colors: Hồng pastel cho gift box (#F9A8D4 ribbon, #FCE7F3 box)
- Text: Quicksand 15px, `color: #333`, `line-height: 1.7`, center
- QR Code (optional): `max-width: 200px`, centered, border `2px solid #E8DCD0`, `border-radius: 8px`, `padding: 12px`

---

## S13 — Thank You / Footer

### Mục đích UX
Kết thúc hành trình thiệp mời — lời cảm ơn chân thành trên nền ảnh scenic.

### Layout
```
┌──────────────────────────────────────────┐
│  [FULL-WIDTH BACKGROUND PHOTO]           │  ← ảnh scenic: cặp đôi đi trên cánh đồng/cầu
│  [semi-transparent overlay]              │
│                                          │
│         Thankyou !                        │  ← HoaTay1 48px, --page-text-light
│                                          │     hoặc Aquarelle script
│                                          │
│  ── Made with Cinelove ──                │  ← Quicksand 12px, rgba(255,255,255,0.5)
│                                          │
└──────────────────────────────────────────┘
```

### Style
- Background photo: `width: 100%`, `height: ~300px`, `object-fit: cover`
- Overlay: `rgba(58,74,58,0.3)` nhẹ
- "Thankyou !": HoaTay1 hoặc Aquarelle 48px, `color: #FAF7F7`, center, `text-shadow: 0 2px 12px rgba(0,0,0,0.3)`
- Credit: Quicksand 12px, `color: rgba(255,255,255,0.5)`, bottom center

---

## Floating Elements (Global)

### Music Player Button
- Vị trí: `position: absolute` (trong phone-frame) `top: 16px, left: 16px`
- Shape: circle `44px`
- Background: `rgba(255,255,255,0.8)` khi paused, `--page-primary` khi playing
- Icon: SVG âm nhạc, `rotate` animation khi playing (spin 360deg / 3s linear infinite)
- `z-index: 900`
- Autoplay: `false` by default (tuân thủ browser policy). Hiện icon play để user bật.

### Floating Guestbook Bottom Bar
Section Guestbook **KHÔNG phải section riêng** mà là **floating bar cố định** ở đáy phone-frame, hiện xuyên suốt khi cuộn page.

```
┌──────────────────────────────────────────┐
│  position: fixed bottom, z-index: 800    │
│  background: rgba(255,255,255,0.95)      │
│  backdrop-filter: blur(8px)              │
│  padding: 8px 12px                       │
│  border-top: 1px solid #E8DCD0           │
│                                          │
│  [Gửi lời chúc... 💬]  [Bắn tim 🎀]    │
│         [🎁 Mừng cưới]  [📸 Album]      │
│                                          │
└──────────────────────────────────────────┘
```

#### Thành phần Bottom Bar:
| Element | Style | Action |
|---------|-------|--------|
| **"Gửi lời chúc..."** | Input pill shape, `background: #F5F1ED`, `border-radius: 20px`, icon 💬 | Tap → mở overlay gửi lời chúc |
| **"Bắn tim"** | Button pill, `background: rgba(200,160,140,0.3)`, icon animated | Tap → bắn hearts particle animation |
| **Mừng cưới** | Icon button circle, icon 🎁 | Tap → mở modal QR/gift |
| **Album** | Icon button circle, icon 📸 | Tap → scroll to Gallery section |

#### Messages Overlay (khi mở):
- Slide-up panel từ bottom bar, `max-height: 60vh`
- Background: transparent (messages floating trên content)
- Messages: Chat bubble style, pink-ish background
- Close: Nút ✗ góc phải hoặc tap outside
- Realtime: Firebase listener, auto-update

#### Chat Bubble Styles (Messages)
| Property | Value |
|----------|-------|
| Background | `rgba(200,160,140,0.5)` (hồng cam nhạt mờ) |
| Border-radius | `12px` |
| Padding | `8px 12px` |
| Font sender name | Quicksand 13px bold, `color: #333` |
| Font message | Quicksand 13px, `color: #333` |
| Emoji | Inline emoji trước message |
| Max-width | `85%` |
| Shadow | `0 1px 3px rgba(0,0,0,0.08)` |

#### "Bắn Tim" (Heart-Shooting) Feature
- Tap nút → particles heart bay lên từ nút, `5–8 hearts` mỗi tap
- Hearts: SVG ❤ nhiều size (16–24px), random rotation, float up `translateY(-100px)` + fade `opacity: 1→0`, duration `800ms`
- Counter: Hiển thị tổng số tim `"50"` bên cạnh nút bắn tim
- Server sync: Increment counter qua API/Firestore

---

## Animation System

### Scroll-triggered Fade-in (toàn trang)
```
Mặc định mọi section-content bắt đầu:
  opacity: 0
  transform: translateY(24px)

Khi IntersectionObserver trigger (threshold 0.15):
  opacity: 1
  transform: translateY(0)
  transition: opacity 600ms ease, transform 600ms ease
  stagger: 100ms mỗi child element
```

### Section-specific Animations
| Section | Animation |
|---------|-----------|
| **S0 Envelope** | Flap rotateX, letter slideUp, wax seal scale-out |
| **S1 Family** | Fade-in + stagger left/right columns |
| **S2 Event** | Text stagger top-down, date number scale |
| **S3 Photo Hero** | Parallax (translateY slower than scroll) |
| **S4 Portraits** | SlideIn from left/right, polaroid wobble |
| **S5 Our Story** | Simple opacity fade stagger per paragraph |
| **S6 Calendar** | Grid cells stagger 30ms each, heart bounce |
| **S7 Timeline** | Icons scale-in stagger 200ms |
| **S8 Photo+Quote** | Photo slideIn left, quote fade |
| **S9 Countdown** | Boxes scale-in + second digit flip |
| **S10 Gallery** | Grid items stagger fade-in on scroll |
| **S13 Footer** | Text fade-in |

### Transition giữa các section
- Không dùng hard border — dùng floral SVG decorations hoặc gradient overlap nhẹ giữa sections
- Một số section (S3, S6, S8, S9, S13) chuyển tiếp bằng full-width photo/color block tạo contrast tự nhiên

### Performance
- Chỉ dùng `transform` và `opacity` cho animation (GPU compositable)
- `will-change: transform` trên envelope, hero image, parallax photos
- `prefers-reduced-motion: reduce` → tắt tất cả transition/animation, chỉ giữ instant state changes
- Intersection Observer dùng `threshold: [0.15]`, `rootMargin: '0px 0px -50px 0px'` để trigger sớm hơn

---

## Component Data Map

Tất cả nội dung động được đọc từ `data/wedding.config.ts`:

```ts
export const weddingConfig = {
  couple: {
    groom: {
      name: "Minh Hoàng",
      photo: "/assets/groom.jpg",            // portrait photo
      fullName: "Lê Minh Hoàng"
    },
    bride: {
      name: "Thanh Thư",
      photo: "/assets/bride.jpg",            // portrait photo
      fullName: "Vũ Thanh Thư"
    },
    heroPhoto: "/assets/hero-couple.jpg",     // ảnh đôi full-width
    scenicPhoto: "/assets/scenic-couple.jpg", // ảnh walking scenic (calendar bg, footer)
    quotePhoto: "/assets/quote-couple.jpg",   // ảnh cho S8 photo+quote
    weddingDate: "2026-04-05T09:00:00+07:00"
  },
  quote: {
    hero: "All of me loves All of you",
    split: "Being with you turns ordinary moments into timeless memories."
  },
  story: [
    "Mọi thứ bắt đầu từ một lời chào giản đơn, nhưng đã thay đổi cả cuộc đời chúng tôi.",
    "Qua những khoảnh khắc cười đùa, những buổi tối ấm áp bên nhau, chúng tôi đã cùng nhau lớn lên, học hỏi và yêu thương.",
    "Hôm nay, chúng tôi hân hoan chia sẻ hành trình này với những người thân yêu, và mong chờ được cùng các bạn ăn mừng tình yêu của chúng tôi."
  ],
  families: {
    groom: {
      father: "Lê Đình Thuật",
      mother: "Lê Thị Thúy",
      city: "T. Hưng Yên"
    },
    bride: {
      father: "Vũ Văn Thuân",
      mother: "Phan Thị Yến",
      city: "T. Hưng Yên"
    }
  },
  event: {
    time: "2026-04-05T09:00:00+07:00",
    dayOfWeek: "Thứ Tư",
    lunarDate: "Tức ngày 22 tháng 11 năm 2026",    // cần tính hoặc hardcode
    venue: "Tư Gia Nhà Trai",
    address: "Số 59, ngõ 119 Nguyễn Viết Xuân, tổ 7c, phường Phủ Lý, tỉnh Hưng Yên",
    mapsUrl: "https://maps.google.com/?q=..."
  },
  timeline: [
    { time: "09:30", label: "Checkin", icon: "camera" },
    { time: "11:00", label: "Khai Tiệc", icon: "champagne" },
    { time: "12:00", label: "Lễ Thành Hôn", icon: "rings" }
  ],
  gallery: [
    { src: "/assets/gallery/1.jpg", alt: "Ảnh cưới cánh đồng" },
    { src: "/assets/gallery/2.jpg", alt: "Ảnh cưới ngắm nhau" },
    // ... 8-12 ảnh
  ],
  gift: {
    bankName: "Vietcombank",
    accountNumber: "...",
    accountHolder: "LÊ MINH HOÀNG",
    qrCodeImage: "/assets/qr-bank.png"
  },
  music: {
    src: "/assets/music/background.mp3",
    autoplay: false
  }
};
```

---

## Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 cho body text (`#333` trên `#FAF7F7` = 12.6:1 ✓, `#4B5320` trên `#FAF7F7` = 7.1:1 ✓)
- [ ] `alt` text có nghĩa cho tất cả ảnh (không dùng "image" hay filename)
- [ ] Form labels liên kết với inputs qua `for`/`id`
- [ ] Lightbox trap focus trong modal khi mở
- [ ] Countdown timer không đọc ra by screen reader mỗi giây (dùng `aria-live="off"` hoặc chỉ update visually)
- [ ] Envelope animation có skip option (auto-open sau 5s, hoặc keyboard accessible)
- [ ] All interactive elements có `:focus-visible` rõ ràng với `outline: 2px solid #3A4A3A`
- [ ] `lang="vi"` trên thẻ `<html>`
- [ ] External links có `rel="noopener noreferrer"` và clear `aria-label`
- [ ] Gallery lightbox trap focus + keyboard navigation ArrowLeft/Right/Escape

---

## Implementation Notes

- **Framework target**: Next.js App Router
- **Animation lib**: CSS Keyframes + Intersection Observer API ưu tiên; Framer Motion nếu cần orchestration phức tạp (envelope animation)
- **Guestbook/RSVP storage**: Firebase Firestore (real-time listener cho Guestbook messages + heart count)
- **Images**: Next.js `<Image>` component với `sizes` prop phù hợp phone-frame width (~405px)
- **Lightbox**: Implement thủ công (~80 LOC) — không dùng library nặng
- **Calendar**: Render tĩnh từ `weddingDate` — không cần date-picker library
- **Custom fonts**: Self-host Aquarelle, HoaTay1, Soul Note Display, Scarlet Bradley, Summerfun trong `/public/fonts/` với `@font-face` declarations
- **Phone frame**: Dùng CSS `max-width: 420px`, `margin: auto`, `border-radius: 32px`, `overflow: hidden` trên desktop. Full-width trên mobile.
- **Envelope**: CSS 3D transforms cho flap animation — cần `perspective` trên parent container
- **Bottom bar**: `position: sticky` hoặc `fixed` trong phạm vi phone-frame container
