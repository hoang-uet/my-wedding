Fix Mobile Auto-zoom on Input Focus

**Role:** Senior Mobile Web & UX Engineer.
**Context:** Người dùng gặp trải nghiệm tệ trên thiết bị di động: Khi focus vào các trường input (nhập tên, gửi lời chúc), trình duyệt tự động zoom vào và không reset lại tỷ lệ (scale) ban đầu sau khi blur.
**Task:** Phân tích nguyên nhân gốc rễ, viết file specification `specs/008-fix-mobile-input-zoom/spec.md` và thực hiện fix lỗi này trên toàn bộ project.

**Execution Steps for Agent:**

1.  **Root Cause Analysis (RCA):**
    * Kiểm tra toàn bộ các phần tử `<input>`, `<textarea>`, và `<select>` trong project (đặc biệt là trong các Modal).
    * Xác định các phần tử có `font-size` nhỏ hơn **16px**. Đây là ngưỡng kích hoạt tính năng auto-zoom của iOS Safari.
    * Kiểm tra thẻ `<meta name="viewport">` hiện tại trong `index.html`.

2.  **Write Specification (`specs/007-fix-mobile-input-zoom.md`):**
    * **Problem:** Mô tả chi tiết hiện tượng "Sticky Zoom" trên Mobile.
    * **Proposed Solution:** So sánh và lựa chọn giải pháp tối ưu:
        * *Option 1:* Nâng `font-size` lên tối thiểu 16px cho mobile (Khuyên dùng - Best Practice).
        * *Option 2:* Sử dụng CSS `transform: scale()` để giữ nguyên kích thước hiển thị nhưng đánh lừa trình duyệt về font-size thực tế.
        * *Option 3:* Can thiệp vào thẻ meta viewport (Cân nhắc kỹ về tính Accessibility).
    * **Implementation Plan:** Danh sách các file cần chỉnh sửa và các lớp CSS/Component liên quan.

3.  **Implementation:**
    * Triển khai giải pháp đã chọn (ưu tiên giải pháp CSS/Typography để không ảnh hưởng đến khả năng zoom thủ công của người dùng).
    * Đảm bảo giao diện vẫn đẹp mắt, không bị vỡ layout khi nâng font-size. Sử dụng Media Queries để chỉ áp dụng thay đổi trên màn hình nhỏ.

4.  **Verification (Playwright-cli):**
    * Giả lập thiết bị iPhone (Mobile Safari) để test.
    * Thực hiện kịch bản: Click input -> Kiểm tra trạng thái zoom -> Click ra ngoài (blur) -> Kiểm tra xem tỷ lệ màn hình có bị biến dạng không.

**Yêu cầu kỹ thuật:** * Giải pháp phải "Clean", không dùng các hack gây ảnh hưởng đến hiệu năng hoặc SEO.
* Đặc biệt chú ý đến các Input bên trong Modal (nhập tên, lời chúc) vì đây là nơi người dùng tương tác nhiều nhất.
