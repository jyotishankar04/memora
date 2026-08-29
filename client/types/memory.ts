export type MemoryType = "web" | "video" | "note" | "image" | "document" | "voice";

export interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  url: string | null;
  description: string | null;
  source: string | null;
  faviconUrl: string | null;
  previewImageUrl: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  inTrash: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
}

export interface MemoryDetail extends Memory {
  content: string | null;
  keywords: string[] | null;
  collections: { id: string; name: string }[];
  attachments: Attachment[];
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  memoryCount: number;
  createdAt: string;
  updatedAt: string;
}
