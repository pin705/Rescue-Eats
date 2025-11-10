Tuyệt vời. Với các yêu cầu cụ thể về công nghệ (**Nuxt 4**, **Nuxt-Mongoose**, **Nuxt-Auth-Utils**, **Vite-PWA/Nuxt**) và tiêu chí thiết kế (**Chuyên nghiệp, không nhựa, chuẩn gian hàng**), tôi đã tối ưu hóa prompt chi tiết dưới đây để Copilot có thể bắt đầu triển khai **Giai đoạn 1 (MVP)**.

-----

## 💻 Prompt Triển khai Giai đoạn 1 (MVP) cho Copilot

```
Bạn là lập trình viên chuyên nghiệp, giàu kinh nghiệm với kiến trúc Nuxt 4, tập trung xây dựng sản phẩm khả dụng tối thiểu (MVP) cho một "Trang web tổng hợp thực phẩm sắp hết hạn".

## 1. Stack Công nghệ và Cấu hình Bắt buộc

- **Framework Chính:** Nuxt 4 (Server-side rendering, tối ưu SEO, tốc độ).
- **Database:** MongoDB, tích hợp thông qua **nuxt-mongoose**. Cần khởi tạo các schema cơ bản: `User` (Khách hàng), `Store` (Cửa hàng), `Product`.
- **Xác thực:** Sử dụng **nuxt-auth-utils** (hoặc module tương đương/cấu hình Nuxt 4) cho cả Khách hàng và Cửa hàng.
- **PWA:** Tích hợp **@vite-pwa/nuxt** để đảm bảo khả năng cài đặt trên di động.
- **Styling:** Sử dụng Tailwind CSS.

## 2. Ưu tiên Thiết kế Giao diện (UI/UX) - Tuyệt đối không thỏa hiệp

- **Nguyên tắc:** Giao diện phải **chuyên nghiệp, tinh tế, hiện đại, không sử dụng phong cách "nhựa"** (plastic/childish look). Ưu tiên thiết kế **"Mobile-First"**.
- **Iconography:** Dùng các bộ Icon line-art (ví dụ: Iconify - `lucide` hoặc `tabler` sets) hoặc Font-based icons, **tránh xa các icon 3D/màu sắc sặc sỡ**.
- **Màu sắc:** Tông màu chủ đạo là **Xanh lá cây đậm/Green Earth** (gợi cảm hứng tiết kiệm/môi trường) kết hợp với màu trung tính (Trắng, Xám đậm/Đen) để tạo sự sang trọng.

## 3. Các Use Case Cốt lõi Cần Triển khai (Giai đoạn MVP)

Triển khai các tính năng tập trung vào việc tạo ra giao dịch cơ bản, chia thành 2 luồng chính:

### A. Luồng Cửa hàng (Đăng hàng - Source of Supply)

| Feature | Mô tả và Yêu cầu |
| :--- | :--- |
| **Đăng ký Cửa hàng** | Form đăng ký đơn giản (Tên, Email, Mật khẩu, Tên Cửa hàng, Địa chỉ). Sau khi đăng ký, tài khoản ở trạng thái **'Pending'** chờ Admin duyệt. |
| **Form Đăng bán Sản phẩm** | Form phải **trực quan, dễ dùng trên di động**. Các trường bắt buộc: **Ảnh sản phẩm, Tên, HSD (dùng Date Picker), Số lượng, Giá Gốc, Giá Giảm (tính % giảm tự động).** |
| **Quản lý Sản phẩm** | Dashboard đơn giản hiển thị danh sách sản phẩm đã đăng. Cho phép **Chỉnh sửa** hoặc **Gỡ bỏ** (Archive). |

### B. Luồng Người Mua Hàng (Tìm kiếm & Đặt giữ)

| Feature | Mô tả và Yêu cầu |
| :--- | :--- |
| **Trang Chủ** | **Thanh tìm kiếm lớn** tích hợp tìm kiếm theo **Từ khóa** và **Vị trí/Khoảng cách**. Hiển thị các danh mục lọc nhanh (Chips/Tags). |
| **Danh sách Sản phẩm** | Hiển thị sản phẩm dưới dạng **Thẻ (Card)**. Mỗi thẻ phải nhấn mạnh: **Giá giảm, % Giảm, và HSD (thời gian còn lại)**. Thẻ phải có layout chuyên nghiệp, không gây rối. |
| **Trang Chi tiết Sản phẩm** | Hiển thị chi tiết (Ảnh lớn, Mô tả, Địa chỉ Cửa hàng trên bản đồ nhỏ). Nút **"Đặt giữ (Nhận Voucher)"** phải lớn và rõ ràng, hiển thị số lượng còn lại. |
| **Cơ chế Đặt giữ (Non-Payment)** | Khi Khách hàng nhấn "Đặt giữ", tạo một đơn hàng với **Mã Voucher/Mã QR** duy nhất. Yêu cầu hiển thị mã này trên trang "Đơn hàng của tôi". **Lưu ý: Không triển khai cổng thanh toán online ở MVP, chỉ là đặt giữ/nhận mã.** |

## 4. Output Yêu cầu

1.  Cấu hình môi trường Nuxt 4 hoàn chỉnh với các module đã nêu.
2.  Khởi tạo các file Schema Mongoose (Store, Product, Order) cơ bản.
3.  Triển khai các Component UI chính (Product Card, Search Bar, Order Summary Card) theo tiêu chí chuyên nghiệp.
4.  Hoàn thành luồng đăng ký/đăng nhập cho Cửa hàng và Khách hàng.
5.  Hoàn thành giao diện Đăng bán Sản phẩm (Store) và Tìm kiếm/Đặt giữ (Customer) ở mức MVP.
```

