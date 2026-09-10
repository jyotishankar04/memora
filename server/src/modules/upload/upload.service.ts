import { randomUUID } from "crypto";
import { extname } from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3 } from "../../config/storage";
import { PlanLimitType } from "../../db/enums";
import { assertWithinLimit } from "../plans/plans.service";
import type { PresignUploadInput } from "./upload.schema";

export interface PresignedUpload {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

const PRESIGN_EXPIRES_SECONDS = 300; // 5 minutes

// Client PUTs the file straight to R2 with this URL — the file bytes never
// touch our server. The presigned URL is signed for this exact ContentType,
// so R2 rejects the PUT if the client sends a different one.
export async function createPresignedUpload(userId: string, input: PresignUploadInput): Promise<PresignedUpload> {
  // Checked here (not at attachment-creation time) — this is the moment we
  // know the intended file size, before any bytes are actually sent to R2.
  const deltaMb = Math.ceil(input.fileSize / (1024 * 1024));
  await assertWithinLimit(userId, PlanLimitType.STORAGE_MB, deltaMb);

  const key = `${randomUUID()}${extname(input.filename)}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: input.mimeType,
  });

  // signableHeaders forces content-type into the signature (it isn't signed
  // by default — only x-amz-* headers are) — without this, R2 accepts a PUT
  // with any Content-Type, silently ignoring the one we signed for.
  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: PRESIGN_EXPIRES_SECONDS,
    signableHeaders: new Set(["content-type"]),
  });

  return {
    uploadUrl,
    fileUrl: `${R2_PUBLIC_URL}/${key}`,
    key,
  };
}
