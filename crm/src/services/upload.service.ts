import { apiClient } from "./apiClient";

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadResponse>(
      "/api/admin/uploads/images",
      formData
    );

    return response.data.url;
  },

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await apiClient.post<UploadResponse[]>(
      "/api/admin/uploads/images/batch",
      formData
    );

    return response.data.map((item) => item.url);
  },
};
