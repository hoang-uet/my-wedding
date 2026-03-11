# Feature Specification: Trang Landing Page Thiệp Cưới Online

**Feature Branch**: `001-wedding-landing-page`
**Created**: 2026-03-11
**Status**: Draft
**Input**: Trang Landing Page Thiệp Cưới Online với hiệu ứng mở thiệp, thông tin sự kiện 2 lễ (Vu Quy & Tân Hôn), album ảnh cưới, form RSVP và guestbook gửi lời chúc

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Khách mời mở thiệp và xem thông tin hôn lễ (Priority: P1)

Khách mời truy cập đường link thiệp cưới, được chào đón bởi hiệu ứng phong bì từ từ mở ra. Sau khi animation hoàn tất, trang hiện ra với ảnh cô dâu chú rể, tên hai người và ngày cưới. Khách cuộn xuống để đọc đầy đủ thông tin sự kiện: hai lễ Vu Quy và Tân Hôn với địa điểm, thời gian và nút chỉ đường.

**Why this priority**: Đây là trải nghiệm cốt lõi — mọi khách mời đều cần xem thông tin này. Nếu chỉ triển khai duy nhất story này, trang đã có thể dùng được như một thiệp cưới điện tử hoàn chỉnh.

**Independent Test**: Mở trang trên trình duyệt, xem animation mở thiệp, kiểm tra ảnh và tên hiện đúng, cuộn xuống kiểm tra thông tin 2 lễ và nút chỉ đường hoạt động.

**Acceptance Scenarios**:

1. **Given** khách mời mở đường link thiệp cưới lần đầu, **When** trang tải xong, **Then** hiệu ứng phong bì tự động bắt đầu mở và hoàn tất trong vòng 3 giây.
2. **Given** animation mở thiệp hoàn tất, **When** khách nhìn vào màn hình, **Then** ảnh nổi bật của cô dâu chú rể, tên hai người và ngày cưới hiển thị rõ ràng.
3. **Given** khách cuộn xuống phần thông tin sự kiện, **When** nhìn vào bố cục, **Then** thấy rõ 2 cột: Lễ Vu Quy (bên trái) và Lễ Tân Hôn (bên phải), mỗi bên có địa điểm, thời gian và nút "Chỉ đường".
4. **Given** khách nhấn nút "Chỉ đường" của bất kỳ lễ nào, **When** thao tác được xử lý, **Then** Google Maps mở ra (hoặc chuyển hướng) với địa chỉ tượng ứng đã điền sẵn.
5. **Given** khách xem trang trên điện thoại di động, **When** trang hiển thị, **Then** bố cục 2 cột tự động chuyển thành bố cục 1 cột dọc, không bị tràn ngang.

---

### User Story 2 — Khách mời xem album ảnh cưới (Priority: P2)

Khách mời cuộn đến phần album, thấy các ảnh cưới xếp dạng lưới (grid) hoặc slider hiện đại. Họ bấm vào một ảnh để xem phóng to toàn màn hình (lightbox), có thể vuốt/nhấn để chuyển ảnh.

**Why this priority**: Album ảnh là yếu tố cảm xúc quan trọng, giúp khách kết nối và chia sẻ niềm vui. Có thể triển khai và kiểm tra độc lập với các section khác.

**Independent Test**: Cuộn đến section Gallery, kiểm tra ảnh hiện đúng dạng grid/slider, bấm vào ảnh để xem lightbox, kiểm tra điều hướng giữa các ảnh và nút đóng.

**Acceptance Scenarios**:

