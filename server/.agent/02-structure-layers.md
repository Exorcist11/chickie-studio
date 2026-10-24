# 02 - Kiến Trúc Phân Tầng & Package Theo Feature (Server)

## 1. Cấu Trúc Package Theo Feature

```text
com.chickiestudio/
├── common/                  # TÁI SỬ DỤNG CHUNG: ApiResponse, BaseEntity, Exceptions, SecurityUtils
├── auth/                    # Xác thực, JWT, Refresh Token
├── user/                    # Quản lý tài khoản nội bộ (Admin, Staff)
├── customer/                # Quản lý khách hàng thuê đồ
├── category/                # Danh mục sản phẩm (Váy dạ hội, Áo dài, Phụ kiện, Máy ảnh)
├── product/                 # Quản lý trang phục & thiết bị
├── combo/                   # Gói combo chụp ảnh / combo váy + máy ảnh
├── booking/                 # Nghiệp vụ đặt lịch giữ đồ, trả đồ, cọc
├── payment/                 # Tích hợp cổng thanh toán, biên nhận cọc
└── report/                  # Báo cáo doanh thu, tần suất thuê đồ
```

Mỗi feature package bao gồm: `controller`, `service` (interface + impl nếu cần), `repository`, `entity`, `dto`, `mapper`.

---

## 2. Quy Tắc Phân Tầng Nghiêm Ngặt

- **Controller**: **CHỈ** tiếp nhận HTTP request, validate tham số (`@Valid`), ủy quyền xử lý cho Service và trả về `ApiResponse<T>`. **KHÔNG ĐƯỢC** viết logic nghiệp vụ tại Controller.
- **Service**: Nơi duy nhất chứa nghiệp vụ kinh doanh, tính toán giá thuê, kiểm tra xung đột lịch và quản lý transaction.
- **Repository**: **CHỈ** thực hiện truy vấn DB. **KHÔNG ĐƯỢC** chứa logic nghiệp vụ.
- **TUYỆT ĐỐI CẤM** trả thẳng `Entity` ra Controller/Client; **PHẢI** ánh xạ sang `Response DTO`.
- Mọi Entity **PHẢI** kế thừa `BaseEntity` trong package `common` để tự động ghi nhận `createdAt`, `updatedAt`.

---

## 3. Ví Dụ Cụ Thể

```java
// ❌ SAI: Viết nghiệp vụ tính toán và lưu trực tiếp trong Controller, trả Entity
@RestController
public class BookingController {
    @Autowired private BookingRepository bookingRepo;

    @PostMapping("/bookings")
    public BookingEntity create(@RequestBody BookingEntity entity) {
        entity.setTotalPrice(entity.getDailyRate() * 3); // CẤM: nghiệp vụ ở Controller
        return bookingRepo.save(entity);                // CẤM: trả Entity ra ngoài
    }
}

// ✅ ĐÚNG: Phân tầng rõ ràng, Controller chỉ ủy quyền cho Service
@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody CreateBookingRequest request) {
        BookingResponse result = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(result));
    }
}
```
