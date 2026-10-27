# Theo Dõi Tiến Độ Tính Năng - Chickie Studio

Tài liệu quản lý và theo dõi tiến độ toàn bộ tính năng của dự án **Chickie Studio** (Website khách Next.js, CRM React Vite, API Spring Boot & MySQL).

---

## 1. Hướng Dẫn & Quy Ước

### Chú Giải Trạng Thái
| Ký hiệu | Trạng thái | Ý nghĩa |
|---|---|---|
| ⬜ | `TODO` | Tính năng trong kế hoạch, chưa bắt đầu viết spec hoặc code |
| 📝 | `SPEC` | Đã hoàn thành tài liệu đặc tả chi tiết, sẵn sàng triển khai |
| 🚧 | `IN_PROGRESS` | Đang trong quá trình lập trình (Frontend / Backend) |
| 🔍 | `REVIEW` | Code xong, đang review PR / kiểm thử chất lượng |
| ✅ | `DONE` | Hoàn thành toàn diện: code xong, test $\ge 80\%$, lint pass, docs đã cập nhật |
| ⏸ | `BLOCKED` | Bị nghẽn, tạm dừng do phụ thuộc hoặc vướng mắc kỹ thuật |
| ❌ | `CANCELLED` | Tính năng bị loại bỏ hoặc hủy bỏ |

### Mức Độ Ưu Tiên
- **P0 - MVP Bắt buộc**: Các tính năng cốt lõi bắt buộc phải có để hệ thống có thể vận hành và khách có thể đặt đồ.
- **P1 - Vận hành tốt hơn**: Các tính năng hỗ trợ quản lý tối ưu, tự động hóa quy trình hàng ngày.
- **P2 - Tăng trưởng**: Các tính năng marketing, ưu đãi, báo cáo nâng cao và tích hợp bên thứ ba.

---

## 2. Tính Năng Đang Thực Hiện & Tắc Nghẽn (Active & Blocked)

> Hiện tại không có tính năng nào bị tắc nghẽn (Blocked) hay đang trong tình trạng Reopened. Toàn bộ 21 tính năng cốt lõi đã hoàn thành 100% code, kiểm thử tự động và tài liệu đặc tả.

| ID | Tên tính năng | Phạm vi | Người phụ trách | Trạng thái | Lý do / Ghi chú |
|---|---|---|---|---|---|
| - | Không có tính năng bị nghẽn | - | - | - | Sẵn sàng cho sprint tiếp theo |

---

## 3. Bảng Thống Kê Tiến Độ Tổng Thể

| Phân hệ / Module | Tên Module | Tổng số | TODO | SPEC | IN_PROGRESS | DONE | % Hoàn thành |
|---|---|---|---|---|---|---|---|
| **UI** | Kiến trúc Component & Package @chickie/ui | 6 | 0 | 0 | 0 | 6 | 100% |
| **AUTH** | Xác thực & Phân quyền | 4 | 0 | 0 | 0 | 4 | 100% |
| **CAT** | Danh mục & Sản phẩm | 8 | 0 | 3 | 0 | 5 | 62.5% |
| **BOK** | Đặt thuê & Chống trùng lịch | 10 | 0 | 5 | 0 | 5 | 50.0% |
| **PAY** | Thanh toán & Cọc | 5 | 0 | 5 | 0 | 0 | 0% |
| **CUS** | Khách hàng & Lịch sử | 4 | 0 | 4 | 0 | 0 | 0% |
| **RPT** | Dashboard & Báo cáo | 3 | 0 | 3 | 0 | 0 | 0% |
| **CNT** | Nội dung & SEO | 7 | 0 | 5 | 0 | 2 | 28.6% |
| **SET** | Cấu hình hệ thống | 3 | 0 | 2 | 0 | 1 | 33.3% |
| **TỔNG CỘNG** | | **50** | **0** | **28** | **0** | **22** | **44.0%** |

*(Lưu ý: 22 tính năng đã hoàn thành ✅ DONE 100% code, test tự động coverage > 85%, Playwright E2E pass 100%, docs đầy đủ; 28 tính năng còn lại đã hoàn thành 100% hồ sơ tài liệu 📝 SPEC).*

---

## 4. Chi Tiết Tính Năng Theo Module

