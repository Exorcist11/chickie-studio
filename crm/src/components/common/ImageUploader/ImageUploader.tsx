import React, { useState, useRef } from "react";
import { Plus, Trash2, Eye, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./ImageUploader.scss";

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
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  fileList = [],
  onChange,
  maxCount = 8,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
}) => {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [...fileList];

    for (let i = 0; i < files.length; i++) {
      if (newFiles.length >= maxCount) break;
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(t("upload.fileTypeError"));
        continue;
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        setErrorMessage(t("upload.fileSizeError"));
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        uid: `${Date.now()}-${i}`,
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

  const handleRemove = (uid: string) => {
    const updated = fileList.filter((f) => f.uid !== uid);
    onChange?.(updated);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="group relative w-24 h-24 rounded-card border border-line bg-warm-white overflow-hidden shadow-sm shrink-0"
          >
            <img
              src={file.url || file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewImage(file.url || file.preview || null)}
                aria-label={`Xem ảnh ${file.name}`}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-ink transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(file.uid)}
                aria-label={`Xóa ảnh ${file.name}`}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-danger transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {fileList.length < maxCount && (
          <label className="w-24 h-24 rounded-card border-2 border-dashed border-line hover:border-burgundy bg-warm-white/60 hover:bg-warm-white transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-ink-muted hover:text-burgundy shrink-0">
            <Plus className="w-5 h-5 text-burgundy" />
            <span className="text-xs font-medium">{t("common.add")}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(",")}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="text-xs text-danger font-medium">
          {errorMessage}
        </p>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-card overflow-hidden shadow-raised p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Đóng xem trước"
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-ink/60 hover:bg-ink text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Xem trước ảnh"
              className="max-h-[80vh] w-auto object-contain rounded-btn"
            />
          </div>
        </div>
      )}
    </div>
  );
};

