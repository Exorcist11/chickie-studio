package com.chickiestudio.category.dto;

import java.time.LocalDateTime;

public record CategoryResponse(
    Long id,
    String name,
    String slug,
    String description,
    String iconUrl,
    int displayOrder,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
