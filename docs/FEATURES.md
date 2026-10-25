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

> Cụm tính năng AUTH (AUTH-001, AUTH-002, AUTH-003) và Catalog cơ bản (CAT-001, CAT-002) đã hoàn thành xuất sắc 100% cả Backend & CRM Frontend. Hệ thống sẵn sàng bước sang các tính năng tiếp theo (`CAT-003`, `CAT-005` hoặc `BOK-001`).

| ID | Tên tính năng | Phạm vi | Người phụ trách | Trạng thái | Lý do / Ghi chú |
|---|---|---|---|---|---|
| - | - | - | - | - | Hiện không có tính năng nào bị tắc nghẽn |

---

## 3. Bảng Thống Kê Tiến Độ Tổng Thể

| Phân hệ / Module | Tên Module | Tổng số | TODO | SPEC | IN_PROGRESS | DONE | % Hoàn thành |
|---|---|---|---|---|---|---|---|
| **UI** | Kiến trúc Component & Package @chickie/ui | 6 | 4 | 0 | 0 | 2 | 33.3% |
| **AUTH** | Xác thực & Phân quyền | 4 | 1 | 0 | 0 | 3 | 75% |
| **CAT** | Danh mục & Sản phẩm | 8 | 3 | 1 | 0 | 4 | 50.0% |
| **BOK** | Đặt thuê & Chống trùng lịch | 10 | 5 | 5 | 0 | 0 | 0% |
| **PAY** | Thanh toán & Cọc | 5 | 5 | 0 | 0 | 0 | 0% |
| **CUS** | Khách hàng & Lịch sử | 4 | 3 | 1 | 0 | 0 | 0% |
| **RPT** | Dashboard & Báo cáo | 3 | 3 | 0 | 0 | 0 | 0% |
| **CNT** | Nội dung & SEO | 7 | 4 | 3 | 0 | 0 | 0% |
| **SET** | Cấu hình hệ thống | 3 | 3 | 0 | 0 | 0 | 0% |
| **TỔNG CỘNG** | | **50** | **31** | **10** | **0** | **9** | **18.0%** |

*(Lưu ý: UI-000, UI-001, AUTH-001/002/003, CAT-001, CAT-002, CAT-003, CAT-005 đã hoàn thành ✅ DONE 100% code, test tự động coverage > 85%, Playwright E2E pass 100%, docs đầy đủ; các tính năng cốt lõi P0 còn lại đã hoàn thành 100% hồ sơ tài liệu 📝 SPEC).*

---

## 4. Chi Tiết Tính Năng Theo Module

