import imageCompression from "browser-image-compression";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateProfileImage(file: File): string | null {
  if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
    return "invalidImageType";
  }
  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return "fileTooLarge";
  }
  return null;
}

export async function compressProfileImage(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 256,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressed);
  });
}