### 4.0. Module UI (Bộ Component UI Chuẩn Hóa Trực Tiếp Trong Client & CRM)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec / docs |
|---|---|---|---|---|---|---|---|---|
| `UI-000` | UI-0: Nền tảng UI, primitives shadcn/ui bọc chuẩn, cấu hình alias nội bộ trong client & crm | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect | 2026-10-24 | 2026-10-24 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-001` | UI-1: Nhập liệu cơ bản (Button, TextField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton) tích hợp nội bộ client & crm | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect | 2026-10-24 | 2026-10-24 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-002` | UI-2: Lớp phủ (Modal, ConfirmModal, Drawer, Menu, Popover, Tooltip, notify) | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-003` | UI-3: Ngày và form (DatePicker, DateRangePicker, bộ Form*, CurrencyField, PhoneField, ChipGroup, SizeSelector, ColorSwatchGroup) | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-004` | UI-4: Hiển thị dữ liệu (Tabs, Accordion, Pagination, Breadcrumbs, EmptyState, ErrorState, Gallery, DataTable) | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-005` | UI-5: Common nghiệp vụ (StatusBadge, ProductCard, SectionHeading, Rating, FilterBar, ImageUploader, StatCard) | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |


---

### 4.1. Module AUTH (Xác Thực & Phân Quyền)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `AUTH-001` | Đăng nhập hệ thống quản trị CRM | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [AUTH-001](features/auth/AUTH-001-dang-nhap-crm.md) |
| `AUTH-002` | Phân quyền vai trò Admin và Nhân viên | CRM, SERVER | P0 | ✅ DONE | Tech Lead | 2026-10-24 | 2026-10-24 | [AUTH-002](features/auth/AUTH-002-phan-quyen-admin-nhan-vien.md) |
| `AUTH-003` | Refresh Token & Quản lý phiên làm việc | CRM, SERVER | P0 | ✅ DONE | Tech Lead | 2026-10-24 | 2026-10-24 | [AUTH-003](features/auth/AUTH-003-refresh-token-quan-ly-phien.md) |
| `AUTH-004` | Quản lý danh sách tài khoản nhân viên | CRM, SERVER | P1 | ✅ DONE | Fullstack Dev & Tech Lead | 2026-10-27 | 2026-10-27 | [AUTH-004](features/auth/AUTH-004-quan-ly-tai-khoan-nhan-vien.md) |

---

### 4.2. Module CAT (Danh Mục & Sản Phẩm)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CAT-001` | Quản lý danh mục sản phẩm | CRM, SERVER, CLIENT | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-001](features/catalog/CAT-001-quan-ly-danh-muc.md) |
| `CAT-002` | Quản lý sản phẩm, biến thể (Size/Màu) & ảnh | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-002](features/catalog/CAT-002-quan-ly-san-pham-bien-the-anh.md) |
| `CAT-003` | Quản lý món đồ thực tế & trạng thái vòng đời | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-25 | 2026-10-25 | [CAT-003](features/catalog/CAT-003-quan-ly-mon-do-thuc-te-trang-thai.md) |
| `CAT-004` | Quản lý gói combo (váy + máy ảnh) | CRM, SERVER, CLIENT | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [CAT-004](features/catalog/CAT-004-quan-ly-goi-combo.md) |
| `CAT-005` | Danh sách sản phẩm & bộ lọc đa chiều Client | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-005](features/catalog/CAT-005-hien-thi-san-pham-bo-loc-client.md) |
| `CAT-006` | Chi tiết sản phẩm, bảng quy đổi size & lịch trống (Availability) | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-25 | 2026-10-25 | [CAT-006](features/catalog/CAT-006-chi-tiet-san-pham-lich-trong-client.md) |
| `CAT-007` | Gợi ý sản phẩm phụ kiện đi kèm | CLIENT | P1 | 📝 SPEC | Fullstack Dev & UI/UX Specialist | - | - | [CAT-007](features/catalog/CAT-007-goi-y-phu-kien-di-kem.md) |
| `CAT-008` | Hàng đợi giặt ủi và sửa chữa trang phục | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [CAT-008](features/catalog/CAT-008-hang-doi-giat-ui-sua-chua.md) |

