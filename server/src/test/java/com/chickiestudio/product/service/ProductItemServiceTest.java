package com.chickiestudio.product.service;

import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.dto.CreateItemRequest;
import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.dto.UpdateItemStatusRequest;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.mapper.ProductItemMapper;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import com.chickiestudio.product.service.impl.ProductItemServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductItemServiceTest {

    @Mock
    private ProductItemRepository productItemRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductItemMapper productItemMapper;

    @InjectMocks
    private ProductItemServiceImpl productItemService;

    private Product sampleProduct;
    private ProductVariant sampleVariant;
    private ProductItem sampleItem;
    private ProductItemResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleProduct = Product.builder()
                .id(1L)
                .productCode("CK-DR-001")
                .name("Váy Dạ Hội Ruby")
                .build();

        sampleVariant = ProductVariant.builder()
                .id(10L)
                .product(sampleProduct)
                .size("S")
                .color("Đỏ Ruby")
                .sku("CK-DR-001-S-RED")
                .build();

        sampleItem = ProductItem.builder()
                .id(100L)
                .variant(sampleVariant)
                .itemCode("CK-DR-001-S-RED-01")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(2)
                .note("Hàng trưng bày studio")
                .build();

        sampleResponse = ProductItemResponse.builder()
                .id(100L)
                .variantId(10L)
                .variantSize("S")
                .variantColor("Đỏ Ruby")
                .variantSku("CK-DR-001-S-RED")
                .productId(1L)
                .productName("Váy Dạ Hội Ruby")
                .productCode("CK-DR-001")
                .itemCode("CK-DR-001-S-RED-01")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(2)
                .note("Hàng trưng bày studio")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("getItemsByProduct: Thành công khi sản phẩm tồn tại")
    void getItemsByProduct_Success() {
        when(productRepository.existsById(1L)).thenReturn(true);
        when(productItemRepository.findByVariantProductIdOrderByIdAsc(1L)).thenReturn(List.of(sampleItem));
        when(productItemMapper.toResponseList(anyList())).thenReturn(List.of(sampleResponse));

        List<ProductItemResponse> results = productItemService.getItemsByProduct(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("CK-DR-001-S-RED-01", results.get(0).itemCode());
        verify(productRepository).existsById(1L);
    }

    @Test
    @DisplayName("getItemsByProduct: Ném ResourceNotFoundException khi sản phẩm không tồn tại")
    void getItemsByProduct_NotFound() {
        when(productRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> productItemService.getItemsByProduct(999L));
        verify(productItemRepository, never()).findByVariantProductIdOrderByIdAsc(anyLong());
    }

    @Test
    @DisplayName("getItemsByVariant: Thành công khi biến thể tồn tại")
    void getItemsByVariant_Success() {
        when(productVariantRepository.existsById(10L)).thenReturn(true);
        when(productItemRepository.findByVariantIdOrderByIdAsc(10L)).thenReturn(List.of(sampleItem));
        when(productItemMapper.toResponseList(anyList())).thenReturn(List.of(sampleResponse));

        List<ProductItemResponse> results = productItemService.getItemsByVariant(10L);

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(productVariantRepository).existsById(10L);
    }

    @Test
    @DisplayName("getItemsByVariant: Ném ResourceNotFoundException khi biến thể không tồn tại")
    void getItemsByVariant_NotFound() {
        when(productVariantRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> productItemService.getItemsByVariant(999L));
        verify(productItemRepository, never()).findByVariantIdOrderByIdAsc(anyLong());
    }

    @Test
    @DisplayName("getItemById: Thành công khi id tồn tại")
    void getItemById_Success() {
        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));
        when(productItemMapper.toResponse(sampleItem)).thenReturn(sampleResponse);

        ProductItemResponse result = productItemService.getItemById(100L);

        assertNotNull(result);
        assertEquals("CK-DR-001-S-RED-01", result.itemCode());
    }

    @Test
    @DisplayName("getItemById: Ném ResourceNotFoundException khi id không tồn tại")
    void getItemById_NotFound() {
        when(productItemRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productItemService.getItemById(999L));
    }

    @Test
    @DisplayName("getItemByCode: Thành công khi itemCode tồn tại")
    void getItemByCode_Success() {
        when(productItemRepository.findByItemCode("CK-DR-001-S-RED-01")).thenReturn(Optional.of(sampleItem));
        when(productItemMapper.toResponse(sampleItem)).thenReturn(sampleResponse);

        ProductItemResponse result = productItemService.getItemByCode("CK-DR-001-S-RED-01");

        assertNotNull(result);
        assertEquals(100L, result.id());
    }

    @Test
    @DisplayName("createItem: Tự động sinh mã barcode khi không truyền itemCode")
    void createItem_AutoGenerateCode_Success() {
        CreateItemRequest request = new CreateItemRequest(null, ProductItemStatus.AVAILABLE, "Hàng mới nhập");
        when(productVariantRepository.findById(10L)).thenReturn(Optional.of(sampleVariant));
        when(productItemRepository.countByVariantId(10L)).thenReturn(0L);
        when(productItemRepository.existsByItemCode("CK-DR-001-S-RED-01")).thenReturn(false);
        when(productItemRepository.save(any(ProductItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productItemMapper.toResponse(any(ProductItem.class))).thenReturn(sampleResponse);

        ProductItemResponse created = productItemService.createItem(10L, request);

        assertNotNull(created);
        verify(productItemRepository).save(any(ProductItem.class));
    }

    @Test
    @DisplayName("createItem: Thêm thành công với mã tùy chỉnh")
    void createItem_CustomCode_Success() {
        CreateItemRequest request = new CreateItemRequest("CUSTOM-CODE-01", ProductItemStatus.AVAILABLE, "Ghi chú");
        when(productVariantRepository.findById(10L)).thenReturn(Optional.of(sampleVariant));
        when(productItemRepository.existsByItemCode("CUSTOM-CODE-01")).thenReturn(false);
        when(productItemRepository.save(any(ProductItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productItemMapper.toResponse(any(ProductItem.class))).thenReturn(sampleResponse);

        ProductItemResponse created = productItemService.createItem(10L, request);

        assertNotNull(created);
        verify(productItemRepository).save(any(ProductItem.class));
    }

    @Test
    @DisplayName("createItem: Ném ConflictException khi mã đồ đã tồn tại")
    void createItem_DuplicateCode_ConflictException() {
        CreateItemRequest request = new CreateItemRequest("EXISTING-CODE", ProductItemStatus.AVAILABLE, "Ghi chú");
        when(productVariantRepository.findById(10L)).thenReturn(Optional.of(sampleVariant));
        when(productItemRepository.existsByItemCode("EXISTING-CODE")).thenReturn(true);

        assertThrows(ConflictException.class, () -> productItemService.createItem(10L, request));
        verify(productItemRepository, never()).save(any(ProductItem.class));
    }

    @Test
    @DisplayName("updateItemStatus: Chuyển đổi trạng thái hợp lệ và cập nhật ghi chú")
    void updateItemStatus_ValidTransition_Success() {
        sampleItem.setStatus(ProductItemStatus.AVAILABLE);
        UpdateItemStatusRequest request = new UpdateItemStatusRequest(ProductItemStatus.RENTED, "Khách nhận đồ");

        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));
        when(productItemRepository.save(any(ProductItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productItemMapper.toResponse(any(ProductItem.class))).thenReturn(sampleResponse);

        ProductItemResponse updated = productItemService.updateItemStatus(100L, request);

        assertNotNull(updated);
        assertEquals(ProductItemStatus.RENTED, sampleItem.getStatus());
        assertEquals("Khách nhận đồ", sampleItem.getNote());
    }

    @Test
    @DisplayName("updateItemStatus: Tự động tăng rentalCount khi chuyển từ RENTED sang LAUNDRY")
    void updateItemStatus_RentedToLaundry_IncrementsRentalCount() {
        sampleItem.setStatus(ProductItemStatus.RENTED);
        sampleItem.setRentalCount(2);
        UpdateItemStatusRequest request = new UpdateItemStatusRequest(ProductItemStatus.LAUNDRY, "Khách hoàn trả");

        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));
        when(productItemRepository.save(any(ProductItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productItemMapper.toResponse(any(ProductItem.class))).thenReturn(sampleResponse);

        productItemService.updateItemStatus(100L, request);

        assertEquals(ProductItemStatus.LAUNDRY, sampleItem.getStatus());
        assertEquals(3, sampleItem.getRentalCount());
    }

    @Test
    @DisplayName("updateItemStatus: Ném BadRequestException khi chuyển đổi trạng thái không hợp lệ")
    void updateItemStatus_InvalidTransition_BadRequestException() {
        sampleItem.setStatus(ProductItemStatus.RETIRED);
        UpdateItemStatusRequest request = new UpdateItemStatusRequest(ProductItemStatus.AVAILABLE, "Thử phục hồi");

        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));

        assertThrows(BadRequestException.class, () -> productItemService.updateItemStatus(100L, request));
        verify(productItemRepository, never()).save(any(ProductItem.class));
    }

    @Test
    @DisplayName("deleteItem: Xóa thành công khi trạng thái không phải RENTED")
    void deleteItem_Success() {
        sampleItem.setStatus(ProductItemStatus.MAINTENANCE);
        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));

        productItemService.deleteItem(100L);

        verify(productItemRepository).delete(sampleItem);
    }

    @Test
    @DisplayName("deleteItem: Ném BadRequestException khi cố xóa món đồ đang RENTED")
    void deleteItem_Rented_BadRequestException() {
        sampleItem.setStatus(ProductItemStatus.RENTED);
        when(productItemRepository.findById(100L)).thenReturn(Optional.of(sampleItem));

        assertThrows(BadRequestException.class, () -> productItemService.deleteItem(100L));
        verify(productItemRepository, never()).delete(any(ProductItem.class));
    }

    @Test
    @DisplayName("generateItemCode: Xử lý trùng lặp và tăng sequence an toàn")
    void generateItemCode_CollisionResolution() {
        when(productVariantRepository.findById(10L)).thenReturn(Optional.of(sampleVariant));
        when(productItemRepository.countByVariantId(10L)).thenReturn(1L);
        when(productItemRepository.existsByItemCode("CK-DR-001-S-RED-02")).thenReturn(true);
        when(productItemRepository.existsByItemCode("CK-DR-001-S-RED-03")).thenReturn(false);

        String code = productItemService.generateItemCode(10L);

        assertEquals("CK-DR-001-S-RED-03", code);
    }
}
