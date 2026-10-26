# Changelog - Chickie Studio

Mọi thay đổi đáng chú ý của dự án **Chickie Studio** sẽ được ghi chép lại tại file này.
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/), và tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

---

## [Unreleased]

### Added
- **Hoàn Tất Tích Hợp Email Đặt Thuê Trực Tuyến & Thông Báo Tự Động (BOK-001 - ✅ DONE)**:
  - Bổ sung trường nhập liệu `email` chuẩn UI/UX Pro Max trên [`BookingForm.tsx`](file:///D:/chickie-studio/client/src/components/features/products/BookingForm/BookingForm.tsx) với icon `Mail`, nhãn rõ ràng, chú thích tự động gửi vé điện tử và mã VietQR.
  - Cập nhật schema xác thực Zod [`booking.schema.ts`](file:///D:/chickie-studio/client/src/components/features/products/BookingForm/booking.schema.ts): kiểm tra bắt buộc và định dạng email RFC chuẩn, có inline error message tiếng Việt/tiếng Anh.
  - Đồng bộ kiểu dữ liệu `customerEmail` trên các interface [`CreateBookingRequest`](file:///D:/chickie-studio/client/src/types/booking.ts), [`BookingResponse`](file:///D:/chickie-studio/client/src/types/booking.ts) và API client [`createBooking`](file:///D:/chickie-studio/client/src/lib/api/booking.ts).
  - Tích hợp thông báo email nhận vé trên [`BookingSuccessModal.tsx`](file:///D:/chickie-studio/client/src/components/features/products/BookingSuccessModal/BookingSuccessModal.tsx) và trang hóa đơn chi tiết `/booking/success/[code]`.
  - Khai báo đầy đủ các khóa bản dịch đa ngôn ngữ `email`, `emailPlaceholder`, `emailHelp`, `emailRequired`, `emailInvalid` đồng bộ 100% trong `vi.json` và `en.json`.
  - Kiểm thử tự động: 449/449 unit tests pass 100%, 25/25 kịch bản Playwright E2E pass 100%, coverage line > 92% (vượt ngưỡng 80%), 0 inline CSS.
- **Hệ Thống Thông Báo Qua Email: Xác Nhận Đặt Lịch, Cọc & Nhắc Lịch Thuê (SET-003 - Backend ✅ DONE)**:
  - Triển khai hạ tầng gửi email HTML tự động qua Spring Boot `JavaMailSender` và Thymeleaf template engine với thread pool bất đồng bộ `@EnableAsync` (`mailTaskExecutor`).
  - Thiết kế 7 bộ mẫu HTML email chuẩn thương hiệu Chickie Studio tông màu Burgundy (`#641D2B`), Gold và Ivory: `booking-confirmation.html` (kèm mã VietQR động & link tra cứu), `deposit-received.html`, `pickup-reminder.html`, `return-reminder.html`, `return-completed.html`, `booking-expired.html`, `fitting-confirmation.html`.
  - Migration Flyway `V12__create_notification_logs_and_add_booking_email.sql`: bổ sung cột `customer_email` vào bảng `bookings` và tạo bảng lưu nhật ký `notification_logs` với đầy đủ indexes.
  - Tự động kích hoạt gửi email xác nhận ngay khi tạo đơn mới (`BookingService.createBooking`) và gửi email cập nhật trạng thái khi xác nhận cọc/nhận đồ/trả đồ (`BookingService.updateBookingStatus`).
  - Cung cấp API quản trị CRM tra cứu lịch sử gửi (`GET /api/admin/bookings/{id}/notifications`) và gửi lại email (`POST /api/admin/bookings/{id}/resend-email`) phân quyền `ADMIN, STAFF`.
  - Bộ kiểm thử tự động toàn diện: 239/239 tests pass (0 failures), JaCoCo line coverage > 90% và branch coverage $\ge 80\%$ (`mvn verify` PASS 100%).

- **Định Tuyến Chuyên Biệt Theo Ngành Nghề Kinh Doanh & Kích Hoạt Menu Tự Động (Phương Án A)**:
  - Khai báo các semantic routes chuyên biệt trực tiếp cho 4 trụ cột kinh doanh cốt lõi thay vì dùng query params (`?type=...`):
    - 👗 Thuê trang phục: `/thue-trang-phuc` (catalog) và `/thue-trang-phuc/[slug]` (chi tiết sản phẩm).
    - 📷 Thuê máy ảnh: `/thue-may-anh` (catalog) và `/thue-may-anh/[slug]` (chi tiết sản phẩm).
    - 📸 Dịch vụ chụp: `/dich-vu-chup` (catalog) và `/dich-vu-chup/[slug]` (chi tiết sản phẩm).
    - ✨ Lookbook: `/lookbook` (catalog) và `/lookbook/[slug]` (chi tiết sản phẩm).
  - Duy trì tính tương thích ngược hoàn toàn cho các đường dẫn cũ `/products` và `/products/[slug]`.
  - Tách component tái sử dụng `ProductDetailView` (`src/components/features/products/ProductDetailView`) đồng bộ UI, breadcrumbs thông minh theo trụ cột, biểu mẫu đặt lịch, cam kết dịch vụ và danh sách sản phẩm liên quan.
  - Tự động kích hoạt trạng thái active trên thanh Header khi người dùng duyệt danh mục hoặc xem chi tiết bất kỳ sản phẩm nào thuộc trụ cột tương ứng thông qua tiền tố đường dẫn `pathname.startsWith(item.href)`.
  - Cập nhật `ProductCard` và `FeaturedProductsTabs` tự động điều hướng tới semantic route chuyên biệt theo loại sản phẩm (`CAMERA` -> `/thue-may-anh/...`, `COSTUME` -> `/thue-trang-phuc/...`, `PHOTOGRAPHY` -> `/dich-vu-chup/...`).
  - Toàn bộ 90 bộ test files (447 unit tests) đạt pass 100%, TypeScript typecheck & ESLint pass 0 lỗi.

- **Hạ Tầng Đa Ngôn Ngữ Song Ngữ Tiếng Việt / Tiếng Anh Cho Client (CNT-007 - ✅ DONE)**:
  - Tích hợp `next-intl` App Router với phân tầng đường dẫn `src/app/[locale]/` (`vi`/`en`).
  - Cấu hình middleware `src/middleware.ts` tự động điều hướng locale lạ về mặc định `/vi/...` và giữ nguyên tiền tố locale.
  - Tự động sinh thẻ alternate quốc tế hoá (`hreflang` / `alternates.languages`) trong `generateMetadata()` cho SEO chuẩn.
  - Thiết kế `LanguageSwitcher` với các biến thể `pill`, `compact` và biến thể `icon` tối ưu diện tích bằng nút tròn 44x44px chứa icon Globe kèm huy hiệu mini.
  - Tái cấu trúc Header: tập trung vào các ngành nghề kinh doanh cốt lõi (Thuê trang phục, Thuê máy ảnh, Dịch vụ chụp, Lookbook), bỏ màu nền trong suốt, loại bỏ hoàn toàn hiện tượng ngắt dòng khó coi.
  - Đồng bộ 100% keys giữa `vi.json` và `en.json`, vượt qua toàn bộ unit tests, accessibility tests và Playwright E2E tests.

- **Client Route Navigation & Loading Feedback Optimization (UI/UX Pro Max)**:
  - Tích hợp thanh tiến trình điều hướng toàn cục `NavigationProgressBar` (`src/components/common/NavigationProgressBar`) chạy ở cạnh trên màn hình với tông màu Burgundy `#641D2B` và ánh vàng kim sang trọng, animation tăng tốc GPU (`transform: scaleX(...)`), tuân thủ 100% quy tắc cấm inline CSS.
  - Hiển thị micro-indicator góc trên bên phải khi đang chuyển trang: "Đang chuyển trang..." / "Navigating...", hỗ trợ đầy đủ `role="progressbar"`, `role="status"` và chuẩn trợ năng WCAG.
  - Bổ sung `src/app/[locale]/loading.tsx` và `src/app/[locale]/products/loading.tsx` hỗ trợ React Suspense streaming: hiển thị khung xương skeleton (banner, bộ lọc danh mục và 8 thẻ sản phẩm) lập tức khi chuyển route thay vì đứng hình.
  - Tối ưu hóa `Header.tsx`: bật `prefetch={true}` trên toàn bộ liên kết điều hướng mảng kinh doanh, trang tĩnh và mobile drawer; phản hồi click tức thì (<100ms) với trạng thái pending (`pendingHref`) hiển thị hiệu ứng pulse và biểu tượng tải nhỏ trên link được click.
  - Bổ sung tín hiệu timeout 3 giây (`AbortSignal.timeout(3000)`) cho các lời gọi API công khai (`getPublicCategories`, `getPublicProducts`, `getHomeFeaturedData`) chống nghẽn kết nối khi mạng chậm hoặc backend đang khởi động.
  - Đồng bộ đa ngôn ngữ `vi.json` và `en.json` với các khóa `navigating` và `progressBarLabel`.
  - Bộ kiểm thử tự động đạt độ bao phủ 95.98% stmts / 84.38% branch (Vitest 430 tests) và pass 100% 25 kịch bản Playwright E2E.

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
    - [docs/features/system-setting/SET-003-thong-bao-email-xac-nhan-va-nhac-lich.md](docs/features/system-setting/SET-003-thong-bao-email-xac-nhan-va-nhac-lich.md): Hệ thống thông báo qua Email: Xác nhận đặt lịch, cọc & nhắc lịch thuê (Chưa triển khai Zalo/SMS), Flyway V29.

### Changed
- **Reopen BOK-001 For Implementation**: Đánh dấu tính năng `BOK-001` (Đặt thuê trên Client) chuyển trạng thái `✅ DONE` $\rightarrow$ `🔄 REOPENED` để thực hiện lại theo yêu cầu mới: Bổ sung trường Email trên giao diện đặt đồ Client (`BookingForm.tsx`), tiếp nhận email trên Backend API DTO và kích hoạt gửi email xác nhận đặt đơn tự động (`SET-003`).
- **Notification Requirements Update (SET-003 & BOK-001)**:
  - Thay đổi yêu cầu kênh thông báo: Khách hàng đặt lịch thành công trên Client sẽ nhận Email xác nhận đặt đơn tự động (`booking-confirmation.html`) kèm chi tiết đơn, hạn giữ chỗ 60 phút và mã VietQR thanh toán 1 chạm.
  - Chuẩn hóa toàn bộ thông báo khách hàng xuyên suốt vòng đời đơn thuê (xác nhận cọc, nhắc lịch nhận đồ, nhắc lịch trả đồ, biên lai hoàn cọc, thông báo quá hạn giữ chỗ) qua kênh **Email** (Spring Boot Mail + Thymeleaf template).
  - Tạm thời chưa triển khai gửi tin qua Zalo ZNS và SMS Brandname để tối ưu chi phí hạ tầng và đảm bảo khách hàng nhận email chuyên nghiệp, chứa đầy đủ hóa đơn HTML, bảng giá, chi tiết trang phục và mã VietQR.
  - Cập nhật đồng bộ các tài liệu đặc tả liên quan: `SET-003`, `BOK-001`, `BOK-003`, `BOK-005`, `BOK-007`, `BOK-009`, `BOK-010`, `PAY-001`, `SET-001`.
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
