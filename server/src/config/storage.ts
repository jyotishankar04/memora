import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  // The SDK defaults to signing a flexible-checksum header on every request.
  // For a presigned URL that's computed against an empty body (the real
  // bytes don't exist yet at sign time), so the client's actual PUT never
  // matches it and R2 rejects the upload with 403. PutObject doesn't need
  // this, so only compute a checksum when an API explicitly requires one.
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const R2_BUCKET_NAME = env.R2_BUCKET_NAME;
export const R2_PUBLIC_URL = env.R2_PUBLIC_URL.replace(/\/$/, "");
