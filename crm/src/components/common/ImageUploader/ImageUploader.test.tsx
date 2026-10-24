import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageUploader } from "./ImageUploader";
import "../../../i18n";

describe("ImageUploader", () => {
  it("renders upload button when fileList length is below maxCount", () => {
    render(<ImageUploader fileList={[]} maxCount={3} />);
    expect(screen.getByText("Thêm mới")).toBeInTheDocument();
  });

  it("does not render upload button when fileList reaches maxCount", () => {
    const files = [
      { uid: "1", name: "img1.png", url: "https://example.com/1.png" },
      { uid: "2", name: "img2.png", url: "https://example.com/2.png" },
    ];
    render(<ImageUploader fileList={files} maxCount={2} />);
    expect(screen.queryByText("Thêm mới")).not.toBeInTheDocument();
  });

  it("handles file validation for invalid type and size", () => {
    // Mock URL.createObjectURL
    window.URL.createObjectURL = vi.fn(() => "blob:http://localhost/dummy");

    const handleChange = vi.fn();
    const { container } = render(
      <ImageUploader onChange={handleChange} maxSizeMB={2} allowedTypes={["image/png"]} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    // Test invalid type
    const invalidTypeFile = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [invalidTypeFile] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Định dạng file không hợp lệ!");

    // Test oversize
    const oversizeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], "huge.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [oversizeFile] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Kích thước ảnh vượt quá 5MB!");

    // Test valid file
    const validFile = new File([new ArrayBuffer(1024)], "valid.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [validFile] } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("opens preview modal on preview click", () => {
    const files = [
      { uid: "1", name: "dress.png", url: "https://example.com/dress.png" },
    ];
    render(<ImageUploader fileList={files} />);

    const previewBtn = screen.getByRole("button", { name: "Xem ảnh dress.png" });
    fireEvent.click(previewBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng xem trước" });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("removes a file on remove click", () => {
    const handleChange = vi.fn();
    const files = [
      { uid: "1", name: "dress.png", url: "https://example.com/dress.png" },
    ];
    render(<ImageUploader fileList={files} onChange={handleChange} />);

    const removeBtn = screen.getByRole("button", { name: "Xóa ảnh dress.png" });
    fireEvent.click(removeBtn);
    expect(handleChange).toHaveBeenCalledWith([]);
  });
});

