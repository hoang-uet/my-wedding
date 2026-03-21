# Feature Specification: Trang Landing Page Thiệp Cưới Online

**Feature ID**: 001-wedding-landing-page
**Created**: 2026-03-11
**Updated**: 2026-03-21
**Status**: Đã triển khai (frontend hoàn chỉnh, chưa có backend)

## Tổng quan

Single-page application thiệp cưới online với layout **phone frame** (max 430px, center trên desktop). Trải nghiệm bắt đầu từ phong bì mở bằng tay → nội dung cuộn dọc qua các section → gallery ảnh → RSVP → lời cảm ơn. Nhạc nền tự động phát khi mở phong bì.

---

## User Scenarios & Testing

### User Story 1 — Mở phong bì và nghe nhạc nền (Priority: P1)

Khách mời truy cập link, thấy phong bì với wax seal và hoa lan trang trí. Khách **chạm/click** vào phong bì để mở. Flap lật lên, card trượt ra kèm trái tim bay. Nhạc nền "Golden Hour" bắt đầu phát với fade-in. Sau khi mở, khách cuộn xuống xem nội dung.

**Acceptance Scenarios:**

1. **Given** khách mở link lần đầu, **When** trang tải xong, **Then** phong bì hiển thị ở trạng thái `closed` với animation float lên xuống (20px, 3s).
2. **Given** phong bì đang `closed`, **When** khách click/tap, **Then** flap xoay rotateX(180deg) trong 1.2s, card trượt lên trong 1s (delay 0.5s), 3 trái tim bay lên — tổng animation ~1.7s.
3. **Given** phong bì mở lần đầu, **When** animation bắt đầu, **Then** nhạc nền phát với fade-in 800ms tới volume 0.6, loop vô hạn.
4. **Given** phong bì đang `open`, **When** khách click lần nữa, **Then** phong bì đóng lại (flap close 0.8s, card hạ 0.6s) — tổng ~1.6s.
5. **Given** thiết bị bật `prefers-reduced-motion`, **When** trang load, **Then** tất cả animation bị tắt, nội dung hiển thị trực tiếp.

**Chi tiết kỹ thuật:**
- State machine: `closed` → `opening` → `open` → `closing` → `closed`
- Z-index layers: body(0), card(1-2), pocket(3), flap(5), hearts(7), wax-seal(10)
- Hearts: 3 CSS hearts với float/sway/scale khác nhau (4-7s duration)
- Trang trí: orchid-bouquet (top-right), orchid-single (left) animate khi flap mở
- Card content: Tên cặp đôi, ngày "05.04.2026", text "Trân trọng kính mời..."

---

### User Story 2 — Xem thông tin gia đình và sự kiện (Priority: P1)

Sau khi mở phong bì, khách cuộn xuống qua ảnh divider, thấy thông tin hai họ (Nhà Trai / Nhà Gái) với tên cha mẹ và tỉnh thành. Tiếp theo là thông tin 2 lễ cưới với địa điểm, ngày giờ, ngày âm lịch và link Google Maps.

**Acceptance Scenarios:**

1. **Given** khách cuộn qua WeddingPhotoDivider, **When** FamilyInfo vào viewport, **Then** 2 cột Nhà Trai / Nhà Gái fade-in stagger, mỗi cột hiển thị: Ông (tên cha), Bà (tên mẹ), tỉnh thành.
2. **Given** khách cuộn đến EventDetails, **When** section vào viewport, **Then** hiển thị ngày dương lịch (04/05/2026), ngày âm lịch ("Tức ngày 18 tháng 02 năm 2026"), giờ ("13:00, Chủ Nhật").
3. **Given** EventDetails hiển thị, **When** khách nhìn 2 VenueCard, **Then** thấy: Lễ Thành Hôn (Nhà Trai) và Lễ Vu Quy (Nhà Gái), mỗi card có tên nhà hàng, địa chỉ, link "Xem bản đồ".
4. **Given** khách nhấn "Xem bản đồ", **When** trình duyệt xử lý, **Then** Google Maps mở ra với địa chỉ tương ứng (mapsUrl từ config).