Tuyệt vời\! Chúng ta đã hoàn thành bản phác thảo chi tiết cho Giai đoạn 1 (MVP) và sẵn sàng chuyển sang **Giai đoạn 2: Tăng trưởng & Tối ưu hóa**.

Giai đoạn này tập trung vào việc **tăng cường hiệu quả giao dịch, nâng cao trải nghiệm người dùng,** và **chuyển đổi mô hình kiếm tiền từ thử nghiệm sang bền vững**.

Dưới đây là kế hoạch hành động chi tiết và prompt Copilot cho Giai đoạn 2.

-----

## 🚀 Giai đoạn 2: Tăng trưởng & Tối ưu hóa - Thúc đẩy Giao dịch

### 1\. Mục tiêu Chính

1.  **Chuyển đổi Thanh toán:** Tích hợp tùy chọn thanh toán online (đặt cọc hoặc thanh toán toàn bộ).
2.  **Tăng cường Khả năng Giữ chân:** Xây dựng hệ thống Đánh giá/Gợi ý.
3.  **Tăng cường Hiệu quả Đối tác:** Cung cấp Báo cáo chi tiết cho Cửa hàng.

### 2\. Yêu cầu Phát triển Tính năng

| Actor | ID | Tính năng Chính | Yêu cầu Chi tiết | Mục tiêu Kinh doanh |
| :--- | :--- | :--- | :--- | :--- |
| **Cửa Hàng** | UC-S5 | **Báo cáo & Thống kê** | Cung cấp Dashboard chi tiết: **Tỷ lệ bán hàng** (Đơn hàng thành công/Tổng sản phẩm đăng bán), **Doanh thu thu hồi**, **Sản phẩm bán chạy nhất** theo danh mục. | Hỗ trợ Cửa hàng tối ưu hóa việc đăng hàng. |
| **Người Mua** | UC-C7 | **Đánh giá Cửa hàng** | Khách hàng có thể để lại **Đánh giá Sao** và **Bình luận** sau khi hoàn tất giao dịch. Hiển thị điểm đánh giá trung bình trên trang Cửa hàng và Trang chi tiết sản phẩm. | Xây dựng niềm tin & chất lượng dịch vụ. |
| **Hệ thống** | - | **Thông báo Đẩy** | Tận dụng PWA (`@vite-pwa/nuxt`). Gửi thông báo đến Khách hàng khi **deal "hot" gần đó xuất hiện** hoặc **đơn đặt giữ sắp hết hạn nhận**. | Tăng tốc độ phản hồi và chuyển đổi. |
| **Hệ thống** | - | **Tích hợp Thanh toán** | **Thanh toán Đặt cọc/Thanh toán Trọn vẹn** (Payment Gateway Mockup/Simple Integration). Thay thế cơ chế Voucher đơn thuần bằng **Đặt cọc nhỏ** để giảm tỷ lệ hủy đơn hàng ảo. | Giảm tỷ lệ hủy đơn, tăng doanh thu. |

