package com.chickiestudio.product.service.impl;

import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.dto.CreateItemRequest;
import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.dto.UpdateItemStatusRequest;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.mapper.ProductItemMapper;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import com.chickiestudio.product.service.ProductItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductItemServiceImpl implements ProductItemService {

    private final ProductItemRepository productItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductItemMapper productItemMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductItemResponse> getItemsByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + productId);
        }
        List<ProductItem> items = productItemRepository.findByVariantProductIdOrderByIdAsc(productId);
        return productItemMapper.toResponseList(items);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductItemResponse> getItemsByVariant(Long variantId) {
        if (!productVariantRepository.existsById(variantId)) {
            throw new ResourceNotFoundException("Không tìm thấy biến thể với ID: " + variantId);
        }
        List<ProductItem> items = productItemRepository.findByVariantIdOrderByIdAsc(variantId);
        return productItemMapper.toResponseList(items);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductItemResponse getItemById(Long id) {
        ProductItem item = productItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ vật lý với ID: " + id));
        return productItemMapper.toResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductItemResponse getItemByCode(String itemCode) {
        ProductItem item = productItemRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ vật lý với mã: " + itemCode));
        return productItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public ProductItemResponse createItem(Long variantId, CreateItemRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể với ID: " + variantId));

        String itemCode = (request != null && request.itemCode() != null && !request.itemCode().trim().isEmpty())
                ? request.itemCode().trim().toUpperCase()
                : generateItemCode(variantId);

        if (productItemRepository.existsByItemCode(itemCode)) {
            throw new ConflictException("Mã đồ vật lý đã tồn tại trong hệ thống: " + itemCode);
        }

        ProductItemStatus status = (request != null && request.status() != null)
                ? request.status()
                : ProductItemStatus.AVAILABLE;

        String note = (request != null) ? request.note() : null;

        ProductItem item = ProductItem.builder()
                .variant(variant)
                .itemCode(itemCode)
                .status(status)
                .rentalCount(0)
                .note(note)
                .build();

        ProductItem saved = productItemRepository.save(item);
        log.info("Thêm mới món đồ vật lý thành công: itemCode={}, variantId={}", saved.getItemCode(), variantId);
        return productItemMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProductItemResponse updateItemStatus(Long id, UpdateItemStatusRequest request) {
        ProductItem item = productItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ vật lý với ID: " + id));

        ProductItemStatus currentStatus = item.getStatus();
        ProductItemStatus targetStatus = request.status();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new BadRequestException(String.format(
                    "Không thể chuyển đổi trạng thái món đồ từ %s sang %s theo quy tắc vòng đời",
                    currentStatus, targetStatus
            ));
        }

        // Tự động tăng số lần thuê khi món đồ kết thúc chu kỳ thuê (từ RENTED -> LAUNDRY)
        if (currentStatus == ProductItemStatus.RENTED && targetStatus == ProductItemStatus.LAUNDRY) {
            item.incrementRentalCount();
            log.info("Món đồ {} hoàn thành 1 lượt thuê, rentalCount tăng lên {}", item.getItemCode(), item.getRentalCount());
        }

        item.setStatus(targetStatus);
        if (request.note() != null) {
            item.setNote(request.note());
        }

        ProductItem updated = productItemRepository.save(item);
        log.info("Cập nhật trạng thái món đồ {} sang {}", updated.getItemCode(), targetStatus);
        return productItemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteItem(Long id) {
        ProductItem item = productItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ vật lý với ID: " + id));

        if (item.getStatus() == ProductItemStatus.RENTED) {
            throw new BadRequestException("Không thể xóa món đồ đang trong trạng thái cho thuê (RENTED)");
        }

        productItemRepository.delete(item);
        log.info("Xóa thành công món đồ vật lý: ID={}, itemCode={}", id, item.getItemCode());
    }

    @Override
    @Transactional(readOnly = true)
    public String generateItemCode(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể với ID: " + variantId));

        String prefix = variant.getSku() != null ? variant.getSku().toUpperCase() : "CK-ITEM";
        long count = productItemRepository.countByVariantId(variantId);
        long sequence = count + 1;

        String candidateCode = String.format("%s-%02d", prefix, sequence);
        while (productItemRepository.existsByItemCode(candidateCode)) {
            sequence++;
            candidateCode = String.format("%s-%02d", prefix, sequence);
        }
        return candidateCode;
    }
}
