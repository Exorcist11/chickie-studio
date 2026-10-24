# Mô tả dự án Chickie Studio

## 1. Giới thiệu
Chickie Studio (trên mạng xã hội: ChickieStudio - Cho Thuê Váy Thiết Kế & Áo Dài) là cửa hàng dịch vụ tại Hà Nội, chuyên cho thuê:
- Váy thiết kế (váy lụa, váy kiểu)
- Áo dài (cách tân và truyền thống)
- Combo máy ảnh

Phục vụ nhu cầu chụp ảnh kỷ yếu, chụp ngoại cảnh, hẹn hò và các dịp lễ.

## 2. Bối cảnh và vấn đề
Cửa hàng hiện nhận khách chủ yếu qua mạng xã hội. Việc quản lý lịch thuê, tồn kho, tiền cọc làm thủ công nên dễ trùng lịch, mất thời gian nhắn tin qua lại và khó theo dõi doanh thu.

## 3. Mục tiêu
- Website giúp khách xem mẫu, kiểm tra lịch trống và gửi yêu cầu đặt thuê nhanh, tối ưu cho điện thoại.
- CRM giúp chủ shop và nhân viên quản lý sản phẩm, đơn thuê, khách hàng, tiền cọc, doanh thu trên một hệ thống.
- Giảm trùng lịch, giảm công việc thủ công, tăng khả năng được tìm thấy trên Google (SEO).

## 4. Đối tượng người dùng
| Nhóm | Đặc điểm |
|---|---|
| Khách hàng | Học sinh, sinh viên, người trẻ; dùng điện thoại là chính; ưu tiên hình ảnh đẹp, thao tác ít bước; không bắt buộc đăng ký tài khoản |
| Admin (chủ shop) | Toàn quyền, xem báo cáo, cấu hình hệ thống |
| Nhân viên | Quản lý đơn, giao nhận, cập nhật tình trạng đồ |

## 5. Kiến trúc và công nghệ
| Thành phần | Công nghệ |
|---|---|
| client (website khách) | Next.js, TypeScript, Tailwind CSS, SSR/SSG cho SEO |
| crm (quản trị) | ReactJS (Vite), TypeScript, Ant Design |
| server (API) | Java 21, Spring Boot 3, Spring Security + JWT, Spring Data JPA |
| Database | MySQL 8, Flyway migration |
| Hạ tầng | Docker Compose |

REST API chia hai nhóm: `/api/public/**` (client, không cần đăng nhập) và `/api/admin/**` (CRM, cần JWT).

## 6. Phạm vi chức năng (định hướng, làm ở các giai đoạn sau)
**Website khách:** trang chủ, danh sách sản phẩm có bộ lọc (loại, dịp, màu, size, giá), chi tiết sản phẩm kèm lịch trống, combo, đặt thuê, tra cứu đơn, chính sách, FAQ, blog, liên hệ nhanh (Zalo, Facebook, hotline).

**CRM:** đăng nhập và phân quyền, dashboard, quản lý danh mục/sản phẩm/combo, quản lý từng món đồ thực tế (sẵn sàng, đang thuê, giặt ủi, sửa chữa, ngừng cho thuê), quản lý đơn thuê, lịch thuê dạng calendar, quản lý khách hàng, thanh toán và cọc, báo cáo, cấu hình.

**Nghiệp vụ cốt lõi:**
- Một món đồ không được nhận hai đơn chồng thời gian, có cộng số ngày đệm giặt ủi cấu hình được.
- Trạng thái đơn: `PENDING → CONFIRMED → DEPOSITED → DELIVERED → RETURNED → COMPLETED`, ngoài ra `CANCELLED`, `OVERDUE`.

## 7. Yêu cầu phi chức năng
Responsive mobile-first, tải trang nhanh, bảo mật (JWT, BCrypt, CORS, validation), dễ mở rộng (thanh toán online, thông báo Zalo/SMS, voucher).

## 8. Lộ trình
1. Khởi tạo tài liệu, cấu trúc, môi trường (giai đoạn hiện tại)
2. Auth và quản lý sản phẩm
3. Catalog phía client
4. Đặt thuê, chống trùng lịch, quản lý đơn
5. Thanh toán/cọc, báo cáo, dashboard
6. SEO, tối ưu, triển khai
