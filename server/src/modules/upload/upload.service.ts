import { randomUUID } from "crypto";
import { extname } from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, s3 } from "../../config/storage";

export interface UploadedFile {
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

export async function uploadToStorage(file: Express.Multer.File): Promise<UploadedFile> {
  const key = `${randomUUID()}${extname(file.originalname)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    fileUrl: `${R2_PUBLIC_URL}/${key}`,
    mimeType: file.mimetype,
    fileSize: file.size,
  };
}
