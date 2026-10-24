# 01 - Clean Code & Quy Ước Java (Server)

## 1. Quy Định Bắt Buộc

- **PHẢI** tận dụng các tính năng Java 21 hiện đại: `record` cho DTO không đổi, pattern matching, switch expressions.
- **PHẢI** đặt tên class, method, biến mang ý nghĩa kinh doanh rõ ràng; phương thức ngắn và chỉ thực hiện một việc duy nhất.
- **KHÔNG ĐƯỢC** trả về `null` cho danh sách/mảng; **PHẢI** trả về `Collections.emptyList()` hoặc `List.of()`.
- **PHẢI** dùng `Optional<T>` khi phương thức có thể không tìm thấy kết quả đơn lẻ; **CẤM** lạm dụng `Optional` làm tham số đầu vào của method.
- **KHÔNG ĐƯỢC** để magic number/string; **PHẢI** khai báo `public static final` hoặc `enum`.
- **PHẢI** dùng `@Slf4j` (SLF4J) để log thông tin; **TUYỆT ĐỐI CẤM** dùng `System.out.println()` hay `e.printStackTrace()`.
- **TUYỆT ĐỐI CẤM** ghi log thông tin nhạy cảm: mật khẩu, JWT token, mã OTP, thông tin thẻ thanh toán.

---

## 2. Ví Dụ Cụ Thể

### Tránh Null & Xử Lý Collections
```java
// ❌ SAI: Trả về null khi không có dữ liệu, dùng System.out.println
public List<Product> getAvailableDresses() {
    System.out.println("Dang lay danh sach vay...");
    if (list.isEmpty()) return null; // gây NullPointerException cho bên gọi
    return list;
}

// ✅ ĐÚNG: Trả về empty collection an toàn, log bằng SLF4J
@Slf4j
public List<ProductResponse> getAvailableDresses() {
    log.info("Lấy danh sách váy sẵn sàng cho thuê");
    if (dresses.isEmpty()) {
        return Collections.emptyList();
    }
    return dresses.stream().map(productMapper::toResponse).toList();
}
```

### Sử Dụng Java Record Cho DTO Bất Biến (Immutable)
```java
// ✅ ĐÚNG: Dùng Java record cho Request/Response DTO
public record CreateBookingRequest(
    @NotNull(message = "ID khách hàng không được để trống")
    Long customerId,

    @NotNull(message = "Ngày bắt đầu thuê không được để trống")
    @FutureOrPresent(message = "Ngày thuê không thể ở quá khứ")
    LocalDate rentalDate,

    @NotEmpty(message = "Danh sách trang phục thuê không được rỗng")
    List<Long> itemIds
) {}
```
