import { type AuthOptions, getAuth as getAuthBase } from "@app/data-ops/auth";

export type { auth } from "@app/data-ops/auth";

export function getAuth(r2: R2Bucket) {
  return getAuthBase({
    onOAuthUserCreated: {
      uploadAvatarToR2: async (userId, imageUrl) => {
        try {
          const res = await fetch(imageUrl);
          if (!res.ok) return null;
          const buffer = await res.arrayBuffer();
          const key = `profile-pictures/${userId}.webp`;
          await r2.put(key, buffer, {
            httpMetadata: {
              contentType: res.headers.get("content-type") || "image/jpeg",
              cacheControl: "public, max-age=31536000",
            },
          });
          return `${process.env.ASSETS_URL}/${key}?v=${Date.now()}`;
        } catch {
          return null;
        }
      },
    },
  });
}
