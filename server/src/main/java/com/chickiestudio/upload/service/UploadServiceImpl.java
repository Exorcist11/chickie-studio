package com.chickiestudio.upload.service;

import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.util.SlugUtils;
import com.chickiestudio.upload.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    @Value("${chickie.upload.dir:uploads}")
    private String uploadBaseDir;

    @Override
    public UploadResponse uploadImage(MultipartFile file) {
        validateImageFile(file);

        try {
            Path targetDir = Paths.get(uploadBaseDir, "images").toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            String originalFilename = StringUtils.cleanPath(
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg"
            );
            String extension = "";
            String baseName = originalFilename;
            int dotIdx = originalFilename.lastIndexOf('.');
            if (dotIdx > 0) {
                extension = originalFilename.substring(dotIdx).toLowerCase();
                baseName = originalFilename.substring(0, dotIdx);
            }

            String safeBaseName = SlugUtils.toSlug(baseName);
            if (!StringUtils.hasText(safeBaseName)) {
                safeBaseName = "product-image";
            }

            String uniqueFilename = UUID.randomUUID() + "-" + safeBaseName + extension;
            Path destinationFile = targetDir.resolve(uniqueFilename).normalize();

            // Security check against directory traversal
            if (!destinationFile.getParent().equals(targetDir)) {
                throw new BadRequestException("Không thể lưu file ngoài thư mục chỉ định");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("Saved image successfully: {} (size: {} bytes)", uniqueFilename, file.getSize());

            String publicUrl = "/uploads/images/" + uniqueFilename;
            return UploadResponse.builder()
                    .url(publicUrl)
                    .filename(uniqueFilename)
                    .size(file.getSize())
                    .contentType(file.getContentType())
                    .build();

        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new BadRequestException("Lỗi lưu trữ tệp tin: " + e.getMessage());
        }
    }

    @Override
    public List<UploadResponse> uploadImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("Danh sách file tải lên không được rỗng");
        }

        List<UploadResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            responses.add(uploadImage(file));
        }
        return responses;
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn tệp hình ảnh để tải lên");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Kích thước tệp vượt quá giới hạn cho phép (tối đa 5MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, GIF");
        }
    }
}
