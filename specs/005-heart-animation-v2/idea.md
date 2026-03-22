# Viết Spec Tính Năng "Real-time Heart Blessings Animation"

**Role:** Bạn là một Senior Technical Architect và UX Engineer chuyên về hiệu ứng tương tác (Interactive Animations) và hệ thống Real-time.

**Nhiệm vụ:** Hãy viết một bản đặc tả kỹ thuật chi tiết (`specs/005-heart-animation-v2/spec.md`) để nâng cấp tính năng "Bắn tim" từ một hiệu ứng đơn giản thành một trải nghiệm "TikTok-style Live Interaction" đầy cảm xúc.

### 1. Phân tích yêu cầu & Trải nghiệm người dùng (UX):
* **Cảm hứng:** Hiệu ứng bắn tim như trên Livestream TikTok (nhiều trái tim bay lên/rơi xuống với quỹ đạo ngẫu nhiên, nhẹ nhàng).
* **Visual:** Trái tim bé xinh, nhiều sắc độ đỏ/hồng, độ trong suốt (opacity) thay đổi để không che lấp nội dung chính của thiệp.
* **Social Proof:** Mọi người dùng đang truy cập thiệp đều thấy hiệu ứng của nhau theo thời gian thực (Real-time).

### 2. Yêu cầu cấu trúc file `spec.md` phải bao gồm:

#### A. Frontend Architecture (Hiệu năng là ưu tiên số 1):
* **Animation Engine:** Đề xuất sử dụng Canvas API hoặc một thư viện nhẹ (như `framer-motion` hoặc `canvas-confetti` tùy chỉnh) để render hàng trăm particle (trái tim) mà không làm lag trình duyệt (60fps).
* **Physics:** Định nghĩa các thông số ngẫu nhiên: Vị trí bắt đầu, quỹ đạo bay (S-curve), tốc độ rơi/bay, kích thước và góc xoay để tạo sự tự nhiên.
* **Z-index Management:** Đảm bảo hiệu ứng nằm dưới các nút bấm tương tác nhưng nằm trên các layer trang trí tĩnh.

#### B. Backend & Real-time (Supabase Integration):
* **Mechanism:** Sử dụng **Supabase Realtime (Broadcast mode)** thay vì lưu vào Database cho mỗi lần click để giảm tải cho DB và giảm độ trễ (latency).
* **Payload:** Thiết kế gói tin dữ liệu nhỏ nhất có thể (VD: `{ type: 'HEART_BURST', count: 5 }`).

#### C. Hệ thống chống Spam & Grouping logic (Optimization):
* **Client-side Throttling:** Giới hạn số lần click mỗi giây từ một người dùng.
* **Event Batching:** Nếu có quá nhiều người bắn tim cùng lúc (VD: 50 người), hệ thống cần "gộp" (batch) các sự kiện lại để hiển thị một cơn mưa tim đồng nhất thay vì render rời rạc gây rối mắt.
* **Visual Cap:** Giới hạn số lượng trái tim tối đa hiển thị trên màn hình cùng một lúc để bảo vệ CPU/RAM của thiết bị mobile.

#### D. Implementation Plan:
* Phân chia các task: Setup Broadcast channel -> Build Particle System component -> Integrate Real-time hook -> UI/UX Polishing.

### 3. Chỉ dẫn cho Agent (Implementation Notes):
* Cần lưu ý về việc tiêu thụ pin trên thiết bị di động (không nên để loop animation chạy khi không có sự kiện).
* Cập nhật `claude.md` sau khi hoàn thành spec này.

---

**⚠️ QUY TẮC AN TOÀN:**
Bản spec phải đảm bảo không yêu cầu các thư viện quá nặng làm tăng bundle size của project. Hãy ưu tiên các giải pháp native hoặc lightweight.

**Hãy trình bày file Spec này bằng Markdown thật chuyên nghiệp và logic để tôi có thể ra lệnh implement ngay sau đó.**