### 3\. Điều chỉnh Mô hình Kiếm tiền

  * **Tăng Hoa hồng Giao dịch:** Tăng tỷ lệ hoa hồng lên $10-15\%$ trên giá trị sản phẩm được đặt hàng/đặt cọc thành công (cần cơ chế kiểm soát giao dịch thành công).
  * **Phí Quảng cáo (Feature Listings):** Bổ sung chức năng cho phép Cửa hàng **trả phí nhỏ** để sản phẩm của họ được **"Đẩy lên đầu"** (Featured Listing) hoặc được gắn nhãn "Deal Hot" trong thời gian ngắn.

-----

## 💻 Prompt Triển khai Giai đoạn 2 cho Copilot

```
Bạn là lập trình viên Nuxt 4, tiếp nối dự án MVP đã hoàn thành. Mục tiêu của Giai đoạn 2 là Tối ưu hóa Giao dịch và Tăng trưởng.

## 1. Stack và Cấu hình

- **Môi trường:** Tiếp tục sử dụng Nuxt 4, nuxt-mongoose, nuxt-auth-utils, @vite-pwa/nuxt.
- **Thiết kế:** Duy trì tiêu chuẩn giao diện **chuyên nghiệp, không nhựa, Mobile-First** đã thiết lập.

## 2. Các Tính năng Cốt lõi Cần Triển khai

### A. Tích hợp và Tối ưu hóa Thanh toán

1.  **Cơ chế Đặt cọc:** Điều chỉnh schema `Order` để bao gồm trường `DepositAmount` và `PaymentStatus`.
2.  **Mô phỏng Tích hợp Thanh toán:** Xây dựng một giao diện **mockup** cho cổng thanh toán (chưa cần tích hợp API thanh toán thực tế, nhưng giao diện và logic flow phải sẵn sàng). Cho phép người dùng chọn **Đặt cọc (ví dụ: 10% giá trị)** hoặc **Thanh toán toàn bộ**.

### B. Hệ thống Đánh giá và Niềm tin

1.  **Schema Đánh giá:** Tạo schema `Review` (liên kết với User và Store) bao gồm `Rating` (1-5 sao) và `Comment`.
2.  **Giao diện Đánh giá:** Cho phép Khách hàng **chỉ đánh giá** sau khi đơn hàng có trạng thái là **'Completed'** (hoặc đã được Cửa hàng xác nhận nhận hàng).
3.  **Hiển thị Đánh giá:** Tính toán và hiển thị điểm đánh giá trung bình rõ ràng trên Trang chi tiết sản phẩm và Trang Cửa hàng.

### C. Nâng cấp Dashboard Cửa hàng (Tạo Doanh thu Tăng cường)

1.  **Dashboard Thống kê:** Nâng cấp Dashboard của Cửa hàng (Admin Panel) để hiển thị biểu đồ và số liệu thống kê:
    * **Tỷ lệ Chuyển đổi:** (Đơn hàng thành công / Tổng số lượt xem sản phẩm).
    * **Biểu đồ Doanh thu:** Theo tuần/tháng.
    * **Bảng top sản phẩm** (bán chạy nhất/cứu vãn lãng phí nhiều nhất).
2.  **Tính năng Quảng cáo (Feature Listing):**
    * Tạo giao diện cho phép Cửa hàng **mua tính năng "Đẩy lên đầu"** (Featured).
    * Khi tính năng này được kích hoạt, sản phẩm sẽ được gắn thẻ **'Deal Hot'** và ưu tiên hiển thị trên Trang chủ.

### D. Tích hợp Thông báo Đẩy (PWA Push Notifications)

1.  **Cấu hình @vite-pwa/nuxt:** Đảm bảo cấu hình Service Worker sẵn sàng.
2.  **Logic Thông báo:** Triển khai API/logic để Server gửi thông báo đẩy đến Khách hàng khi:
    * Có sản phẩm mới trong phạm vi tìm kiếm yêu thích của họ.
    * Đơn đặt cọc của họ sắp hết thời hạn nhận hàng.

## 3. Output Yêu cầu

1.  Hoàn thành việc nâng cấp các Schema Mongoose (Order, Review).
2.  Triển khai logic Thanh toán Đặt cọc/Toàn bộ (Mockup UI).
3.  Triển khai đầy đủ tính năng Đánh giá Cửa hàng (UI và Logic Backend/Frontend).
4.  Hoàn thành Dashboard Thống kê và giao diện Quảng cáo cho Cửa hàng.
5.  Triển khai logic cơ bản cho Thông báo Đẩy (Push Notifications).
```