**Chi tiết kỹ thuật:**
- FamilyInfo: 2-column grid, DoubleLeavesIcon divider giữa
- EventDetails: FloralBranch SVG ở góc, VineFrame top-left, CornerOrchidCluster bottom-right
- Ornamental dividers bằng SVG (lines & circles)
- Scroll animation: stagger 150ms giữa các children

---

### User Story 3 — Xem ảnh đôi, câu chuyện tình yêu và lịch cưới (Priority: P2)

Khách tiếp tục cuộn qua các section cảm xúc: ảnh hero với quote tiếng Anh, ảnh polaroid cặp đôi, câu chuyện tình yêu 3 đoạn, lịch tháng 4 với ngày cưới highlight, timeline sự kiện và đếm ngược.

**Acceptance Scenarios:**

1. **Given** khách cuộn đến PhotoHero, **When** section vào viewport, **Then** ảnh hero full-width (480px height) với overlay gradient, quote "All of me loves All of you" (font calligraphy-vn 38px) fade-in từ dưới lên.
2. **Given** khách cuộn đến CouplePortraits, **When** ảnh vào viewport, **Then** 2 ảnh polaroid chồng lên nhau (groom: rotated -5deg, bride: rotated +4deg) với float animation nhẹ, hoa lan trang trí xung quanh.
3. **Given** khách cuộn đến OurStory, **When** section vào viewport, **Then** tiêu đề "Our story" (55px, script-elegant) và 3 đoạn văn tiếng Việt fade-in stagger 150ms, trang trí leaf sprig ornaments.
4. **Given** khách cuộn đến CalendarHighlight, **When** section vào viewport, **Then** lịch tháng 4/2026 hiển thị trên nền ảnh cưới, ngày 5 được highlight bằng heart-highlight.png với pulsing animation, các ô stagger 25ms.
5. **Given** khách cuộn đến WeddingTimeline, **When** section vào viewport, **Then** 3 sự kiện hiển thị dạng grid: 17:00 Đón Khách (camera), 17:30 Khai Tiệc (champagne), 19:00 Văn Nghệ (rings). Icon trong circle 72px.
6. **Given** khách cuộn đến PhotoQuoteSplit, **When** section vào viewport, **Then** layout chia đôi: trái là ảnh, phải là nền gradient xanh olive (#5A7247→#3C4E30) với quote tiếng Việt, dấu ngoặc kép lớn, red heart icon ở mép giữa.
7. **Given** khách cuộn đến Countdown, **When** section vào viewport, **Then** flip clock hiển thị Ngày:Giờ:Phút:Giây đếm ngược tới 2026-04-05T13:15+07:00. Mỗi unit là card 72×82px (olive #4E6440/#435838), flip animation 500ms. Nếu đã qua ngày cưới: hiển thị "Hôm nay là ngày trọng đại!".

---

### User Story 4 — Xem album ảnh cưới (Priority: P2)

Khách cuộn đến Gallery, thấy 6 ảnh preview dạng grid 2 cột. Ảnh cuối hiển thị overlay "+N" (số ảnh còn lại). Click vào ảnh bất kỳ mở lightbox xem toàn bộ 19 ảnh.

**Acceptance Scenarios:**

1. **Given** khách cuộn đến Gallery, **When** section vào viewport, **Then** 6 ảnh preview hiển thị dạng grid 2 cột với stagger animation 100ms. Ảnh thứ 1 và 4 chiếm full-width (16:9), còn lại tỷ lệ 3:4.
2. **Given** gallery hiển thị, **When** khách click vào ảnh bất kỳ, **Then** lightbox mở full-screen hiển thị ảnh phóng to, bộ đếm ảnh ở dưới (VD: "3/19").
3. **Given** lightbox đang mở, **When** khách nhấn phím Arrow Left/Right, **Then** chuyển ảnh trước/sau. Nhấn Escape đóng lightbox.
4. **Given** lightbox đang mở, **When** khách click nút Previous/Next, **Then** chuyển ảnh tương ứng.
5. **Given** ảnh preview thứ 6 (cuối), **When** hiển thị, **Then** overlay tối với text "+13" (19 tổng - 6 preview).

**Hạn chế hiện tại:**
- Chưa hỗ trợ swipe/touch gesture trên mobile trong lightbox
- FloatingPetals (5 cánh hoa) hiển thị trong Gallery với opacity rất thấp (0.15-0.25)

---

### User Story 5 — Xác nhận tham dự RSVP (Priority: P3)

Khách điền form RSVP gồm tên, xác nhận tham dự, số người đi kèm (điều kiện) và lời chúc (tùy chọn).

**Acceptance Scenarios:**

1. **Given** khách cuộn đến RSVPForm, **When** form hiển thị, **Then** thấy 4 trường: Họ tên (text, bắt buộc), Tham dự (Yes/No radio), Số người (chỉ hiện khi chọn Yes), Lời chúc (textarea, tùy chọn).
2. **Given** khách điền đầy đủ và nhấn gửi, **When** form xử lý, **Then** button loading 1s rồi hiển thị "Cảm ơn bạn! Chúng mình mong gặp bạn nhé ♡".
3. **Given** khách nhấn gửi mà tên trống hoặc < 2 ký tự, **When** validation chạy, **Then** border đỏ + message "Vui lòng nhập họ tên (ít nhất 2 ký tự)".
4. **Given** khách chọn "Không tham dự", **When** form cập nhật, **Then** trường số người ẩn đi.

**Hạn chế hiện tại:**
- **KHÔNG có backend thật** — form chỉ simulate delay 1s rồi hiển thị success
- Dữ liệu RSVP không được gửi đi hay lưu trữ

---

### User Story 6 — Thanh điều hướng cố định và tương tác (Priority: P2)

FloatingBar cố định ở bottom màn hình cho phép gửi lời chúc nhanh, bắn trái tim và nhảy tới gallery.

**Acceptance Scenarios:**

1. **Given** trang đã scroll qua phong bì, **When** FloatingBar hiển thị, **Then** thấy: ô "Gửi lời chúc..." (trái), nút trái tim (giữa), nút camera với badge đỏ "6" (phải).
2. **Given** khách nhấn vào ô lời chúc, **When** panel mở, **Then** hiển thị danh sách lời chúc mẫu (5 mock messages) và ô nhập + nút gửi. Nút X để đóng.
3. **Given** khách nhấn nút trái tim, **When** animation chạy, **Then** 7 trái tim bay lên với kích thước ngẫu nhiên (14-26px), màu sắc khác nhau, spread ngang -40→+40px, fade-out trong 900ms.
4. **Given** khách nhấn nút camera, **When** trang xử lý, **Then** smooth scroll xuống section Gallery.

**Hạn chế hiện tại:**
- Danh sách lời chúc là **MOCK_MESSAGES hardcoded** — chưa kết nối Supabase
- Badge "6" trên nút camera là hardcoded, không lấy từ số ảnh thật
- Nút Gift đã bị comment out trong code

---

### User Story 7 — Mừng cưới và lời cảm ơn (Priority: P3)

Khách cuộn đến phần mừng cưới và kết thúc bằng lời cảm ơn.

**Acceptance Scenarios:**

1. **Given** khách cuộn đến WeddingGift, **When** section hiển thị, **Then** thấy minh họa hộp quà SVG, text cảm ơn và trang trí hoa.
2. **Given** khách cuộn đến ThankYou, **When** section hiển thị, **Then** ảnh cưới full-width (320px height) với text "Thank you!" (52px, script-elegant), tên cặp đôi và ngày "05 . 04 . 2026".

**Hạn chế hiện tại:**
- **WeddingGift KHÔNG hiển thị thông tin ngân hàng** mặc dù config có đầy đủ: bankName (Vietcombank), accountNumber, accountHolder. Đây là gap cần bổ sung.

---

### User Story 8 — Nhạc nền (Priority: P2)

MusicButton (vinyl disc) ở góc trên phải cho phép bật/tắt nhạc.

**Acceptance Scenarios:**

1. **Given** nhạc đang phát, **When** khách nhìn MusicButton, **Then** vinyl disc xoay (3s/vòng) với gradient xanh đậm và groove rings.
2. **Given** nhạc đang phát, **When** khách click MusicButton, **Then** volume fade-out trong 800ms rồi pause. Disc dừng xoay, chuyển sang frosted white.
3. **Given** nhạc đang tắt, **When** khách click MusicButton, **Then** play với fade-in 800ms tới volume 0.6.

**Chi tiết kỹ thuật:**
- Audio: `golden-hour.mp3`, preload: 'none' (lazy load)
- Fade: requestAnimationFrame, ease-in-out quadratic, 800ms
- Target volume: 0.6, loop: true
- Xử lý autoplay policy: catch play() error im lặng

---

## Edge Cases (đã xử lý)

| Case | Xử lý |
|------|-------|
| `prefers-reduced-motion` | Tất cả animation bị disable ngay lập tức (useScrollAnimation, floral, hearts) |
| Ảnh chưa tải xong | Blur placeholder hiển thị, ảnh thật fade-in khi load xong (WeddingImage) |
| Autoplay bị chặn | `play()` error bị catch, không crash. Khách dùng MusicButton để bật thủ công |
| Đã qua ngày cưới | Countdown hiển thị "Hôm nay là ngày trọng đại!" thay vì số âm |
| Gallery lightbox keyboard | Arrow keys + Escape hoạt động khi lightbox mở |

## Edge Cases (chưa xử lý)

| Case | Tình trạng |
|------|-----------|
| Tên/lời chúc quá dài | Không có giới hạn ký tự trên RSVP form |
| Gallery swipe trên mobile | Lightbox chưa hỗ trợ touch/swipe |
| JavaScript bị tắt | Trang trắng (SPA, không có SSR/fallback) |
| Guestbook spam | Chưa có rate limit (FloatingBar dùng mock data) |
| URL parameter cá nhân hóa tên khách | Chưa triển khai |

---

## Requirements

### Functional Requirements

**Phong bì & Nhạc nền**
- **FR-001**: ✅ Phong bì hiển thị khi tải xong, yêu cầu **click thủ công** để mở (không auto-open).
- **FR-002**: ✅ Animation mở: flap xoay 1.2s + card trượt 1s + hearts bay — tổng ~1.7s.
- **FR-003**: ✅ Nhạc nền phát tự động khi phong bì mở lần đầu, fade-in 800ms.
- **FR-004**: ✅ `prefers-reduced-motion` được tôn trọng — tắt toàn bộ animation.

**Thông tin gia đình & Sự kiện**
- **FR-005**: ✅ FamilyInfo hiển thị 2 cột Nhà Trai / Nhà Gái (cha, mẹ, tỉnh thành).
- **FR-006**: ✅ EventDetails hiển thị ngày dương lịch, ngày âm lịch, giờ, thứ.
- **FR-007**: ✅ 2 VenueCard: Lễ Thành Hôn (Nhà Trai) và Lễ Vu Quy (Nhà Gái) với tên nhà hàng, địa chỉ.
- **FR-008**: ✅ Link "Xem bản đồ" mở Google Maps với mapsUrl từ config.

**Nội dung cảm xúc**
- **FR-009**: ✅ PhotoHero full-width với quote "All of me loves All of you".
- **FR-010**: ✅ CouplePortraits dạng polaroid chồng lên nhau, hoa lan trang trí.
- **FR-011**: ✅ OurStory: tiêu đề + 3 đoạn văn từ config.story.
- **FR-012**: ✅ CalendarHighlight: lịch tháng 4/2026, ngày 5 highlight với heart pulsing.
- **FR-013**: ✅ WeddingTimeline: 3 sự kiện (17:00, 17:30, 19:00) với icon SVG.
- **FR-014**: ✅ PhotoQuoteSplit: chia đôi ảnh + quote trên nền gradient xanh olive.
- **FR-015**: ✅ Countdown flip clock đếm ngược tới ngày cưới.

**Gallery**
- **FR-016**: ✅ Grid 2 cột, 6 ảnh preview (ảnh 1 & 4 full-width 16:9, còn lại 3:4).
- **FR-017**: ✅ Lightbox full-screen với 19 ảnh, bộ đếm, nút prev/next.
- **FR-018**: ✅ Keyboard navigation (Arrow keys, Escape).
- **FR-019**: ✅ Ảnh lazy-load với blur placeholder (WeddingImage component).
- **FR-020**: ⚠️ Chưa hỗ trợ swipe/touch trên mobile.

**RSVP**
- **FR-021**: ✅ Form: tên (bắt buộc), tham dự (Yes/No), số người (điều kiện), lời chúc (tùy chọn).
- **FR-022**: ✅ Validation: tên ≥ 2 ký tự, hiển thị lỗi tại trường.
- **FR-023**: ✅ Số người ẩn khi chọn "Không tham dự".
- **FR-024**: ⚠️ Chỉ simulate — **chưa có backend** lưu trữ dữ liệu.

**Mừng cưới**
- **FR-025**: ✅ WeddingGift hiển thị minh họa và text cảm ơn.
- **FR-026**: ❌ **Thông tin ngân hàng KHÔNG được render** (config có data nhưng component bỏ qua).

**FloatingBar**
- **FR-027**: ✅ Sticky bottom bar: ô lời chúc, nút hearts, nút camera.
- **FR-028**: ✅ Bắn 7 hearts ngẫu nhiên khi nhấn nút.
- **FR-029**: ✅ Nút camera scroll đến Gallery.
- **FR-030**: ⚠️ Danh sách lời chúc là **mock data hardcoded** — chưa kết nối backend.

**Layout & Config**
- **FR-031**: ✅ Phone frame 430px max, rounded 36px trên desktop, full-width trên mobile (<768px).
- **FR-032**: ✅ Thin scrollbar custom (2px width).
- **FR-033**: ✅ Tất cả dữ liệu nội dung tập trung trong `wedding-config.ts`.
- **FR-034**: ❌ Chưa hỗ trợ cá nhân hóa tên khách qua URL parameter.

### Hệ thống trang trí (Floral Overlay)

5 module trang trí dùng xuyên suốt trang:

| Module | Kích thước | Animation | Dùng tại |
|--------|-----------|-----------|----------|
| CornerOrchidCluster | 85-100px | floralSway 7s | EventDetails, RSVPForm |
| OrchidBranchDivider | 140px wide | floralFloat 10s | Giữa OurStory và Calendar |
| BouquetAccent | 130-160px | floralSway 8s | RSVPForm, OurStory |
| VineFrame | 100×100px SVG | vineGrow 1.5s | Countdown, EventDetails |
| FloatingPetals | 5 cánh hoa | petalDrift 9-17s | Gallery (opacity 0.15-0.25) |

Tất cả có `aria-hidden="true"` và tôn trọng `prefers-reduced-motion`.

---

## Key Entities (cấu trúc thực tế)

```typescript
// wedding-config.ts
WeddingConfig {
  couple: {
    groom: { name, displayName, fullName }
    bride: { name, displayName, fullName }
    weddingDate: string // ISO 8601
  }
  quote: { hero: string, split: string }
  story: string[] // 3 đoạn
  families: {
    groom: { father, mother, city }
    bride: { father, mother, city }
  }
  event: {
    time: string // ISO 8601
    dayOfWeek, lunarDate: string
    groom: { venue, address, mapsUrl }
    bride: { venue, address, mapsUrl }
  }
  timeline: Array<{ time, label, icon }>
  gift: { bankName, accountNumber, accountHolder }
}

// image-manifest.ts (auto-generated)
ImageData {
  blur: string    // base64 blur placeholder
  srcSet: string  // responsive srcSet (320w, 640w, 960w, 1280w WebP)
  src: string     // fallback src
  width: number
  height: number
}
```

---

## Thứ tự sections trong App.tsx

| # | Component | Mô tả |
|---|-----------|-------|
| 1 | EnvelopeCard | Phong bì tương tác, trigger nhạc |
| 2 | WeddingPhotoDivider | Ảnh divider full-width (380px) |
| 3 | FamilyInfo | Thông tin 2 họ |
| 4 | EventDetails | 2 VenueCard + ngày giờ |
| 5 | PhotoHero | Ảnh hero + quote tiếng Anh |
| 6 | CouplePortraits | Ảnh polaroid chồng |
| 7 | OrchidBranchDivider | Hoa lan phân cách |
| 8 | OurStory | 3 đoạn câu chuyện |
| 9 | CalendarHighlight | Lịch tháng 4 + heart ngày 5 |
| 10 | WeddingTimeline | 3 sự kiện timeline |
| 11 | PhotoQuoteSplit | Ảnh + quote chia đôi |
| 12 | Countdown | Flip clock đếm ngược |
| 13 | Gallery | 6 preview + lightbox 19 ảnh |
| 14 | RSVPForm | Form xác nhận tham dự |
| 15 | WeddingGift | Phần mừng cưới (thiếu bank info) |
| 16 | ThankYou | Ảnh + "Thank you!" kết thúc |

**Overlay cố định:** MusicButton (top-right, z:900), FloatingBar (bottom, z:800)

---

## Thiết kế trực quan

### Bảng màu
| Vai trò | Màu | Hex |
|---------|-----|-----|
| Background chính | Cream/beige | #F0EBE2 |
| Envelope body | Xanh olive đậm | #3C4E34 |
| Countdown cards | Olive | #4E6440 / #435838 |
| Quote background | Gradient olive | #5A7247 → #4A5D3A → #3C4E30 |
| Text chính | Đậm gần đen | #030213 |

### Hệ thống font (11 custom fonts)
| Font | Vai trò | Ví dụ |
|------|---------|-------|
| Quicksand | Body text | Nội dung đoạn văn |
| Playfair Display | Heading | Tiêu đề section |
| Soul Note Display | Tên cặp đôi | "Minh Hoàng & Thanh Thư" |
| Aquarelle | Save the date | Hero text |
| Monsieur La Doulaise | Script lãng mạn | Ornamental text |
| HoaTay1 | Thư pháp Việt | Decorative Vietnamese |
| Scarlet Bradley | Tên nhà hàng | Venue names |
| Summerfun | Label vui | Casual labels |
| Signora | Lời mời phong bì | Envelope prompt |
| Carlytte | Tên khách mời | Guest names |
| The Artisan | Quote tiếng Anh | English quotes |

---

## Success Criteria

- **SC-001**: ✅ Khách xem đầy đủ thông tin trong vòng 10s sau khi mở phong bì.
- **SC-002**: Trang FCP < 2s trên 4G mobile (cần đo thực tế).
- **SC-003**: ✅ Ảnh responsive 4 kích thước WebP + blur placeholder giúp tối ưu dung lượng.
- **SC-004**: ⚠️ Gallery lightbox chưa hỗ trợ swipe trên mobile.
- **SC-005**: ✅ RSVP form hoàn tất < 60s (4 trường đơn giản).
- **SC-006**: ⚠️ Guestbook chưa triển khai thật (xem spec 002).
- **SC-007**: ✅ Phone frame 430px đảm bảo layout nhất quán (không responsive truyền thống).
- **SC-008**: ✅ Thay đổi nội dung chỉ cần sửa `wedding-config.ts`.

---

## Assumptions (cập nhật)

- ~~Ảnh placeholder~~ → Ảnh thật đã có, đã tối ưu thành 4 kích thước WebP.
- ~~Firebase Firestore~~ → Sẽ dùng **Supabase** cho backend (xem spec 002).
- Layout không phải responsive truyền thống mà là **phone frame cố định 430px** center trên desktop.
- Thiết kế: tông **xanh olive + cream**, **không phải** pastel hồng như dự kiến ban đầu.
- Font: 11 custom fonts (không phải chỉ serif + sans-serif).
- Phong bì: **click thủ công** để mở (không auto-open) — do autoplay policy.

---

## Việc cần làm (backlog)

| Ưu tiên | Việc | Ghi chú |
|---------|------|---------|
| CAO | Hiển thị thông tin ngân hàng trong WeddingGift | Config có data, component chưa render |
| CAO | Backend RSVP thật | Hiện tại chỉ simulate |
| TRUNG BÌNH | Swipe gesture cho Gallery lightbox | Cần touch handler |
| TRUNG BÌNH | Thay mock messages trong FloatingBar bằng Supabase | Xem spec 002 |
| THẤP | Badge camera động (số ảnh thật thay vì hardcode "6") | Lấy từ image manifest |
| THẤP | URL parameter cá nhân hóa tên khách | ?guest=Tên |