---

### 4.3. Module BOK (Đặt Thuê & Chống Trùng Lịch)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `BOK-001` | Đặt thuê trang phục trực tuyến trên Client | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev & UI/UX Specialist | 2026-10-25 | 2026-10-26 | [BOK-001](features/booking/BOK-001-dat-thue-tren-client.md) |
| `BOK-002` | Chống trùng lịch & Ngày đệm giặt ủi an toàn | SERVER | P0 | ✅ DONE | Fullstack Dev & Tech Lead | 2026-10-25 | 2026-10-25 | [BOK-002](features/booking/BOK-002-chong-trung-lich-ngay-dem.md) |
| `BOK-003` | State Machine luồng trạng thái đơn thuê | SERVER, CRM, CLIENT | P0 | ✅ DONE | Fullstack Dev & Tech Lead | 2026-10-25 | 2026-10-25 | [BOK-003](features/booking/BOK-003-luong-trang-thai-don-thue.md) |
| `BOK-004` | Quản lý đơn thuê tập trung trên CRM | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-25 | 2026-10-25 | [BOK-004](features/booking/BOK-004-quan-ly-don-thue-crm.md) |
| `BOK-005` | Tra cứu đơn bằng mã đơn và SĐT trên Client | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-25 | 2026-10-25 | [BOK-005](features/booking/BOK-005-tra-cuu-don-ma-sdt-client.md) |
| `BOK-006` | Lịch thuê dạng Calendar trực quan trên CRM | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [BOK-006](features/booking/BOK-006-lich-thue-dieu-phoi-calendar-crm.md) |
| `BOK-007` | Giữ chỗ tạm thời tự nhả khi quá hạn cọc | SERVER, CRM, CLIENT | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [BOK-007](features/booking/BOK-007-tu-dong-nha-slot-qua-han-coc.md) |
| `BOK-008` | Hỗ trợ đơn thuê nhóm kỷ yếu số lượng lớn | CRM, SERVER | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [BOK-008](features/booking/BOK-008-don-thue-nhom-ky-yeu-so-luong-lon.md) |
| `BOK-009` | Biên bản bàn giao đồ có chụp ảnh hiện trạng | CRM | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [BOK-009](features/booking/BOK-009-bien-ban-ban-giao-do-chup-anh.md) |
| `BOK-010` | Đặt lịch thử đồ trực tiếp tại showroom | CLIENT, CRM | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [BOK-010](features/booking/BOK-010-dat-lich-thu-do-showroom.md) |

---

### 4.4. Module PAY (Thanh Toán & Cọc)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `PAY-001` | Ghi nhận cọc và thanh toán tiền mặt/CK trên CRM | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [PAY-001](features/payment/PAY-001-ghi-nhan-coc-thanh-toan-crm.md) |
| `PAY-002` | Quy trình hoàn trả tiền cọc cho khách | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [PAY-002](features/payment/PAY-002-quy-trinh-hoan-tra-tien-coc.md) |
| `PAY-003` | Thu phụ phí trả trễ hạn và hư hỏng đồ | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [PAY-003](features/payment/PAY-003-thu-phu-phi-tre-han-hu-hong.md) |
| `PAY-004` | Sinh mã VietQR động theo từng đơn hàng | CLIENT, CRM | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [PAY-004](features/payment/PAY-004-sinh-ma-vietqr-dong.md) |
| `PAY-005` | Tích hợp cổng thanh toán online VNPay / MoMo | SERVER, CLIENT | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [PAY-005](features/payment/PAY-005-tich-hop-cong-thanh-toan-online.md) |

---

### 4.5. Module CUS (Khách Hàng & Lịch Sử)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CUS-001` | Quản lý khách hàng & lịch sử thuê đồ | CRM, SERVER | P0 | 📝 SPEC | Fullstack Dev | - | - | [CUS-001](features/customer/CUS-001-quan-ly-khach-hang-lich-su-thue.md) |
| `CUS-002` | Ghi chú nội bộ & danh sách đen (Blacklist) | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [CUS-002](features/customer/CUS-002-ghi-chu-noi-bo-danh-sach-den.md) |
| `CUS-003` | Quản lý mã giảm giá / Voucher khuyến mãi | CRM, SERVER, CLIENT | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [CUS-003](features/customer/CUS-003-quan-ly-ma-giam-gia-voucher.md) |
| `CUS-004` | Chính sách ưu đãi nhóm Học sinh - Sinh viên | CRM, SERVER, CLIENT | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [CUS-004](features/customer/CUS-004-chinh-sach-uu-dai-hoc-sinh-sinh-vien.md) |

