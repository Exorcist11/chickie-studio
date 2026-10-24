import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadService } from "./upload.service";
import { apiClient } from "./apiClient";

describe("uploadService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uploadImage calls /api/admin/uploads/images with FormData and returns url", async () => {
    const mockResponse = {
      code: 200,
      message: "Tải ảnh lên thành công",
      data: {
        url: "/uploads/images/dress.jpg",
        filename: "dress.jpg",
        size: 1024,
        contentType: "image/jpeg",
      },
      timestamp: "2026-10-24T20:00:00",
    };

    vi.spyOn(apiClient, "post").mockResolvedValue(mockResponse);

    const file = new File(["dummy content"], "dress.jpg", { type: "image/jpeg" });
    const resultUrl = await uploadService.uploadImage(file);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/admin/uploads/images",
      expect.any(FormData)
    );
    expect(resultUrl).toBe("/uploads/images/dress.jpg");
  });

  it("uploadImages calls /api/admin/uploads/images/batch and returns array of urls", async () => {
    const mockResponse = {
      code: 200,
      message: "Tải danh sách ảnh thành công",
      data: [
        { url: "/uploads/images/d1.jpg", filename: "d1.jpg", size: 100, contentType: "image/jpeg" },
        { url: "/uploads/images/d2.jpg", filename: "d2.jpg", size: 200, contentType: "image/jpeg" },
      ],
      timestamp: "2026-10-24T20:00:00",
    };

    vi.spyOn(apiClient, "post").mockResolvedValue(mockResponse);

    const files = [
      new File(["content1"], "d1.jpg", { type: "image/jpeg" }),
      new File(["content2"], "d2.jpg", { type: "image/jpeg" }),
    ];
    const urls = await uploadService.uploadImages(files);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/admin/uploads/images/batch",
      expect.any(FormData)
    );
    expect(urls).toEqual(["/uploads/images/d1.jpg", "/uploads/images/d2.jpg"]);
  });
});
