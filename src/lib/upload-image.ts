import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";   
import { env } from "~/env";

const accessKeyId = env.R2_UPLOAD_IMAGE_ACCESS_KEY_ID;
const secretAccessKey = env.R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY;
if (!accessKeyId || !secretAccessKey) throw new Error("Missing R2 credentials");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

// Set this in .env (examples below)
const PUBLIC_BASE =
  env.R2_PUBLIC_BASE_URL // e.g. https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
  ?? `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_UPLOAD_IMAGE_BUCKET_NAME}`;

export const uploadImageAssets = async (
  buffer: Buffer,
  key: string,
  contentType: string,
) => {
  await r2.send(new PutObjectCommand({
    Bucket: env.R2_UPLOAD_IMAGE_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
    ACL: "public-read",
  }));
  return `${PUBLIC_BASE}/${key}`;
};