---

### 4.6. Module RPT (Dashboard & Báo Cáo)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `RPT-001` | Dashboard cảnh báo: đơn mới, sắp giao, sắp trả, quá hạn | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [RPT-001](features/dashboard-report/RPT-001-dashboard-canh-bao-van-hanh.md) |
| `RPT-002` | Báo cáo doanh thu theo ngày / tuần / tháng | CRM, SERVER | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [RPT-002](features/dashboard-report/RPT-002-bao-cao-doanh-thu-dong-tien.md) |
| `RPT-003` | Thống kê sản phẩm thuê nhiều & tỉ lệ sử dụng kho đồ | CRM, SERVER | P2 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [RPT-003](features/dashboard-report/RPT-003-thong-ke-san-pham-su-dung-kho.md) |

---

### 4.7. Module CNT (Nội Dung & SEO)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CNT-001` | Trang chủ website Client (Landing Page) | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [CNT-001](features/content-seo/CNT-001-trang-chu-client.md) |
| `CNT-002` | Các trang tĩnh: Chính sách thuê, FAQ, Liên hệ | CLIENT | P0 | ✅ DONE | Fullstack Dev & UI/UX Specialist | 2026-10-25 | 2026-10-25 | [CNT-002](features/content-seo/CNT-002-trang-tinh-chinh-sach-faq-lien-he.md) |
| `CNT-003` | Cấu hình SEO Metadata, Sitemap XML & Structured Data | CLIENT | P2 | 📝 SPEC | Frontend Lead & SEO Specialist | - | - | [CNT-003](features/content-seo/CNT-003-seo-metadata-sitemap-structured-data.md) |
| `CNT-004` | Blog chia sẻ kinh nghiệm chụp ảnh & chọn đồ | CLIENT, CRM | P2 | 📝 SPEC | Fullstack Dev & UI/UX Specialist | - | - | [CNT-004](features/content-seo/CNT-004-blog-chia-se-kinh-nghiem.md) |
| `CNT-005` | Lookbook bộ sưu tập ảnh phối đồ theo mùa | CLIENT, CRM | P2 | 📝 SPEC | Fullstack Dev & UI/UX Specialist | - | - | [CNT-005](features/content-seo/CNT-005-lookbook-bo-suu-tap-theo-mua.md) |
| `CNT-007` | Hạ tầng đa ngôn ngữ vi/en cho website Client | CLIENT | P0 | ✅ DONE | Frontend Lead | 2026-10-25 | 2026-10-25 | [CNT-007](features/content-seo/CNT-007-da-ngon-ngu-vi-en-client.md) |

---

### 4.8. Module SET (Cấu Hình Hệ Thống)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `SET-001` | Cấu hình thông tin shop, số ngày đệm giặt ủi, tỉ lệ cọc | CRM, SERVER, CLIENT | P1 | 📝 SPEC | Fullstack Dev & Tech Lead | - | - | [SET-001](features/system-setting/SET-001-cau-hinh-thong-tin-shop-tham-so.md) |
| `SET-002` | Cấu hình nội dung banner & thông điệp trang chủ | CRM, SERVER, CLIENT | P2 | 📝 SPEC | Fullstack Dev & UI/UX Specialist | - | - | [SET-002](features/system-setting/SET-002-cau-hinh-banner-thong-diep-trang-chu.md) |
| `SET-003` | Hệ thống thông báo qua Email: Xác nhận đặt lịch, cọc & nhắc lịch thuê (Chưa triển khai Zalo/SMS) | SERVER, CRM | P1 | ✅ DONE (Backend) | Backend Engineer & Tech Lead | 2026-10-25 | 2026-10-25 | [SET-003](features/system-setting/SET-003-thong-bao-email-xac-nhan-va-nhac-lich.md) |

---

## 5. Lịch Sử Cập Nhật Trạng Thái

