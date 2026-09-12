import { api } from "@/lib/auth";

/**
 * GET /memories/export doesn't return the usual {success,data,meta,error}
 * envelope — it's a raw file download — so this bypasses apiFetch/
 * apiFetchRaw entirely and talks to the configured axios instance directly,
 * the same "drop to raw axios" escape hatch lib/uploads.ts uses for its
 * presigned-URL PUT.
 */
export async function downloadMemoriesExport(): Promise<void> {
  const response = await api.get("/memories/export", { responseType: "blob" });

  const blob = new Blob([response.data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `saveforlatter-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
