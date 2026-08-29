import { apiFetch } from "@/lib/auth";

export interface UploadedFile {
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

interface PresignedUpload {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

/**
 * Uploads a file straight to R2 via a presigned URL — the bytes never pass
 * through our server. Two steps: ask the API to sign a PUT URL for this
 * exact filename/mimeType/size, then PUT the file directly to R2 with that
 * URL. The presigned URL is signed for this exact Content-Type, so R2
 * rejects the PUT if the browser sends anything else.
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  const presigned = await apiFetch<PresignedUpload>("/uploads/presign", {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
      fileSize: file.size,
    }),
  });

  const response = await fetch(presigned.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  return {
    fileUrl: presigned.fileUrl,
    mimeType: file.type,
    fileSize: file.size,
  };
}
