package com.chickiestudio.content.controller;

import com.chickiestudio.common.dto.ApiResponse;
import com.chickiestudio.content.dto.HomeFeaturedResponse;
import com.chickiestudio.content.service.HomeFeaturedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/home")
@RequiredArgsConstructor
public class PublicHomeController {

    private final HomeFeaturedService homeFeaturedService;

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<HomeFeaturedResponse>> getHomeFeatured() {
        HomeFeaturedResponse response = homeFeaturedService.getHomeFeaturedData();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