1. **Given** khách cuộn đến phần Gallery, **When** trang hiển thị, **Then** các ảnh cưới xếp dạng grid với tối thiểu 6 ảnh, mỗi ảnh có tỉ lệ đồng đều và hiển thị rõ.
2. **Given** khách bấm vào một ảnh trong gallery, **When** thao tác được ghi nhận, **Then** lightbox mở ra hiển thị ảnh phóng to toàn màn hình với nút đóng và điều hướng trái/phải.
3. **Given** lightbox đang mở, **When** khách bấm nút đóng hoặc nhấn phím Escape, **Then** lightbox đóng lại và trang trở về trạng thái bình thường.
4. **Given** khách xem gallery trên điện thoại, **When** trang hiển thị, **Then** grid tự điều chỉnh số cột phù hợp (ví dụ: 2 cột trên mobile) và lightbox hỗ trợ thao tác vuốt (swipe).

---

### User Story 3 — Khách mời xác nhận tham dự (RSVP) (Priority: P3)

Khách mời tìm đến form RSVP, điền tên, chọn có/không tham dự và số lượng người đi kèm. Sau khi gửi, họ nhận được thông báo xác nhận thành công.

**Why this priority**: RSVP giúp gia đình cô dâu chú rể lên kế hoạch. Đây là tính năng interactive quan trọng nhưng không ảnh hưởng đến việc xem thông tin cơ bản.

**Independent Test**: Điền đầy đủ form RSVP, gửi đi, kiểm tra thông báo xác nhận hiện ra. Thử gửi form thiếu thông tin để kiểm tra validation.

**Acceptance Scenarios**:

1. **Given** khách cuộn đến phần RSVP, **When** trang hiển thị, **Then** form gọn gàng với 3 trường: tên khách mời (text), tham dự hay không (Yes/No toggle hoặc radio), số người đi cùng (số nguyên ≥ 0).
2. **Given** khách điền đầy đủ thông tin hợp lệ và bấm gửi, **When** form được xử lý, **Then** thông báo xác nhận thành công hiện ra trong vòng 3 giây.
3. **Given** khách bấm gửi mà chưa điền tên, **When** form được kiểm tra, **Then** thông báo lỗi validation hiển thị ngay tại trường bị thiếu, form không được gửi.
4. **Given** khách chọn "Không tham dự", **When** nhìn vào form, **Then** trường số người đi cùng bị ẩn hoặc vô hiệu hóa tự động.

---

### User Story 4 — Khách mời gửi và đọc lời chúc (Guestbook) (Priority: P4)

Khách mời gõ lời chúc mừng vào ô nhập liệu và gửi đi. Lời chúc hiện ra ngay trong danh sách bên dưới dạng bong bóng chat, cùng với tên và thời gian gửi. Khách có thể đọc tất cả lời chúc đã được gửi trước đó.

**Why this priority**: Guestbook tạo không khí vui vẻ và cộng đồng cho thiệp cưới. Là tính năng tương tác bổ trợ, được triển khai sau khi các tính năng thiết yếu hoàn thành.

**Independent Test**: Nhập lời chúc và tên, gửi đi, kiểm tra lời chúc xuất hiện trong danh sách với tên và thời gian đúng. Kiểm tra danh sách hiển thị những lời chúc đã gửi trước đó.

**Acceptance Scenarios**:

1. **Given** khách cuộn đến phần Guestbook, **When** trang hiển thị, **Then** thấy ô nhập tên, ô nhập lời chúc, nút gửi và danh sách các lời chúc đã có.
2. **Given** khách điền tên, nhập lời chúc và bấm gửi, **When** thao tác được xử lý, **Then** lời chúc xuất hiện ngay trong danh sách với tên người gửi và thời gian gửi, ô nhập được xóa sạch.
3. **Given** khách bấm gửi mà ô lời chúc trống, **When** form được kiểm tra, **Then** thông báo yêu cầu nhập lời chúc hiện ra, không gửi được.
4. **Given** nhiều lời chúc đã được gửi, **When** khách xem danh sách, **Then** lời chúc mới nhất hiển thị trên cùng (hoặc cuộn tự động xuống cuối), mỗi lời chúc có giao diện rõ ràng như bong bóng chat.
5. **Given** khách tải lại trang, **When** trang hiển thị phần Guestbook, **Then** các lời chúc đã gửi trước đó vẫn còn hiển thị (dữ liệu được lưu trữ).

