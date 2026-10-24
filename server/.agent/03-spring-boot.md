# 03 - Spring Boot, MapStruct, Bảo Mật & Concurrency (Server)

## 1. Quy Định Bắt Buộc

- **PHẢI** sử dụng **MapStruct** (`componentModel = "spring"`) để chuyển đổi giữa Entity và DTO; **CẤM** viết code copy getter/setter thủ công hàng chục dòng.
- **PHẢI** quản lý ngoại lệ tập trung qua `@RestControllerAdvice` (`GlobalExceptionHandler`); các lỗi nghiệp vụ **PHẢI** ném ngoại lệ riêng (`ResourceNotFoundException`, `ConflictException`).
- **PHẢI** đặt `@Transactional` ở tầng Service; các method chỉ đọc **PHẢI** ghi rõ `@Transactional(readOnly = true)`.
- **AN TOÀN ĐỒNG THỜI (CONCURRENCY)**: Nghiệp vụ kiểm tra trùng lịch giữ đồ (Booking) **BẮT BUỘC** dùng cơ chế khóa an toàn (Pessimistic Lock `@Lock(LockModeType.PESSIMISTIC_WRITE)` hoặc Unique Constraint) để chống Race Condition khi 2 khách đặt cùng 1 trang phục trong cùng khung giờ.
- **BẢO MẬT & API**:
  - Mã hóa mật khẩu bằng `BCryptPasswordEncoder`.
  - Phân tách rõ ràng route: `/api/public/**` (khách xem váy/combo) và `/api/admin/**` (quản trị, bắt buộc JWT role ADMIN/STAFF).
  - **TUYỆT ĐỐI CẤM** nối chuỗi native SQL; **PHẢI** dùng JPQL có bind parameter (`:param`) để chống SQL Injection.

---

## 2. Ví Dụ Cụ Thể

### Khóa Chống Trùng Lịch Đặt Thuê (Concurrency Safe)
```java
// ❌ SAI: Kiểm tra trùng lịch thông thường rồi lưu, dễ bị xung đột race condition
if (bookingRepo.existsByProductIdAndDate(productId, date)) {
    throw new ConflictException("Đã có người đặt");
}
bookingRepo.save(newBooking);

// ✅ ĐÚNG: Khóa dòng kiểm tra trạng thái khả dụng trước khi gán lịch
@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProductItem p WHERE p.id = :id")
    Optional<ProductItem> findByIdWithLock(@Param("id") Long id);
}
```

### MapStruct & Exception Tập Trung
```java
// ✅ ĐÚNG: MapStruct mapper tự sinh mã chuyển đổi
@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingResponse toResponse(Booking booking);
}

// ✅ ĐÚNG: Ném Custom Exception nghiệp vụ rõ ràng
ProductItem item = itemRepo.findByIdWithLock(itemId)
    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trang phục với ID: " + itemId));
```
