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