---

### Edge Cases

- Khách truy cập trang khi mạng chậm: skeleton loader hoặc ảnh placeholder hiển thị trong khi ảnh tải.
- Tên khách mời hoặc lời chúc quá dài (>200 ký tự): nội dung bị cắt ngắn hoặc tự xuống dòng, không phá vỡ layout.
- Thiết bị không hỗ trợ CSS animation: trang hiển thị trực tiếp nội dung sau thiệp (bỏ qua animation), không bị kẹt màn hình trắng.
- Khách tắt JavaScript: toàn bộ nội dung tĩnh (Hero, thông tin sự kiện, gallery) hiển thị bình thường; RSVP và Guestbook hiển thị thông báo yêu cầu bật JavaScript.
- Số người đi cùng nhập giá trị âm hoặc ký tự chữ: validation từ chối và yêu cầu nhập số nguyên không âm.
- Guestbook bị spam (nhiều lời chúc liên tiếp từ một người): giới hạn tốc độ gửi ở phía client (ví dụ: tối thiểu 10 giây giữa 2 lần gửi).

## Requirements *(mandatory)*

### Functional Requirements

**Hero Section**
- **FR-001**: Trang PHẢI hiển thị hiệu ứng phong bì mở ra (envelope animation) tự động khi tải xong.
- **FR-002**: Sau khi animation hoàn tất, trang PHẢI hiển thị ảnh nổi bật của cô dâu và chú rể.
- **FR-003**: Tên cô dâu, tên chú rể và ngày cưới PHẢI hiển thị rõ ràng trên Hero section.
- **FR-004**: Animation PHẢI có static fallback khi thiết bị bật `prefers-reduced-motion`.

**Thông tin Sự kiện**
- **FR-005**: Trang PHẢI hiển thị thông tin Lễ Vu Quy gồm: địa điểm, ngày và giờ tổ chức.
- **FR-006**: Trang PHẢI hiển thị thông tin Lễ Tân Hôn gồm: địa điểm, ngày và giờ tổ chức.
- **FR-007**: Mỗi lễ PHẢI có nút "Chỉ đường" mở Google Maps với địa chỉ tương ứng đã điền sẵn.
- **FR-008**: Bố cục hai lễ PHẢI chia thành 2 cột trên desktop và chuyển thành 1 cột dọc trên mobile.
- **FR-009**: Trang CÓ THỂ hiển thị tên khách mời được cá nhân hóa thông qua URL parameter (ví dụ: `?guest=Nguyễn Văn A`).

**Gallery**
- **FR-010**: Trang PHẢI hiển thị ít nhất 6 ảnh cưới theo dạng grid hoặc slider.
- **FR-011**: Khách mời PHẢI có thể bấm vào ảnh để xem lightbox phóng to toàn màn hình.
- **FR-012**: Lightbox PHẢI có nút đóng, nút chuyển ảnh trái/phải và hỗ trợ phím Escape.
- **FR-013**: Ảnh trong gallery PHẢI được lazy load khi cuộn đến.

**RSVP**
- **FR-014**: Trang PHẢI có form RSVP với các trường: tên khách mời (bắt buộc), xác nhận tham dự (Yes/No, bắt buộc), số người đi kèm (không bắt buộc, mặc định 0).
- **FR-015**: Form PHẢI validate trước khi gửi và hiển thị lỗi rõ ràng tại từng trường nếu thiếu thông tin bắt buộc.
- **FR-016**: Sau khi gửi thành công, trang PHẢI hiển thị thông báo xác nhận.
- **FR-017**: Trường số người đi kèm PHẢI bị ẩn hoặc vô hiệu hóa khi khách chọn "Không tham dự".

