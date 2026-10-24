package com.chickiestudio.upload.service;

import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.upload.dto.UploadResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UploadServiceTest {

    private UploadServiceImpl uploadService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        uploadService = new UploadServiceImpl();
        ReflectionTestUtils.setField(uploadService, "uploadBaseDir", tempDir.toString());
    }

    @Test
    @DisplayName("Upload ảnh hợp lệ thành công")
    void uploadImage_success() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-dress.png",
                "image/png",
                "dummy image content".getBytes()
        );

        UploadResponse response = uploadService.uploadImage(file);

        assertThat(response).isNotNull();
        assertThat(response.getUrl()).startsWith("/uploads/images/");
        assertThat(response.getFilename()).contains("test-dress.png");
        assertThat(response.getSize()).isEqualTo(file.getSize());
        assertThat(response.getContentType()).isEqualTo("image/png");
    }

    @Test
    @DisplayName("Upload file rỗng ném BadRequestException")
    void uploadImage_emptyFile_throwsBadRequest() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.png",
                "image/png",
                new byte[0]
        );

        assertThatThrownBy(() -> uploadService.uploadImage(file))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Vui lòng chọn tệp hình ảnh");
    }

    @Test
    @DisplayName("Upload file vượt quá 5MB ném BadRequestException")
    void uploadImage_fileTooLarge_throwsBadRequest() {
        byte[] largeBytes = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.jpg",
                "image/jpeg",
                largeBytes
        );

        assertThatThrownBy(() -> uploadService.uploadImage(file))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("vượt quá giới hạn cho phép");
    }

    @Test
    @DisplayName("Upload file định dạng không hỗ trợ (PDF) ném BadRequestException")
    void uploadImage_invalidType_throwsBadRequest() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                "some pdf content".getBytes()
        );

        assertThatThrownBy(() -> uploadService.uploadImage(file))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Định dạng tệp không được hỗ trợ");
    }

    @Test
    @DisplayName("Upload nhiều ảnh thành công")
    void uploadImages_batch_success() {
        MockMultipartFile file1 = new MockMultipartFile("files", "img1.jpg", "image/jpeg", "content 1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("files", "img2.webp", "image/webp", "content 2".getBytes());

        List<UploadResponse> responses = uploadService.uploadImages(List.of(file1, file2));

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getContentType()).isEqualTo("image/jpeg");
        assertThat(responses.get(1).getContentType()).isEqualTo("image/webp");
    }

    @Test
    @DisplayName("Upload danh sách rỗng ném BadRequestException")
    void uploadImages_emptyList_throwsBadRequest() {
        assertThatThrownBy(() -> uploadService.uploadImages(Collections.emptyList()))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Danh sách file tải lên không được rỗng");
    }
}
