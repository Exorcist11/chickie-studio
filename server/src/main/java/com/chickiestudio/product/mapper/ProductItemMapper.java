package com.chickiestudio.product.mapper;

import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.entity.ProductItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductItemMapper {

    @Mapping(target = "variantId", source = "variant.id")
    @Mapping(target = "variantSize", source = "variant.size")
    @Mapping(target = "variantColor", source = "variant.color")
    @Mapping(target = "variantSku", source = "variant.sku")
    @Mapping(target = "productId", source = "variant.product.id")
    @Mapping(target = "productName", source = "variant.product.name")
    @Mapping(target = "productCode", source = "variant.product.productCode")
    ProductItemResponse toResponse(ProductItem item);

    List<ProductItemResponse> toResponseList(List<ProductItem> items);
}
