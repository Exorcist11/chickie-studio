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
public class TestimonialDto {
    private Long id;
    private String customerName;
    private String role;
    private String avatarUrl;
    private String content;
    private Integer rating;
}
