package com.chickiestudio.upload.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.upload.dto.UploadResponse;
import com.chickiestudio.upload.service.UploadService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UploadController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UploadService uploadService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("Admin upload ảnh đơn lẻ thành công - 201 Created")
    @WithMockUser(roles = "ADMIN")
    void uploadImage_success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "dress.jpg",
                "image/jpeg",
                "image bytes".getBytes()
        );

        UploadResponse response = UploadResponse.builder()
                .url("/uploads/images/unique-dress.jpg")
                .filename("unique-dress.jpg")
                .size(1024)
                .contentType("image/jpeg")
                .build();

        when(uploadService.uploadImage(any())).thenReturn(response);

        mockMvc.perform(multipart("/api/admin/uploads/images").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.url").value("/uploads/images/unique-dress.jpg"))
                .andExpect(jsonPath("$.data.filename").value("unique-dress.jpg"));
    }

    @Test
    @DisplayName("Admin upload nhiều ảnh batch thành công - 201 Created")
    @WithMockUser(roles = "STAFF")
    void uploadImages_batch_success() throws Exception {
        MockMultipartFile file1 = new MockMultipartFile("files", "d1.jpg", "image/jpeg", "b1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("files", "d2.png", "image/png", "b2".getBytes());

        List<UploadResponse> responses = List.of(
                UploadResponse.builder().url("/uploads/images/d1.jpg").filename("d1.jpg").build(),
                UploadResponse.builder().url("/uploads/images/d2.png").filename("d2.png").build()
        );

        when(uploadService.uploadImages(any())).thenReturn(responses);

        mockMvc.perform(multipart("/api/admin/uploads/images/batch").file(file1).file(file2))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    @DisplayName("Chưa xác thực upload ảnh bị từ chối - 401 Unauthorized")
    void uploadImage_unauthorized() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "dress.jpg", "image/jpeg", "image bytes".getBytes());

        mockMvc.perform(multipart("/api/admin/uploads/images").file(file))
                .andExpect(status().isUnauthorized());
    }
}
