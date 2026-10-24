package com.chickiestudio.category.dto;

import com.chickiestudio.category.entity.CategoryType;
import java.time.LocalDateTime;

public record CategoryResponse(
    Long id,
    String name,
    String slug,
    CategoryType type,
    String description,
    String iconUrl,
    int displayOrder,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public CategoryResponse(Long id, String name, String slug, String description, String iconUrl, int displayOrder, boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this(id, name, slug, CategoryType.COSTUME, description, iconUrl, displayOrder, isActive, createdAt, updatedAt);
    }
}
