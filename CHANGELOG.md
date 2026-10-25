# Changelog - Chickie Studio

Mọi thay đổi đáng chú ý của dự án **Chickie Studio** sẽ được ghi chép lại tại file này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/), và tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

---

## [Unreleased]

### Added
- **Full Spec Suite Completion (50/50 Features)**:
  - Hoàn tất 100% hồ sơ đặc tả chi tiết (📝 SPEC) cho toàn bộ 50 tính năng của dự án Chickie Studio:
    - [docs/features/catalog/CAT-007-goi-y-phu-kien-di-kem.md](docs/features/catalog/CAT-007-goi-y-phu-kien-di-kem.md): Gợi ý phụ kiện phối kèm thông minh (Cross-selling), Flyway V19.
    - [docs/features/booking/BOK-008-don-thue-nhom-ky-yeu-so-luong-lon.md](docs/features/booking/BOK-008-don-thue-nhom-ky-yeu-so-luong-lon.md): Hỗ trợ đơn thuê nhóm kỷ yếu số lượng lớn qua Excel, chiết khấu bậc thang, Flyway V20.
    - [docs/features/booking/BOK-009-bien-ban-ban-giao-do-chup-anh.md](docs/features/booking/BOK-009-bien-ban-ban-giao-do-chup-anh.md): Biên bản bàn giao đồ có chụp ảnh hiện trạng và ký nhận điện tử, Flyway V21.
    - [docs/features/booking/BOK-010-dat-lich-thu-do-showroom.md](docs/features/booking/BOK-010-dat-lich-thu-do-showroom.md): Đặt lịch hẹn thử đồ trực tiếp tại showroom, khung giờ 45 phút, Flyway V22.
    - [docs/features/customer/CUS-003-quan-ly-ma-giam-gia-voucher.md](docs/features/customer/CUS-003-quan-ly-ma-giam-gia-voucher.md): Quản lý mã giảm giá / voucher khuyến mãi (% hoặc số tiền), Flyway V23.
    - [docs/features/customer/CUS-004-chinh-sach-uu-dai-hoc-sinh-sinh-vien.md](docs/features/customer/CUS-004-chinh-sach-uu-dai-hoc-sinh-sinh-vien.md): Chính sách ưu đãi giảm 10% và cọc linh hoạt cho Học sinh - Sinh viên, Flyway V24.
    - [docs/features/dashboard-report/RPT-003-thong-ke-san-pham-su-dung-kho.md](docs/features/dashboard-report/RPT-003-thong-ke-san-pham-su-dung-kho.md): Thống kê sản phẩm thuê nhiều (Top Rented) và tỷ lệ khai thác kho đồ.
    - [docs/features/content-seo/CNT-003-seo-metadata-sitemap-structured-data.md](docs/features/content-seo/CNT-003-seo-metadata-sitemap-structured-data.md): Cấu hình SEO Metadata, OpenGraph, dynamic `sitemap.xml` và schema JSON-LD.
    - [docs/features/content-seo/CNT-004-blog-chia-se-kinh-nghiem.md](docs/features/content-seo/CNT-004-blog-chia-se-kinh-nghiem.md): Blog cẩm nang chụp ảnh, gắn tag sản phẩm thuê trực tiếp trong bài, Flyway V25.
    - [docs/features/content-seo/CNT-005-lookbook-bo-suu-tap-theo-mua.md](docs/features/content-seo/CNT-005-lookbook-bo-suu-tap-theo-mua.md): Lookbook bộ sưu tập ảnh theo mùa kèm điểm ghim tương tác (Shoppable Hotspots), Flyway V26.
    - [docs/features/content-seo/CNT-006-thu-thap-hien-thi-danh-gia-khach.md](docs/features/content-seo/CNT-006-thu-thap-hien-thi-danh-gia-khach.md): Thu thập và kiểm duyệt đánh giá feedback kèm ảnh khách mặc thực tế, Flyway V27.
    - [docs/features/system-setting/SET-002-cau-hinh-banner-thong-diep-trang-chu.md](docs/features/system-setting/SET-002-cau-hinh-banner-thong-diep-trang-chu.md): Cấu hình banner trượt và thông điệp trang chủ Client, Flyway V28.
    - [docs/features/system-setting/SET-003-thong-bao-nhac-lich-zalo-sms.md](docs/features/system-setting/SET-003-thong-bao-nhac-lich-zalo-sms.md): Tự động gửi tin nhắn thông báo nhắc lịch giao/trả qua Zalo ZNS và SMS Brandname, Flyway V29.
