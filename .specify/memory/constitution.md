<!--
  Báo cáo Đồng bộ (Sync Impact Report)
  ======================================
  Thay đổi phiên bản: N/A → 1.0.0 (phê duyệt lần đầu)
  Nguyên tắc được sửa đổi: N/A (tạo mới hoàn toàn)
  Các mục được thêm:
    - Core Principles (5 nguyên tắc)
    - Ràng buộc Công nghệ & Hiệu năng
    - Quy trình Phát triển
    - Quản trị
  Các mục bị xóa: N/A
  Các template cần cập nhật:
    - .specify/templates/plan-template.md ✅ đã xem xét (không cần cập nhật)
    - .specify/templates/spec-template.md ✅ đã xem xét (không cần cập nhật)
    - .specify/templates/tasks-template.md ✅ đã xem xét (không cần cập nhật)
  TODO còn tồn đọng: Không có
-->

# Hiến pháp Dự án — Wedding Landing Page

## Nguyên tắc Cốt lõi

### I. Thiết kế Responsive-First (BẮT BUỘC — KHÔNG THƯƠNG LƯỢNG)

- Mọi component PHẢI được thiết kế theo hướng mobile-first
  và tự động thích ứng linh hoạt với màn hình tablet và desktop.
- Breakpoint TỐI THIỂU phải bao gồm: mobile (<768px),
  tablet (768px–1024px) và desktop (>1024px).
- Touch target trên mobile PHẢI có kích thước tối thiểu 44×44px.
- Layout KHÔNG ĐƯỢC yêu cầu cuộn ngang trên bất kỳ
  viewport nào được hỗ trợ.
- Toàn bộ các thành phần tương tác (button, form, navigation)
  PHẢI sử dụng được hoàn toàn trên thiết bị cảm ứng.

### II. Animation & Chất lượng Hình ảnh

- Hiệu ứng mở thiệp (envelope-opening animation) ở Hero section
  PHẢI mượt mà (đạt mục tiêu 60fps) và KHÔNG ĐƯỢC chặn
  người dùng truy cập nội dung.
- Ưu tiên dùng CSS animations và transitions thay vì
  JavaScript-driven animations để đảm bảo hiệu năng.
- Mọi animation PHẢI tuân thủ media query
  `prefers-reduced-motion` — cung cấp static fallback
  khi người dùng bật chế độ giảm chuyển động.
- Tài nguyên hình ảnh PHẢI dùng định dạng hiện đại
  (WebP/AVIF kèm JPEG/PNG fallback) và thuộc tính
  `srcset` responsive.
- Lazy loading PHẢI được áp dụng cho ảnh dưới màn hình
  đầu tiên (đặc biệt là phần Gallery).

### III. Kiến trúc Nội dung Tập trung

- Toàn bộ dữ liệu liên quan đến đám cưới (tên, ngày tháng,
  địa điểm, ảnh) PHẢI được tập trung trong một file
  data/config duy nhất, không rải rác trong các template HTML.
- Nội dung PHẢI có thể tuỳ chỉnh mà không cần sửa logic
  component — tách biệt rõ ràng giữa dữ liệu và giao diện.
- Tiếng Việt PHẢI là ngôn ngữ chính; toàn bộ UI text
  PHẢI được định nghĩa trong cấu trúc có thể bản địa hoá.
- Tích hợp Google Maps PHẢI dùng embed hoặc link trực tiếp,
  tuyệt đối không để lộ API key trong code phía client.

### IV. Khả năng Tiếp cận & Trải nghiệm Người dùng

- Semantic HTML PHẢI được dùng cho tất cả các section
  (header, main, section, nav, footer, các phần tử form).
- Độ tương phản màu sắc PHẢI đạt tiêu chuẩn tối thiểu
  WCAG 2.1 AA (4.5:1 cho chữ thường, 3:1 cho chữ lớn).
- Mọi hình ảnh PHẢI có thuộc tính `alt` có nghĩa.
- Các form (RSVP, Guestbook) PHẢI có label đầy đủ, phản
  hồi validation rõ ràng và hỗ trợ điều hướng bằng bàn phím.
- Trang PHẢI có thể điều hướng và đọc được khi tắt
  JavaScript (progressive enhancement).

### V. Đơn giản & Hiệu năng

- Trang PHẢI là static site hoặc single-page application —
  không thêm SPA routing phức tạp không cần thiết.
- Tổng dung lượng trang PHẢI dưới 3MB khi tải lần đầu
  (không tính ảnh gallery được lazy load).
- First Contentful Paint PHẢI đạt mục tiêu dưới 2 giây
  trên kết nối 4G mobile.
- Dependency PHẢI ở mức tối thiểu — tránh dùng framework
  nặng khi vanilla HTML/CSS/JS hoặc thư viện nhẹ là đủ.
- KHÔNG ĐƯỢC thêm tính năng ngoài 5 section đã định nghĩa
  (Hero, Thông tin Sự kiện, Gallery, RSVP, Guestbook)
  trừ khi có yêu cầu rõ ràng.

## Ràng buộc Công nghệ & Hiệu năng

- **Stack**: HTML5, CSS3 (dùng CSS custom properties cho
  theming), JavaScript (ES6+). Framework nhẹ (ví dụ:
  Astro, Vite + vanilla) được phép nếu giảm được độ phức tạp.
- **Hosting**: Static hosting (GitHub Pages, Vercel,
  Netlify hoặc nền tảng CDN tương đương).
- **Không cần backend**: Dữ liệu RSVP và Guestbook CÓ THỂ
  dùng serverless function, dịch vụ form bên thứ ba, hoặc
  Firebase — nhưng bản thân landing page KHÔNG ĐƯỢC yêu
  cầu một server đang chạy.
- **Hỗ trợ trình duyệt**: 2 phiên bản mới nhất của Chrome,
  Safari, Firefox và Edge. iOS Safari và Android Chrome
  PHẢI được kiểm thử tường minh.
- **Tối ưu hình ảnh**: Toàn bộ ảnh cưới PHẢI được tối ưu
  trước khi deploy (nén, resize về tối đa 2x độ phân giải
  hiển thị).

## Quy trình Phát triển

- **Branching**: Tạo feature branch từ `main`; merge qua
  pull request và phải có ít nhất một lần review trực quan.
- **Visual QA**: Mọi thay đổi PHẢI được kiểm tra trên ít
  nhất một thiết bị mobile (hoặc emulator) và một trình
  duyệt desktop trước khi merge.
- **Cập nhật nội dung**: Thay đổi địa điểm, ngày giờ hoặc
  tên PHẢI chỉ cần sửa file data tập trung — không sửa
  file template.
- **Deploy**: Quá trình deploy PHẢI được tự động hoá qua
  CI/CD khi push lên `main` (hoặc trigger tương đương).
- **Quản lý tài nguyên**: Ảnh mới PHẢI đi qua pipeline
  tối ưu hoá trước khi commit vào repository.

## Quản trị

- Bản hiến pháp này có quyền ưu tiên cao nhất, bãi bỏ
  mọi quy ước tự phát trong dự án Wedding Landing Page.
- Sửa đổi phải đáp ứng: (1) lý do được ghi chép rõ ràng,
  (2) tăng version theo quy tắc semantic versioning,
  (3) cập nhật Sync Impact Report.
- Mọi pull request PHẢI xác minh tuân thủ 5 nguyên tắc
  cốt lõi trước khi được duyệt.
- Độ phức tạp vượt ngoài phạm vi đã định PHẢI được lý
  giải bằng văn bản và được chấp thuận trước khi triển khai.

**Version**: 1.0.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-11