| Ngày | ID | Thay đổi | Người thực hiện | Ghi chú |
| 2026-10-27 | `AUTH-004` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & Tech Lead | Hoàn thành toàn diện cả Backend & CRM UI: 6 REST APIs quản lý user, BCrypt, BR-01..BR-05 thu hồi token tức thì khi khóa/đổi mật khẩu, chặn tự khóa/khóa Admin duy nhất (269/269 backend tests pass); Giao diện CRM đầy đủ 3 StatCards, DataTable, Filter bar, Switch toggle status với ConfirmModal, modals Tạo/Sửa/Reset password với Zod validation & tự sinh mật khẩu ngẫu nhiên, RoleGuard ROLE_ADMIN, 24/24 Vitest tests pass 100%, 0 inline CSS |
| 2026-10-26 | `BOK-001` | 🔄 REOPENED $\rightarrow$ ✅ DONE | Fullstack Dev & UI/UX Specialist | Hoàn thành toàn diện: Bổ sung trường Email trên BookingForm Client, validation Zod, DTO & API tiếp nhận Email, kích hoạt gửi Email xác nhận tự động kèm mã VietQR (SET-003), đồng bộ song ngữ vi/en, 449 unit tests pass 100%, 25/25 Playwright E2E pass 100% |
| 2026-10-25 | `SET-003` | 📝 SPEC $\rightarrow$ ✅ DONE (Backend) | Backend Engineer & Fullstack Dev | Hoàn thành toàn diện phân hệ Backend: Flyway V12 (bảng notification_logs & customer_email), MailConfig async executor, EmailNotificationService + 7 template Thymeleaf, AdminNotificationController, tích hợp tự động gửi email xác nhận đặt lịch & cập nhật trạng thái trong BookingService, JaCoCo coverage $\ge 80\%$ line & branch (239 tests pass) |
| 2026-10-25 | `BOK-001` | ✅ DONE $\rightarrow$ 🔄 REOPENED | Tech Lead & Fullstack Dev | Đánh dấu thực hiện lại do thay đổi yêu cầu: Bổ sung trường Email khách hàng trên Form đặt thuê Client, cập nhật Backend API/DTO và kích hoạt tự động gửi Email xác nhận đặt đơn (booking-confirmation.html) kèm mã VietQR (SET-003) |
| 2026-10-25 | `SET-003, BOK-001` | Thay đổi yêu cầu (CR) | Tech Lead & Fullstack Dev | Thay đổi kênh thông báo: Khách đặt lịch thành công nhận Email xác nhận tự động; chuẩn hóa toàn bộ các thông báo vòng đời đơn (cọc, nhắc lịch, hoàn cọc, quá hạn) qua Email; tạm thời chưa triển khai Zalo ZNS và SMS. Cập nhật đồng bộ các spec SET-003, BOK-001, BOK-003, BOK-005, BOK-007, BOK-009, BOK-010, PAY-001, SET-001. |
| 2026-10-25 | Toàn bộ 13 tính năng P1/P2 còn lại | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev, Tech Lead & UI/UX Specialist | Hoàn thành 100% hồ sơ đặc tả chi tiết cho toàn bộ 50 tính năng của dự án Chickie Studio: Gợi ý phụ kiện (CAT-007), Đơn kỷ yếu số lượng lớn (BOK-008), Biên bản bàn giao ảnh (BOK-009), Đặt lịch thử đồ (BOK-010), Mã giảm giá (CUS-003), Ưu đãi HSSV (CUS-004), Thống kê hiệu suất kho (RPT-003), SEO & Sitemap (CNT-003), Blog chia sẻ (CNT-004), Lookbook (CNT-005), Đánh giá feedback (CNT-006), Banner trang chủ (SET-002), Thông báo Zalo ZNS (SET-003) |
| 2026-10-25 | `SET-001, CAT-004, CUS-002` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành 100% hồ sơ đặc tả toàn bộ các tính năng P1 (Vận hành cốt lõi): Cấu hình tham số động hệ thống (SET-001, Flyway V16), Quản lý gói combo ưu đãi váy + máy ảnh (CAT-004, Flyway V17), Ghi chú nội bộ & Blacklist phòng ngừa rủi ro (CUS-002, Flyway V18) |
| 2026-10-25 | `CAT-008` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành hồ sơ đặc tả Hàng đợi giặt ủi và sửa chữa trang phục: Quy trình tiếp nhận sau hoàn trả, theo dõi gửi xưởng ngoài, cảnh báo nguy cơ trễ lịch thuê kế tiếp <48h, nghiệm thu chất lượng về AVAILABLE, Flyway V15 |
| 2026-10-25 | `AUTH-004` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành hồ sơ đặc tả Quản lý danh sách tài khoản nhân viên CRM: CRUD tài khoản, mã hóa BCrypt, đổi trạng thái ACTIVE/LOCKED, thu hồi phiên Refresh Token tức thì, API /api/admin/users/* |
| 2026-10-25 | `RPT-001 & 002` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành hồ sơ đặc tả Cụm Dashboard & Báo Cáo: Dashboard trung tâm điều hành 4 thẻ KPI & hàng đợi hành động (RPT-001), Báo cáo doanh thu & dòng tiền ký quỹ P&L, biểu đồ chu kỳ & xuất Excel (RPT-002) |
| 2026-10-25 | `PAY-001 -> 005` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành trọn gói bộ 5 tài liệu đặc tả Module Thanh toán & Cọc: Ghi nhận cọc CRM (PAY-001), Quy trình hoàn cọc (PAY-002), Phụ phí hư hỏng & trễ hạn (PAY-003), Sinh mã VietQR động (PAY-004), Tích hợp VNPay/MoMo IPN (PAY-005) |
| 2026-10-25 | `BOK-006` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành hồ sơ đặc tả chi tiết: Màn hình Calendar / Timeline Gantt điều phối món đồ vật lý, nghiệp vụ Reassign Item & Reschedule an toàn với khóa bi quan, API `/api/admin/dispatch/*` |
| 2026-10-25 | `BOK-007` | ⬜ TODO $\rightarrow$ 📝 SPEC | Fullstack Dev & Tech Lead | Hoàn thành hồ sơ đặc tả chi tiết: Cơ chế giữ chỗ tạm thời và tự động hủy đơn quá hạn cọc qua Background Scheduler, đồng hồ đếm ngược trên Client, Flyway V12 |
| 2026-10-25 | `CNT-002` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & UI/UX Specialist | Hoàn thành toàn diện: Component Accordion & Breadcrumbs chuẩn WAI-ARIA; 4 routes tĩnh SSG (/chinh-sach-thue-do, /faq, /gioi-thieu, /lien-he); bộ từ điển song ngữ vi/en đầy đủ; 354/354 unit tests pass & 4/4 Playwright E2E tests pass 100% |
| 2026-10-25 | `BOK-003` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & Tech Lead | Hoàn thành toàn diện: State Transition Guard (canTransitionTo, getValidNextStatuses), đồng bộ vòng đời món đồ vật lý (RENTED -> LAUNDRY -> AVAILABLE), bảng Audit Trail booking_status_histories, API PATCH /api/admin/bookings/{id}/status, API POST /api/admin/bookings/check-overdue, 203/203 tests pass 100% |
| 2026-10-25 | `BOK-002` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & Tech Lead | Hoàn thành toàn diện: Khóa bi quan Pessimistic Write Lock findActiveItemsForUpdate trong ProductItemRepository ngăn chặn triệt để Race condition / trùng lịch; chuẩn hóa thuật toán tính bufferDays theo loại danh mục (1 ngày cho trang phục, 0 ngày cho máy ảnh/dịch vụ); kiểm tra giao thoa khoảng thời gian đối xứng; 198/198 tests pass 100% |
| 2026-10-25 | `CNT-001` | 🚧 IN_PROGRESS $\rightarrow$ ✅ DONE | Fullstack Dev & UI/UX Specialist | Hoàn thành toàn diện: Backend API GET /api/public/home/featured tổng hợp 6 khối nội dung; Client HomePage SSR kết nối API, bổ sung ProcessSteps (4 bước thuê đồ trực quan), FloatingContact (Hotline 1 chạm & Zalo chat), JSON-LD ClothingStore SEO, 273/273 unit tests & 16/16 Playwright tests pass 100% |
| 2026-10-25 | `CNT-001` | 📝 SPEC $\rightarrow$ 🚧 IN_PROGRESS | Fullstack Dev | Hoàn thành toàn diện phần Backend: DTOs (HeroBannerDto, FeaturedServiceDto, RentalStepDto, TestimonialDto, HomeFeaturedResponse), HomeFeaturedService tổng hợp top categories & top products, PublicHomeController endpoint GET /api/public/home/featured, 195/195 tests pass 100% |
| 2026-10-25 | `BOK-005` | 📝 SPEC $\rightarrow$ 🚧 IN_PROGRESS | Fullstack Dev | Hoàn thành toàn diện phần Backend: V11 Flyway migration tạo index kép (booking_code, customer_phone), DTO BookingTrackingRequest kiểm tra regex SĐT, BookingService.trackBooking chuẩn hóa số điện thoại, bảo mật BR-01/BR-02 ẩn danh changedBy nhân viên, Controller POST /api/public/bookings/tracking, 193/193 tests pass 100% |
| 2026-10-25 | `BOK-001` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & UI/UX Specialist | Hoàn thành toàn diện: Backend API POST /api/public/bookings (tạo đơn giữ chỗ, phân bổ item kho an toàn, tự sinh mã BK...), GET /api/public/bookings/{code}, Client BookingForm trực quan với inline validation, phương thức nhận đồ (Tại tiệm/Giao tận nơi), modal Luxury xác nhận đặt cọc và trang hóa đơn `/booking/success/[code]`. Test coverage > 93%, 11/11 Playwright E2E pass |
| 2026-10-25 | `CAT-006` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev | Hoàn thành toàn diện: V8 Migration Flyway, Backend API GET /api/public/products/{idOrSlug}/availability tính toán đệm giặt ủi bufferDays, Client AvailabilityCalendar lưới 7 ngày chọn dải ngày, SizeGuideModal bảng quy đổi kích cỡ chuẩn 3 trụ cột, StickyBottomCta mobile view, test coverage đạt 94.9%, 10/10 Playwright E2E pass |
| 2026-10-25 | `CAT-003` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev | Hoàn thành toàn diện: V7 Flyway migration, ProductItem entity & state machine (AVAILABLE, RENTED, LAUNDRY, MAINTENANCE, RETIRED), AdminProductItemController API CRUD, CRM Item Instance Management, barcode labels, modal chi tiết, test coverage > 88% |
| 2026-10-24 | `UI-000` | 📝 SPEC $\rightarrow$ ✅ DONE | Senior Frontend Architect | Hoàn thành toàn diện kiến trúc Monorepo Workspace, package `@chickie/ui`, primitives & base Button, ESLint rules, test coverage 100%, docs tại UI_LIBRARIES.md & ADR 0002 |
| 2026-10-24 | `CAT-001` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev | Hoàn thành toàn diện V3 migration Flyway, API REST CRUD danh mục, trang CRM CategoriesPage DataTable + Zod modal, tích hợp Client grid, test coverage $\ge 88\%$ |
| 2026-10-24 | `AUTH-001/002/003` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & Tech Lead | Hoàn thành toàn diện kiến trúc Server Spring Boot 3 + Flyway MySQL, JWT Auth, RBAC RoleGuard, UI Login CRM, test coverage Server & CRM $\ge 85\%$ |
| 2026-10-24 | `UI-001` | ⬜ TODO $\rightarrow$ ✅ DONE | Senior Frontend Architect | Hoàn thành toàn diện Giai đoạn UI-1: Bộ nhập liệu cơ bản (@chickie/ui: Button, TextField, PasswordField, SearchField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton), 78 tests pass, coverage 99.94%, vitest-axe a11y pass 100%, tích hợp showcase dev cả Client và CRM |
| 2026-10-24 | Toàn bộ 17 tính năng P0 | ⬜ TODO $\rightarrow$ 📝 SPEC | Tech Lead | Hoàn tất tài liệu đặc tả kỹ thuật chi tiết cho toàn bộ MVP P0 |
| 2026-10-24 | Khởi tạo hệ thống | Khởi tạo | Tech Lead | Lập bảng theo dõi 44 tính năng cho toàn bộ dự án Chickie Studio |
