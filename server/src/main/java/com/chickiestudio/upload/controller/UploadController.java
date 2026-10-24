package com.chickiestudio.upload.controller;

import com.chickiestudio.common.dto.ApiResponse;
import com.chickiestudio.upload.dto.UploadResponse;
import com.chickiestudio.upload.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(@RequestParam("file") MultipartFile file) {
        UploadResponse response = uploadService.uploadImage(file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tải ảnh lên thành công", response));
    }

    @PostMapping(value = "/images/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<UploadResponse>>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<UploadResponse> responses = uploadService.uploadImages(files);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tải danh sách ảnh lên thành công", responses));
    }
}
