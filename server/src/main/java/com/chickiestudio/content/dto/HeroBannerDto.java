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
public class HeroBannerDto {
    private Integer id;
    private String title;
    private String subtitle;
    private String imageUrl;
    private String altText;
    private String ctaText;
    private String ctaLink;
}
