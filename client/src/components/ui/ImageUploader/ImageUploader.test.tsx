import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ImageUploader, type UploadedFile } from "./ImageUploader";

describe("ImageUploader Component", () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test-image");
  });

  const sampleFiles: UploadedFile[] = [
    {
      uid: "1",
      name: "dress-front.jpg",
      url: "https://example.com/dress.jpg",
    },
  ];

  it("renders upload button, file list and label", () => {
    render(
      <ImageUploader
        label="Ảnh chụp căn cước / cọc"
        hint="Tối đa 4 ảnh, định dạng JPG/PNG"
        fileList={sampleFiles}
        maxCount={4}
      />
    );

    expect(screen.getByText("Ảnh chụp căn cước / cọc")).toBeInTheDocument();
    expect(screen.getByText("1/4 ảnh")).toBeInTheDocument();
    expect(screen.getByText("Tối đa 4 ảnh, định dạng JPG/PNG")).toBeInTheDocument();
    expect(screen.getByAltText("dress-front.jpg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tải ảnh lên" })).toBeInTheDocument();
  });

  it("handles remove file action", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ImageUploader fileList={sampleFiles} onChange={onChange} />);

    const removeBtn = screen.getByRole("button", { name: "Xóa ảnh dress-front.jpg" });
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("handles preview lightbox open and close", async () => {
    const user = userEvent.setup();
    render(<ImageUploader fileList={sampleFiles} />);

    const previewBtn = screen.getByRole("button", { name: "Xem ảnh dress-front.jpg" });
    await user.click(previewBtn);

    expect(screen.getByRole("dialog", { name: "Xem trước hình ảnh" })).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng xem trước" });
    await user.click(closeBtn);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hides upload button when maxCount reached", () => {
    render(<ImageUploader fileList={sampleFiles} maxCount={1} />);
    expect(screen.queryByRole("button", { name: "Tải ảnh lên" })).toBeNull();
  });

  it("handles drag and drop events", () => {
    const onChange = vi.fn();
    render(<ImageUploader fileList={[]} onChange={onChange} />);

    const dropBtn = screen.getByRole("button", { name: "Tải ảnh lên" });
    fireEvent.dragOver(dropBtn);
    fireEvent.dragLeave(dropBtn);

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    fireEvent.drop(dropBtn, {
      dataTransfer: { files: [file] },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("validates file size limit", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ImageUploader fileList={[]} maxSizeMB={1} onChange={onChange} />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const bigFile = new File([new ArrayBuffer(2 * 1024 * 1024)], "huge.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(input, { target: { files: [bigFile] } });
    expect(screen.getByRole("alert")).toHaveTextContent("vượt quá giới hạn 1MB");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ImageUploader label="Ảnh minh chứng" fileList={sampleFiles} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
