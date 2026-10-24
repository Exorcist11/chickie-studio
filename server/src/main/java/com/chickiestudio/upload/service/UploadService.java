package com.chickiestudio.upload.service;

import com.chickiestudio.upload.dto.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UploadService {
    UploadResponse uploadImage(MultipartFile file);
    List<UploadResponse> uploadImages(List<MultipartFile> files);
}
