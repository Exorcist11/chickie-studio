package com.chickiestudio.content.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeaturedServiceDto {
    private String key;
    private String title;
    private String description;
    private String imageUrl;
    private String link;
}