**Guestbook**
- **FR-018**: Trang PHẢI có ô nhập tên người gửi và ô nhập lời chúc.
- **FR-019**: Sau khi gửi thành công, lời chúc PHẢI hiển thị ngay trong danh sách kèm tên và thời gian gửi.
- **FR-020**: Danh sách lời chúc PHẢI được lưu trữ và vẫn hiển thị khi tải lại trang.
- **FR-021**: Giao diện lời chúc PHẢI hiển thị theo dạng bong bóng chat hoặc thẻ (card) dễ đọc.

**Toàn trang**
- **FR-022**: Toàn bộ trang PHẢI hiển thị hoàn hảo (không tràn ngang, không vỡ layout) trên mobile (<768px), tablet (768px–1024px) và desktop (>1024px).
- **FR-023**: Tất cả dữ liệu nội dung (tên, ngày, địa điểm, ảnh) PHẢI được tập trung trong một file data/config duy nhất.

### Key Entities

- **WeddingConfig**: Toàn bộ thông tin đám cưới — tên cô dâu, tên chú rể, ngày cưới, ảnh nổi bật, URL ảnh cô dâu/chú rể.
- **CeremonyEvent**: Đại diện cho một lễ (Vu Quy hoặc Tân Hôn) — tên lễ, địa điểm, giờ tổ chức, URL Google Maps.
- **GalleryImage**: Một ảnh trong album — URL ảnh gốc, URL thumbnail, alt text mô tả.
- **RSVPSubmission**: Phản hồi xác nhận tham dự của một khách — tên khách, trạng thái tham dự (Yes/No), số người đi kèm, thời gian gửi.
- **GuestMessage**: Một lời chúc — tên người gửi, nội dung lời chúc, thời gian gửi.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Khách mời có thể xem đầy đủ thông tin hôn lễ (tên, ngày, địa điểm 2 lễ) trong vòng 10 giây kể từ khi mở đường link.
- **SC-002**: Trang tải xong và hiển thị First Contentful Paint trong dưới 2 giây trên kết nối 4G mobile.
- **SC-003**: Tổng dung lượng trang (không tính gallery lazy load) dưới 3MB.
- **SC-004**: 100% tính năng tương tác (RSVP, Guestbook, lightbox, chỉ đường) hoạt động bình thường trên iOS Safari và Android Chrome.
- **SC-005**: Khách mời hoàn tất việc điền và gửi form RSVP trong dưới 60 giây.
- **SC-006**: Lời chúc guestbook xuất hiện trong danh sách trong vòng 2 giây sau khi gửi.
- **SC-007**: Trang hiển thị đúng bố cục và không có lỗi ngang trên tất cả màn hình từ 320px đến 2560px chiều rộng.
- **SC-008**: Thay đổi tên, ngày cưới hoặc địa điểm chỉ cần sửa 1 file data/config, không cần sửa bất kỳ file giao diện nào.

## Assumptions

- Ảnh cưới thực tế sẽ được cung cấp và tối ưu trước khi triển khai; trong quá trình phát triển dùng ảnh placeholder cùng tỉ lệ.
- Ngày, tên và địa điểm cụ thể sẽ được điền vào file data/config — spec này dùng giá trị mẫu.
- Dữ liệu RSVP và Guestbook được lưu trữ qua dịch vụ bên thứ ba (ví dụ: Firebase Firestore hoặc dịch vụ form tương đương); không yêu cầu backend riêng.
- Thiệp cưới không yêu cầu tính năng đăng nhập hay xác thực khách mời (trang công khai).
- Tính năng cá nhân hóa tên khách mời (FR-009) là phần bổ sung — nếu không có URL parameter, phần chào tên khách được ẩn.
- Phong cách thiết kế: màu sắc chủ đạo là tông màu pastel ấm (hồng nhạt, kem, vàng champagne), font chữ serif lãng mạn cho tiêu đề và sans-serif cho nội dung.
