// Shared validation for image uploads (used by /api/imgbb).
// Keep these limits in sync with src/components/image-upload.tsx.

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Validates a file before it is forwarded to ImgBB.
 * Returns an error message, or null when the file is acceptable.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPG, PNG, WEBP or GIF.";
  }

  if (file.size === 0) {
    return "The selected file is empty.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}