### 4.0. Module UI (Bộ Component UI Chuẩn Hóa Trực Tiếp Trong Client & CRM)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec / docs |
|---|---|---|---|---|---|---|---|---|
| `UI-000` | UI-0: Nền tảng UI, primitives shadcn/ui bọc chuẩn, cấu hình alias nội bộ trong client & crm | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect | 2026-10-24 | 2026-10-24 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-001` | UI-1: Nhập liệu cơ bản (Button, TextField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton) tích hợp nội bộ client & crm | CLIENT, CRM | P0 | ✅ DONE | Senior Frontend Architect | 2026-10-24 | 2026-10-24 | [UI_LIBRARIES.md](UI_LIBRARIES.md) / [COMPONENTS.md](COMPONENTS.md) |
| `UI-002` | UI-2: Lớp phủ (Modal, ConfirmModal, Drawer, Menu, Popover, Tooltip, notify) | CLIENT, CRM | P0 | ⬜ TODO | Frontend Dev | - | - | [UI_LIBRARIES.md](UI_LIBRARIES.md) |
| `UI-003` | UI-3: Ngày và form (DatePicker, DateRangePicker, bộ Form*, CurrencyField, PhoneField, ChipGroup, SizeSelector, ColorSwatchGroup) | CLIENT, CRM | P0 | ⬜ TODO | Frontend Dev | - | - | [UI_LIBRARIES.md](UI_LIBRARIES.md) |
| `UI-004` | UI-4: Hiển thị dữ liệu (Tabs, Accordion, Pagination, Breadcrumbs, EmptyState, ErrorState, Gallery, DataTable) | CLIENT, CRM | P0 | ⬜ TODO | Frontend Dev | - | - | [UI_LIBRARIES.md](UI_LIBRARIES.md) |
| `UI-005` | UI-5: Common nghiệp vụ (StatusBadge, ProductCard, SectionHeading, Rating, FilterBar, ImageUploader, StatCard) | CLIENT, CRM | P0 | ⬜ TODO | Frontend Dev | - | - | [UI_LIBRARIES.md](UI_LIBRARIES.md) |


---

### 4.1. Module AUTH (Xác Thực & Phân Quyền)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `AUTH-001` | Đăng nhập hệ thống quản trị CRM | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [AUTH-001](features/auth/AUTH-001-dang-nhap-crm.md) |
| `AUTH-002` | Phân quyền vai trò Admin và Nhân viên | CRM, SERVER | P0 | ✅ DONE | Tech Lead | 2026-10-24 | 2026-10-24 | [AUTH-002](features/auth/AUTH-002-phan-quyen-admin-nhan-vien.md) |
| `AUTH-003` | Refresh Token & Quản lý phiên làm việc | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [AUTH-003](features/auth/AUTH-003-refresh-token-quan-ly-phien.md) |
| `AUTH-004` | Quản lý danh sách tài khoản nhân viên | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |

---

### 4.2. Module CAT (Danh Mục & Sản Phẩm)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CAT-001` | Quản lý danh mục sản phẩm | CRM, SERVER, CLIENT | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-001](features/catalog/CAT-001-quan-ly-danh-muc.md) |
| `CAT-002` | Quản lý sản phẩm, biến thể (Size/Màu) & ảnh | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-002](features/catalog/CAT-002-quan-ly-san-pham-bien-the-anh.md) |
| `CAT-003` | Quản lý món đồ thực tế & trạng thái vòng đời | CRM, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-25 | 2026-10-25 | [CAT-003](features/catalog/CAT-003-quan-ly-mon-do-thuc-te-trang-thai.md) |
| `CAT-004` | Quản lý gói combo (váy + máy ảnh) | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `CAT-005` | Danh sách sản phẩm & bộ lọc đa chiều Client | CLIENT, SERVER | P0 | ✅ DONE | Fullstack Dev | 2026-10-24 | 2026-10-24 | [CAT-005](features/catalog/CAT-005-hien-thi-san-pham-bo-loc-client.md) |
| `CAT-006` | Chi tiết sản phẩm & lịch trống (Availability) | CLIENT, SERVER | P0 | 📝 SPEC | Frontend Lead | - | - | [CAT-006](features/catalog/CAT-006-chi-tiet-san-pham-lich-trong-client.md) |
| `CAT-007` | Gợi ý sản phẩm phụ kiện đi kèm | CLIENT | P1 | ⬜ TODO | - | - | - | - |
| `CAT-008` | Hàng đợi giặt ủi và sửa chữa trang phục | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |

---

