import {
  MAX_IMAGE_SIZE,
  validateImageFile,
} from "@/lib/apis/upload/imgbb";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

interface ImgbbUploadResponse {
  success?: boolean;
  error?: { message?: string };
  data?: {
    display_url?: string;
    url?: string;
  };
}

console.log("IMAGE UPLOAD API CALLED");
export async function POST(request: Request) {
  // Uploads are intentionally anonymous: the sign-up form needs them before
  // an account exists. The ImgBB key stays server-side either way.
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    // Keep configuration details in the server log; never expose them to the client.
    console.error(
      "[image-upload] IMGBB_API_KEY is missing. Add it to .env and restart the dev server.",
    );

    return Response.json(
      { error: "Image upload is temporarily unavailable. Please try again later." },
      { status: 500 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Please choose an image to upload." }, { status: 400 });
  }

  const image = formData.get("image");

  if (!(image instanceof File)) {
    return Response.json({ error: "Please choose an image to upload." }, { status: 400 });
  }

  const validationError = validateImageFile(image);

  if (validationError) {
    const status = image.size > MAX_IMAGE_SIZE ? 413 : 400;
    return Response.json({ error: validationError }, { status });
  }

  const uploadData = new FormData();
  uploadData.append("image", image);

  let response: Response;

  try {
    // No expiration parameter: uploaded images stay available permanently.
    response = await fetch(
      `${IMGBB_UPLOAD_URL}?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );
  } catch {
    return Response.json(
      { error: "Could not reach the image service. Check your connection and try again." },
      { status: 502 },
    );
  }

  const result = (await response
    .json()
    .catch(() => null)) as ImgbbUploadResponse | null;
  const imageUrl = result?.data?.display_url ?? result?.data?.url;

  if (!response.ok || !result?.success || !imageUrl) {
    console.error(
      `[image-upload] ImgBB rejected the upload (status ${response.status}):`,
      result?.error?.message ?? "no error message returned",
    );

    return Response.json(
      { error: "Could not upload the image. Please try again." },
      { status: 502 },
    );
  }

  // `url` is what the client helper reads; `imageUrl` kept as an alias.
  return Response.json({ url: imageUrl, imageUrl });
}