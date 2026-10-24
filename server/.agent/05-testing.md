# 05 - Kiểm Thử Tự Động & JaCoCo Coverage 80% (Server)

## 1. Quy Định Bắt Buộc

- **PHẢI** viết kiểm thử đầy đủ 3 cấp độ:
  - **Unit Test (Service)**: Dùng **JUnit 5** + **Mockito** (`@ExtendWith(MockitoExtension.class)`).
  - **Controller Test**: Dùng `@WebMvcTest` kiểm tra HTTP status code, validate DTO đầu vào, format JSON.
  - **Integration Test**: Dùng **Testcontainers MySQL** để test các câu truy vấn Repository và Lock trên DB thật.
- **Quy tắc đặt tên test**: `methodName_condition_expectedResult` (Ví dụ: `createBooking_whenItemAlreadyBooked_shouldThrowConflictException`).
- **BẮT BUỘC** viết test cho cả luồng thành công (Happy path) và các nhánh lỗi/ném ngoại lệ.
- **ĐỘ PHỦ JACOCO >= 80%**:
  - Cấu hình plugin `jacoco-maven-plugin` trong `pom.xml` với ngưỡng tối thiểu **80% LINE** và **80% BRANCH**.
  - Lệnh `mvn clean verify` **SẼ THẤT BẠI** nếu độ phủ dưới 80%.
  - Được phép loại trừ khỏi JaCoCo: `*.config.*`, `*.dto.*`, `*.entity.*`, `*Application`.
- **SỬA BUG**: **PHẢI** viết test tái hiện bug trước, sau đó mới sửa mã nguồn.

---

## 2. Lệnh Thực Thi Kiểm Tra

```bash
mvn test          # Chạy toàn bộ Unit Tests
mvn clean verify  # Chạy Unit + Integration tests và kiểm tra ngưỡng JaCoCo >= 80%
```

---

## 3. Ví Dụ Cụ Thể

```java
// ✅ ĐÚNG: Unit test Service với JUnit 5 & Mockito theo chuẩn đặt tên
@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock private ProductItemRepository itemRepository;
    @Mock private BookingRepository bookingRepository;
    @InjectMocks private BookingServiceImpl bookingService;

    @Test
    void createBooking_whenProductItemNotFound_shouldThrowResourceNotFoundException() {
        // Given
        Long nonExistentId = 999L;
        CreateBookingRequest request = new CreateBookingRequest(1L, LocalDate.now(), List.of(nonExistentId));
        when(itemRepository.findByIdWithLock(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> bookingService.createBooking(request));
        verify(bookingRepository, never()).save(any());
    }
}
```
