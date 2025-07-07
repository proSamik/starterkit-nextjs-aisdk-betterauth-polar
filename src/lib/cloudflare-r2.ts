import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 client configuration using S3-compatible API
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Upload a file to Cloudflare R2 and return the public URL
 */
export async function uploadFileToR2(
  file: Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  bucketName: string = process.env.CLOUDFLARE_R2_BUCKET_NAME!,
): Promise<{ url: string; key: string }> {
  const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (!publicUrlBase) {
    throw new Error(
      "CLOUDFLARE_R2_PUBLIC_URL environment variable is not set.",
    );
  }

  // Generate unique key with timestamp and random suffix
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const key = `uploads/${timestamp}-${randomSuffix}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL - adjust based on your R2 configuration
  const publicUrl = `${publicUrlBase}/${key}`;

  return { url: publicUrl, key };
}

/**
 * Generate a presigned URL for downloading a file from R2
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600,
  bucketName: string = process.env.CLOUDFLARE_R2_BUCKET_NAME!,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Supported file types for upload
 */
export const SUPPORTED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: ["application/pdf", "text/plain"],
} as const;

/**
 * Check if file type is supported
 */
export function isSupportedFileType(contentType: string): boolean {
  return [
    ...SUPPORTED_FILE_TYPES.images,
    ...SUPPORTED_FILE_TYPES.documents,
  ].includes(contentType as any);
}