### 4.3. Module BOK (Đặt Thuê & Chống Trùng Lịch)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `BOK-001` | Đặt thuê trang phục trực tuyến trên Client | CLIENT, SERVER | P0 | 📝 SPEC | Fullstack Dev | - | - | [BOK-001](features/booking/BOK-001-dat-thue-tren-client.md) |
| `BOK-002` | Chống trùng lịch & Ngày đệm giặt ủi an toàn | SERVER | P0 | 📝 SPEC | Tech Lead | - | - | [BOK-002](features/booking/BOK-002-chong-trung-lich-ngay-dem.md) |
| `BOK-003` | State Machine luồng trạng thái đơn thuê | SERVER, CRM, CLIENT | P0 | 📝 SPEC | Backend Engineer | - | - | [BOK-003](features/booking/BOK-003-luong-trang-thai-don-thue.md) |
| `BOK-004` | Quản lý đơn thuê tập trung trên CRM | CRM, SERVER | P0 | 📝 SPEC | Fullstack Dev | - | - | [BOK-004](features/booking/BOK-004-quan-ly-don-thue-crm.md) |
| `BOK-005` | Tra cứu đơn bằng mã đơn và SĐT trên Client | CLIENT, SERVER | P0 | 📝 SPEC | Frontend Dev | - | - | [BOK-005](features/booking/BOK-005-tra-cuu-don-ma-sdt-client.md) |
| `BOK-006` | Lịch thuê dạng Calendar trực quan trên CRM | CRM | P1 | ⬜ TODO | - | - | - | - |
| `BOK-007` | Giữ chỗ tạm thời tự nhả khi quá hạn cọc | SERVER | P1 | ⬜ TODO | - | - | - | - |
| `BOK-008` | Hỗ trợ đơn thuê nhóm kỷ yếu số lượng lớn | CRM, SERVER | P2 | ⬜ TODO | - | - | - | - |
| `BOK-009` | Biên bản bàn giao đồ có chụp ảnh hiện trạng | CRM | P2 | ⬜ TODO | - | - | - | - |
| `BOK-010` | Đặt lịch thử đồ trực tiếp tại showroom | CLIENT, CRM | P2 | ⬜ TODO | - | - | - | - |

---

### 4.4. Module PAY (Thanh Toán & Cọc)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `PAY-001` | Ghi nhận cọc và thanh toán tiền mặt/CK trên CRM | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `PAY-002` | Quy trình hoàn trả tiền cọc cho khách | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `PAY-003` | Thu phụ phí trả trễ hạn và hư hỏng đồ | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `PAY-004` | Sinh mã VietQR động theo từng đơn hàng | CLIENT, CRM | P1 | ⬜ TODO | - | - | - | - |
| `PAY-005` | Tích hợp cổng thanh toán online VNPay / MoMo | SERVER, CLIENT | P2 | ⬜ TODO | - | - | - | - |

---

### 4.5. Module CUS (Khách Hàng & Lịch Sử)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CUS-001` | Quản lý khách hàng & lịch sử thuê đồ | CRM, SERVER | P0 | 📝 SPEC | Fullstack Dev | - | - | [CUS-001](features/customer/CUS-001-quan-ly-khach-hang-lich-su-thue.md) |
| `CUS-002` | Ghi chú nội bộ & danh sách đen (Blacklist) | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `CUS-003` | Quản lý mã giảm giá / Voucher khuyến mãi | CRM, SERVER | P2 | ⬜ TODO | - | - | - | - |
| `CUS-004` | Chính sách ưu đãi nhóm Học sinh - Sinh viên | CRM, SERVER | P2 | ⬜ TODO | - | - | - | - |

---

### 4.6. Module RPT (Dashboard & Báo Cáo)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `RPT-001` | Dashboard cảnh báo: đơn mới, sắp giao, sắp trả, quá hạn | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `RPT-002` | Báo cáo doanh thu theo ngày / tuần / tháng | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `RPT-003` | Thống kê sản phẩm thuê nhiều & tỉ lệ sử dụng kho đồ | CRM, SERVER | P2 | ⬜ TODO | - | - | - | - |

---

