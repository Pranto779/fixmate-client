"use client";

import React, { useId, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToImgbb } from "@/lib/imgbb";



type ImageUploadProps = {
  /** Hosted image URL ("" when empty). */
  value: string;
  /** Called with the ImgBB URL after a successful upload, or "" on remove. */
  onChange: (url: string) => void;
  /** Rendered as a <label> bound to the file input. */
  label?: string;
  /** Small helper text under the control. */
  hint?: string;
  /** Class for the outer wrapper. */
  className?: string;
  /** Class for the "Choose image" button. */
  buttonClassName?: string;
  /** Adds a red asterisk to the label (enforce it in the parent form). */
  required?: boolean;
  /** Shows a Remove button when a value is present. */
  allowRemove?: boolean;
  /** Reports upload start/stop so parents can disable their submit button. */
  onUploadingChange?: (uploading: boolean) => void;
  id?: string;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB — keep in sync with /api/imgbb

const DEFAULT_BUTTON_CLASSES =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#243b53] transition hover:border-[#d28b53] hover:text-[#d28b53] disabled:cursor-not-allowed disabled:opacity-60";

const ImageUpload = ({
  value,
  onChange,
  label,
  hint,
  className = "",
  buttonClassName,
  required = false,
  allowRemove = false,
  onUploadingChange,
  id,
}: ImageUploadProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Reset so choosing the same file again re-triggers the change event.
    e.target.value = "";

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);

    try {
      const url = await uploadImageToImgbb(file);
      onChange(url);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-[#243b53]"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={buttonClassName ?? DEFAULT_BUTTON_CLASSES}
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}

          {uploading
            ? "Uploading..."
            : value
              ? "Change image"
              : "Choose image"}
        </label>

        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          disabled={uploading}
          onChange={handleFileChange}
          className="sr-only"
        />

        {value ? (
          <div className="flex items-center gap-2">
            <Image
              src={value}
              alt="Selected image preview"
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg border border-stone-200 object-cover"
            />

            {allowRemove && (
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-stone-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                Remove
              </button>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400">
            <ImageIcon size={14} />
            JPG, PNG, WEBP or GIF · max 5 MB
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
      )}
    </div>
  );
};

export default ImageUpload;
