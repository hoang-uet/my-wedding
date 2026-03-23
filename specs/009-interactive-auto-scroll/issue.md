### Prompt: Implementation of Interruptible Auto-scroll for Wishes List

**Role:** Senior UI/UX Engineer & Interaction Specialist.
**Context:** Thành phần "Peek Mode" (danh sách lời chúc) đang chạy auto-scroll nhưng lại "khóa" quyền scroll thủ công của người dùng. Điều này gây ức chế trải nghiệm.
**Task:** Phân tích logic hiện tại, viết file specification tại `specs/009-interactive-auto-scroll/spec.md` và triển khai tính năng cho phép ngắt auto-scroll khi người dùng tương tác.

**Execution Plan for Agent:**

1.  **Codebase Analysis:**
    * Xác định cơ chế auto-scroll hiện tại: Đang dùng `setInterval`, `requestAnimationFrame`, hay `CSS Animation`?
    * Tìm hiểu cách danh sách đang chặn sự kiện scroll (ví dụ: `overflow: hidden` hoặc `pointer-events: none`).

2.  **Write Specification (`specs/009-interactive-auto-scroll/spec.md`):**
    * **Objective:** Chuyển đổi từ "Passive Auto-scroll" sang "Interactive Auto-scroll".
    * **Interaction Logic:**
        * **Detection:** Lắng nghe các sự kiện `wheel`, `touchstart`, `mousedown` trên container danh sách.
        * **Pause Action:** Khi phát hiện tương tác, ngay lập tức tạm dừng (pause) animation/logic auto-scroll.
        * **Resume Action:** Sử dụng một "Debounce Timer" (ví dụ: 2-3 giây) sau khi sự kiện `scrollend`, `touchend` hoặc `mouseup` kết thúc để kích hoạt lại auto-scroll.
    * **Edge Cases:** Xử lý trường hợp người dùng scroll đến cuối danh sách hoặc đầu danh sách trong lúc thao tác thủ công.

3.  **Implementation:**
    * Cập nhật Component lời chúc để hỗ trợ trạng thái `isInteracting`.
    * Đảm bảo transition giữa trạng thái "đứng yên" và "bắt đầu chạy lại" phải mượt mà (có `ease-in`), không được giật cục.
    * Đảm bảo thanh scrollbar (nếu hiện ra) có style tinh tế, phù hợp với thiệp cưới.

4.  **Verification:**
    * Test trên Mobile: Thao tác vuốt ngược lên để xem lời chúc cũ, thả tay ra và đợi xem nó có tự chạy lại không.
    * Test trên Desktop: Dùng con lăn chuột để kiểm tra tính năng pause.

**Yêu cầu kỹ thuật:**
* Giải pháp phải tiết kiệm tài nguyên (Performance-wise), tránh re-render liên tục khi đang scroll.
* Ưu tiên giải pháp sử dụng React Hooks (nếu dự án dùng React) để quản lý state của Timer và Animation.