- **Core Operations P1 Specs (SET-001, CAT-004, CUS-002)**:
  - Hoàn tất 100% hồ sơ đặc tả kỹ thuật cho toàn bộ các tính năng vận hành cốt lõi P1 của dự án:
    - [docs/features/system-setting/SET-001-cau-hinh-thong-tin-shop-tham-so.md](docs/features/system-setting/SET-001-cau-hinh-thong-tin-shop-tham-so.md): Cấu hình thông tin cửa hàng, hotline, địa chỉ, giờ mở cửa, số ngày đệm giặt ủi `bufferDays`, tỷ lệ cọc % và thời gian giữ chỗ tạm thời, Flyway migration V16.
    - [docs/features/catalog/CAT-004-quan-ly-goi-combo.md](docs/features/catalog/CAT-004-quan-ly-goi-combo.md): Quản lý gói combo trọn gói (Váy + Máy ảnh + Phụ kiện) với mức giá ưu đãi, kiểm tra khóa lịch an toàn đồng thời đa sản phẩm, Flyway migration V17.
    - [docs/features/customer/CUS-002-ghi-chu-noi-bo-danh-sach-den.md](docs/features/customer/CUS-002-ghi-chu-noi-bo-danh-sach-den.md): Ghi chú nội bộ khách hàng và quản lý danh sách đen (Blacklist) phòng chống bùng cọc/phá đồ, chặn tạo đơn online tự động cho khách rủi ro cao, Flyway migration V18.
- **Laundry & Garment Care Specs (Module CAT)**:
  - Soạn thảo đặc tả chi tiết [docs/features/catalog/CAT-008-hang-doi-giat-ui-sua-chua.md](docs/features/catalog/CAT-008-hang-doi-giat-ui-sua-chua.md): Hàng đợi quản lý giặt ủi, là hấp và sửa chữa trang phục sau khi khách trả đồ, quản lý gửi xưởng ngoài, cảnh báo xung đột lịch thuê kế tiếp trong vòng 48h và thủ tục nghiệm thu chất lượng đưa đồ về trạng thái `AVAILABLE`.
- **User & Staff Management Specs (Module AUTH)**:
  - Soạn thảo đặc tả chi tiết [docs/features/auth/AUTH-004-quan-ly-tai-khoan-nhan-vien.md](docs/features/auth/AUTH-004-quan-ly-tai-khoan-nhan-vien.md): Quản lý danh sách tài khoản nhân viên CRM (Tạo mới, Cập nhật, Khóa/Mở khóa, Đặt lại mật khẩu), cơ chế ngắt tức thì phiên Refresh Token khi khóa tài khoản và bảo vệ tài khoản Root Admin.
- **Dashboard & Financial Report Specs (Module RPT)**:
  - Soạn thảo đặc tả chi tiết [docs/features/dashboard-report/RPT-001-dashboard-canh-bao-van-hanh.md](docs/features/dashboard-report/RPT-001-dashboard-canh-bao-van-hanh.md): Màn hình điều hành trung tâm (Command Center), 4 thẻ KPI đầu ngày (giao/nhận/quá hạn/chờ cọc) và 4 hàng đợi xử lý nhanh 1 chạm kèm auto-refresh 60 giây.
  - Soạn thảo đặc tả chi tiết [docs/features/dashboard-report/RPT-002-bao-cao-doanh-thu-dong-tien.md](docs/features/dashboard-report/RPT-002-bao-cao-doanh-thu-dong-tien.md): Báo cáo tài chính phân định rạch ròi 3 dòng tiền: Doanh thu thuần, Dòng tiền ký quỹ cọc lưu động và Phân tích Tiền mặt vs Chuyển khoản, tích hợp biểu đồ trực quan và xuất file Excel `.xlsx`.
