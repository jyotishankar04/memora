const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export interface UploadedFile {
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

/**
 * Uploads a file to the backend's /uploads endpoint. Can't reuse apiFetch here:
 * it force-sets Content-Type: application/json, which breaks multipart's
 * auto-generated boundary header — the browser must set that itself.
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Upload failed. Please try again.");
  }

  return body.data as UploadedFile;
}
