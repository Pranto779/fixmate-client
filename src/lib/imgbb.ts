/** Largest image accepted by the upload field (ImgBB allows up to 32 MB). */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/** Returns a user-facing error message, or null when the file is valid. */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Choose a JPEG, PNG, WebP or GIF image.";
  }

  if (file.size === 0) {
    return "The selected image is empty.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The image must be 5 MB or smaller.";
  }

  return null;
}

/**
 * Uploads through the app's own API route so the ImgBB key never reaches the
 * browser. The route enforces sign-in, the admin role and file validation.
 */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  let response: Response;

  try {
    response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Could not reach the image upload service. Check your connection and try again.",
    );
  }

  const result = (await response
    .json()
    .catch(() => null)) as { imageUrl?: string; error?: string } | null;

  if (!response.ok || !result?.imageUrl) {
    throw new Error(result?.error ?? "Could not upload the image. Please try again.");
  }

  return result.imageUrl;
}