- **Payment & Deposit Specs (Module PAY)**:
  - Hoàn thành trọn bộ 5 hồ sơ đặc tả chi tiết cho Module Thanh Toán & Cọc:
    - [docs/features/payment/PAY-001-ghi-nhan-coc-thanh-toan-crm.md](docs/features/payment/PAY-001-ghi-nhan-coc-thanh-toan-crm.md): Ghi nhận thu cọc, thu tiền thuê bằng Tiền mặt / Chuyển khoản trên CRM, bất biến kế toán & phân quyền Void.
    - [docs/features/payment/PAY-002-quy-trinh-hoan-tra-tien-coc.md](docs/features/payment/PAY-002-quy-trinh-hoan-tra-tien-coc.md): Quy trình kiểm tra đồ & hoàn trả tiền cọc cho khách, tự động khấu trừ phụ phí và hoàn tất đơn sang `COMPLETED`.
    - [docs/features/payment/PAY-003-thu-phu-phi-tre-han-hu-hong.md](docs/features/payment/PAY-003-thu-phu-phi-tre-han-hu-hong.md): Biểu phí đền bù chuẩn hóa, tính phạt trễ hạn tự động và đính kèm ảnh bằng chứng hiện trạng hư hỏng.
    - [docs/features/payment/PAY-004-sinh-ma-vietqr-dong.md](docs/features/payment/PAY-004-sinh-ma-vietqr-dong.md): Sinh mã VietQR động Napas 247 theo đơn hàng, tự động điền số tiền và nội dung chuyển khoản 1 chạm.
    - [docs/features/payment/PAY-005-tich-hop-cong-thanh-toan-online.md](docs/features/payment/PAY-005-tich-hop-cong-thanh-toan-online.md): Tích hợp cổng thanh toán trực tuyến VNPay / MoMo, xác thực chữ ký HMAC-SHA512 qua IPN Webhook tự động.
    - [docs/features/payment/README.md](docs/features/payment/README.md): Lập bản đồ kiến trúc luồng tiền và vòng đời thanh toán của tiệm.
- **Schedule Coordination & Dispatch Specs (Module BOK)**:
  - Soạn thảo đặc tả chi tiết [docs/features/booking/BOK-006-lich-thue-dieu-phoi-calendar-crm.md](docs/features/booking/BOK-006-lich-thue-dieu-phoi-calendar-crm.md): Màn hình Calendar / Timeline Gantt điều phối món đồ vật lý, nghiệp vụ Reassign Item & Reschedule an toàn với khóa bi quan, API `/api/admin/dispatch/*`.
  - Soạn thảo đặc tả chi tiết [docs/features/booking/BOK-007-tu-dong-nha-slot-qua-han-coc.md](docs/features/booking/BOK-007-tu-dong-nha-slot-qua-han-coc.md): Cơ chế giữ chỗ tạm thời và tự động hủy đơn quá hạn cọc qua Background Scheduler, đồng hồ đếm ngược trên Client, Flyway V12 `hold_expires_at`.
- **UI Architecture (Client & CRM)**:
  - Tích hợp toàn bộ bộ UI Component (Button, TextField, PasswordField, SearchField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton) và các primitives shadcn/ui trực tiếp vào `client/src/components/ui/` và `crm/src/components/ui/`.
  - Cấu hình path aliases `@chickie/ui` và `@chickie/ui/*` trỏ về `./src/components/ui` trong từng ứng dụng.
  - Bộ kiểm thử tự động toàn diện với vitest và vitest-axe: 134 tests (Client), 133 tests (CRM) đều pass với 0 lỗi accessibility và 0 inline CSS (`style={{ ... }}` = 0).
  - Tỷ lệ bao phủ kiểm thử: Client 97.44% lines, CRM 96.58% lines (vượt ngưỡng yêu cầu 80%).

### Removed
- Xóa hoàn toàn thư mục `packages/ui` và các file `package.json`, `package-lock.json`, `node_modules` ở thư mục gốc (monorepo root), giữ cấu trúc dự án sạch gọn chỉ gồm `client`, `crm`, `server`.

### Added
- **Docs & Architecture**:
  - Khởi tạo hệ thống tài liệu theo dõi tính năng [docs/FEATURES.md](docs/FEATURES.md) với 44 tính năng tổng thể (8 modules: AUTH, CAT, BOK, PAY, CUS, RPT, CNT, SET).
  - Hoàn thiện 100% hồ sơ đặc tả chi tiết (📝 SPEC) cho toàn bộ 17 tính năng cốt lõi P0 (MVP).
  - Khởi tạo mẫu đặc tả tính năng chuẩn [docs/features/_TEMPLATE.md](docs/features/_TEMPLATE.md).
  - Thiết lập thư mục quyết định kiến trúc [docs/adr/](docs/adr/) và tài liệu ADR đầu tiên `0001-chon-kien-truc-monorepo.md`.
  - Khởi tạo hệ thống quy tắc phát triển AI Agent (`.agent/`) cho cả 4 phân vùng: `client`, `crm`, `server`, `docs`.

---

## [0.1.0] - 2026-10-24

### Added
- Khởi tạo cấu trúc dự án Monorepo Chickie Studio gồm Client (Next.js), CRM (React Vite) và Server (Spring Boot 3 + MySQL).
- Tài liệu mô tả dự án [docs/PROJECT_DESCRIPTION.md](docs/PROJECT_DESCRIPTION.md) và cấu trúc dự án [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).
