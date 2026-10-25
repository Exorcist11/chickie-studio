"use client";

import * as React from "react";
import { Plus, Trash2, Eye, X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/cn";

export interface UploadedFile {
  uid: string;
  name: string;
  url?: string;
  preview?: string;
  file?: File;
}

export interface ImageUploaderProps {
  fileList?: UploadedFile[];
  onChange?: (fileList: UploadedFile[]) => void;
  maxCount?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  fileList = [],
  onChange,
  maxCount = 8,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  label,
  hint,
  disabled = false,
  className,
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    setErrorMessage(null);
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [...fileList];

    for (let i = 0; i < files.length; i++) {
      if (newFiles.length >= maxCount) {
        setErrorMessage(`Chỉ được tải lên tối đa ${maxCount} hình ảnh.`);
        break;
      }
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Định dạng tệp không được hỗ trợ. Vui lòng chọn JPG, PNG hoặc WebP.");
        continue;
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        setErrorMessage(`Kích thước ảnh vượt quá giới hạn ${maxSizeMB}MB.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        uid: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        url: previewUrl,
        preview: previewUrl,
        file,
      });
    }

    onChange?.(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && fileList.length < maxCount) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (uid: string) => {
    const updated = fileList.filter((f) => f.uid !== uid);
    onChange?.(updated);
  };

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {label && (
        <span className="text-sm font-medium text-ink flex items-center justify-between">
          <span>{label}</span>
          <span className="text-xs text-ink-muted">
            {fileList.length}/{maxCount} ảnh
          </span>
        </span>
      )}

      {/* Grid of uploaded items + drop zone */}
      <div className="flex flex-wrap items-center gap-3">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="group relative w-24 h-24 rounded-card border border-line bg-warm-white overflow-hidden shadow-xs shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.url || file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay actions on hover/focus */}
            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewImage(file.url || file.preview || null)}
                aria-label={`Xem ảnh ${file.name}`}
                className="p-1.5 rounded-full bg-warm-white/90 hover:bg-warm-white text-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burgundy"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(file.uid)}
                aria-label={`Xóa ảnh ${file.name}`}
                className="p-1.5 rounded-full bg-danger/90 hover:bg-danger text-warm-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Trigger / Dropzone Button */}
        {fileList.length < maxCount && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Tải ảnh lên"
            className={cn(
              "w-24 h-24 rounded-card border-2 border-dashed border-line flex flex-col items-center justify-center gap-1.5 text-ink-muted transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
              isDragging
                ? "border-burgundy bg-burgundy/5 text-burgundy"
                : "bg-ivory/50 hover:bg-ivory hover:border-burgundy/50 hover:text-burgundy",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            {isDragging ? (
              <UploadCloud className="w-5 h-5 animate-bounce" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span className="text-[11px] font-medium">Thêm ảnh</span>
          </button>
        )}
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        aria-label={label || "Tải ảnh lên"}
        accept={allowedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Hint and error messages */}
      {hint && !errorMessage && (
        <p className="text-xs text-ink-muted">{hint}</p>
      )}
      {errorMessage && (
        <p role="alert" className="text-xs font-medium text-danger">
          {errorMessage}
        </p>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem trước hình ảnh"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-card bg-warm-white p-2 shadow-raised"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Đóng xem trước"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ink/70 text-warm-white hover:bg-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Xem trước ảnh tải lên"
              className="max-h-[80vh] w-auto rounded object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