### 4.7. Module CNT (Nội Dung & SEO)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `CNT-001` | Trang chủ website Client (Landing Page) | CLIENT, SERVER | P0 | 📝 SPEC | Frontend Lead | - | - | [CNT-001](features/content-seo/CNT-001-trang-chu-client.md) |
| `CNT-002` | Các trang tĩnh: Chính sách thuê, FAQ, Liên hệ | CLIENT | P0 | 📝 SPEC | Content Lead | - | - | [CNT-002](features/content-seo/CNT-002-trang-tinh-chinh-sach-faq-lien-he.md) |
| `CNT-003` | Cấu hình SEO Metadata, Sitemap XML & Structured Data | CLIENT | P2 | ⬜ TODO | - | - | - | - |
| `CNT-004` | Blog chia sẻ kinh nghiệm chụp ảnh & chọn đồ | CLIENT, CRM | P2 | ⬜ TODO | - | - | - | - |
| `CNT-005` | Lookbook bộ sưu tập ảnh phối đồ theo mùa | CLIENT, CRM | P2 | ⬜ TODO | - | - | - | - |
| `CNT-006` | Thu thập và hiển thị đánh giá kèm ảnh của khách | CLIENT, CRM | P2 | ⬜ TODO | - | - | - | - |
| `CNT-007` | Hạ tầng đa ngôn ngữ vi/en cho website Client | CLIENT | P0 | 📝 SPEC | Frontend Lead | - | - | [CNT-007](features/content-seo/CNT-007-da-ngon-ngu-vi-en-client.md) |

---

### 4.8. Module SET (Cấu Hình Hệ Thống)
| ID | Tên tính năng | Phạm vi | Ưu tiên | Trạng thái | Người phụ trách | Bắt đầu | Hoàn thành | Link spec |
|---|---|---|---|---|---|---|---|---|
| `SET-001` | Cấu hình thông tin shop, số ngày đệm giặt ủi, tỉ lệ cọc | CRM, SERVER | P1 | ⬜ TODO | - | - | - | - |
| `SET-002` | Cấu hình nội dung banner & thông điệp trang chủ | CRM, SERVER | P2 | ⬜ TODO | - | - | - | - |
| `SET-003` | Tích hợp gửi thông báo nhắc lịch qua Zalo ZNS / SMS | SERVER | P2 | ⬜ TODO | - | - | - | - |

---

## 5. Lịch Sử Cập Nhật Trạng Thái

| Ngày | ID | Thay đổi | Người thực hiện | Ghi chú |
|---|---|---|---|---|
| 2026-10-24 | `UI-000` | 📝 SPEC $\rightarrow$ ✅ DONE | Senior Frontend Architect | Hoàn thành toàn diện kiến trúc Monorepo Workspace, package `@chickie/ui`, primitives & base Button, ESLint rules, test coverage 100%, docs tại UI_LIBRARIES.md & ADR 0002 |
| 2026-10-24 | `CAT-001` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev | Hoàn thành toàn diện V3 migration Flyway, API REST CRUD danh mục, trang CRM CategoriesPage DataTable + Zod modal, tích hợp Client grid, test coverage $\ge 88\%$ |
| 2026-10-24 | `AUTH-001/002/003` | 📝 SPEC $\rightarrow$ ✅ DONE | Fullstack Dev & Tech Lead | Hoàn thành toàn diện kiến trúc Server Spring Boot 3 + Flyway MySQL, JWT Auth, RBAC RoleGuard, UI Login CRM, test coverage Server & CRM $\ge 85\%$ |
| 2026-10-24 | `UI-001` | ⬜ TODO $\rightarrow$ ✅ DONE | Senior Frontend Architect | Hoàn thành toàn diện Giai đoạn UI-1: Bộ nhập liệu cơ bản (@chickie/ui: Button, TextField, PasswordField, SearchField, TextArea, Select, Checkbox, RadioGroup, Switch, Badge, Card, Spinner, Skeleton), 78 tests pass, coverage 99.94%, vitest-axe a11y pass 100%, tích hợp showcase dev cả Client và CRM |
| 2026-10-24 | Toàn bộ 17 tính năng P0 | ⬜ TODO $\rightarrow$ 📝 SPEC | Tech Lead | Hoàn tất tài liệu đặc tả kỹ thuật chi tiết cho toàn bộ MVP P0 |
| 2026-10-24 | Khởi tạo hệ thống | Khởi tạo | Tech Lead | Lập bảng theo dõi 44 tính năng cho toàn bộ dự án Chickie Studio |
