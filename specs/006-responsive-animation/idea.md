**Role:** Bạn là một Senior Frontend Engineer và Interaction Designer chuyên về Mobile-first và High-end Web Animations. Bạn có gu thẩm mỹ tinh tế và am hiểu sâu sắc về trải nghiệm người dùng (UX) trên thiết bị di động.

**Nhiệm vụ:** Hãy phân tích toàn bộ codebase hiện tại và viết một bản đặc tả kỹ thuật chi tiết (`specs/006-responsive-animation/spec.md`) để tối ưu hóa hiển thị và hiệu ứng chuyển động khi cuộn trang (Scroll Animation).

### 1. Phân tích & Tìm lỗi (Audit Phase):
* Quét toàn bộ mã nguồn để tìm các lỗi tiềm ẩn: Overflows (cuộn ngang không mong muốn), các giá trị pixel cứng (hardcoded px) gây vỡ layout trên màn hình nhỏ, hoặc các thành phần chưa có breakpoint phù hợp.
* Kiểm tra hiệu suất của các animation hiện tại để đảm bảo không gây "jank" (giật lag) khi kết hợp với scroll animation mới.

### 2. Yêu cầu cấu trúc file `spec.md`:

#### A. Chiến lược Responsive (Mobile-First):
* **Breakpoints:** Định nghĩa bộ khung breakpoints tiêu chuẩn (Mobile, Tablet, Desktop).
* **Fluid Layout:** Sử dụng đơn vị tương đối (rem, em, vh, vw) và Tailwind `clamp()` cho typography để chữ tự động co giãn đẹp mắt.
* **Touch-friendly:** Đảm bảo các nút bấm, link và hiệu ứng bắn tim có khoảng cách (spacing) hợp lý cho thao tác bằng ngón tay.

#### B. Scroll Animation (Elegant & Smooth):
* **The "Vibe":** Hiệu ứng phải mang nét sang trọng, nhẹ nhàng của thiệp cưới (Elegant Reveal). Tránh các chuyển động quá nhanh hoặc quá gắt.
* **Kỹ thuật:** Đề xuất sử dụng `framer-motion` kết hợp với `whileInView` hoặc `Intersection Observer API` để tối ưu hiệu suất (chỉ chạy animation khi phần tử xuất hiện trong khung nhìn).
* **Hiệu ứng cụ thể:** * *Fade-in Up:* Cho các khối văn bản.
    * *Stagger Children:* Cho danh sách hình ảnh hoặc danh sách khách mời.
    * *Parallax nhẹ:* Cho các hình ảnh hoa lá trang trí để tạo chiều sâu.

#### C. Giải quyết lỗi tồn đọng:
* Liệt kê danh sách các file/component cần chỉnh sửa để sửa lỗi responsive đã tìm thấy ở Bước 1.

### 3. Chỉ dẫn cho Agent (Technical Best Practices):
* **Performance:** Không được để Scroll Event làm nghẽn Main Thread. Sử dụng các kỹ thuật tối ưu như `will-change: transform`.
* **Accessibility:** Animation phải hỗ trợ `prefers-reduced-motion` (tắt animation nếu người dùng cài đặt giảm chuyển động trên máy hệ thống).
* **Consistency:** Đảm bảo màu sắc và font chữ của animation đồng bộ với `claude.md` và các spec trước đó.

---

**⚠️ QUY TẮC THỰC THI:**
Đừng viết code ngay. Hãy trình bày bản Spec này thật chuyên nghiệp, phân tích rõ "Tại sao" lại chọn giải pháp đó. Sau khi tôi duyệt Spec, chúng ta mới tiến hành implement.

**Hãy bắt đầu bằng việc phân tích nhanh tình trạng Responsive hiện tại của dự án và trình bày file Spec.**
