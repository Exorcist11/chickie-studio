# Server Rules - Chickie Studio (Java 21 + Spring Boot 3 + MySQL)

## ĐỌC TRƯỚC KHI LÀM (5 DÒNG TÓM TẮT)
1. **PHẢI** đọc toàn bộ tài liệu trong thư mục này trước khi viết mã nguồn Backend.
2. **PHẢI** tổ chức package theo feature; phân tầng nghiêm ngặt: Controller -> Service -> Repository.
3. **TUYỆT ĐỐI CẤM** trả Entity ra ngoài API; **PHẢI** ánh xạ qua DTO bằng MapStruct và bọc trong `ApiResponse<T>`.
4. **PHẢI** quản lý schema cơ sở dữ liệu bằng **Flyway Migration**; cấm dùng `ddl-auto=update` hoặc sửa migration cũ.
5. **PHẢI** viết unit test và integration test (Testcontainers) đạt tối thiểu 80% JaCoCo coverage (line và branch); `mvn verify` pass mới được commit.

---

## Mục Lục Các File Rule

| File | Tóm tắt nội dung |
|---|---|
| [01-clean-code.md](file:///e:/chickie-studio/server/.agent/01-clean-code.md) | Nguyên tắc Clean Code Java, tránh NullPointerException, không magic values, logging an toàn. |
| [02-structure-layers.md](file:///e:/chickie-studio/server/.agent/02-structure-layers.md) | Tổ chức package theo feature, trách nhiệm từng tầng và tái sử dụng `common`. |
| [03-spring-boot.md](file:///e:/chickie-studio/server/.agent/03-spring-boot.md) | DTO, MapStruct, `@Transactional`, concurrency control (trùng lịch booking), bảo mật JWT. |
| [04-database.md](file:///e:/chickie-studio/server/.agent/04-database.md) | Quy ước Flyway migration, charset utf8mb4, đặt tên bảng/cột và tối ưu Index. |
| [05-testing.md](file:///e:/chickie-studio/server/.agent/05-testing.md) | JUnit 5 + Mockito, WebMvcTest, Testcontainers MySQL và cấu hình JaCoCo ngưỡng 80%. |
| [06-workflow.md](file:///e:/chickie-studio/server/.agent/06-workflow.md) | Quy trình thêm API mới, kiểm tra build/verify và checklist hoàn thành (DoD). |

---

## Definition of Done (DoD) Cho Server

Mọi tính năng/API mới chỉ được nghiệm thu khi:
- [ ] Tuân thủ phân tầng: Controller validate DTO, Service xử lý nghiệp vụ, Repo truy vấn.
- [ ] Dùng MapStruct chuyển đổi Entity sang DTO; trả về đúng chuẩn `ApiResponse<T>`.
- [ ] Bắt lỗi bằng Custom Exception nghiệp vụ xử lý qua `GlobalExceptionHandler`.
- [ ] Mọi thay đổi bảng/cột đều có file Flyway migration mới (`V{n}__...sql`).
- [ ] Logic đặt lịch (booking) được bảo vệ an toàn trước tranh chấp đồng thời (concurrency safe).
- [ ] Đạt tối thiểu **80% line và branch coverage** đo bởi JaCoCo (`mvn clean verify`).
- [ ] Không chứa cảnh báo bảo mật, không hardcode secret/password, không log thông tin nhạy cảm.
