import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_IMAGE_BUCKET = "product-images";

/** A value in products.image_url that points to our private storage bucket
 *  is stored as `storage:<object-path>`. Anything else (http(s)://, /assets/...)
 *  is treated as a direct URL and returned as-is. */
const PREFIX = "storage:";

export function isStorageRef(value: string | null | undefined): boolean {
  return !!value && value.startsWith(PREFIX);
}

export function toStorageRef(path: string): string {
  return `${PREFIX}${path}`;
}

export function storagePathFromRef(value: string): string {
  return value.startsWith(PREFIX) ? value.slice(PREFIX.length) : value;
}

/** Resolve a stored image_url to a URL the browser can load.
 *  Direct URLs pass through; storage refs become signed URLs. */
export async function resolveImageUrl(value: string | null | undefined): Promise<string> {
  if (!value) return "";
  if (!isStorageRef(value)) return value;
  const path = storagePathFromRef(value);
  const { data, error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .createSignedUrl(path, 60 * 60); // 1h, refreshed on each page load
  if (error || !data) return "";
  return data.signedUrl;
}

export async function resolveImageUrls(values: (string | null | undefined)[]): Promise<string[]> {
  return Promise.all(values.map(resolveImageUrl));
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const name = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(name, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return toStorageRef(name);
}
