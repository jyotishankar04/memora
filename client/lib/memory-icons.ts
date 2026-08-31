import { FileText, Globe, Image as ImageIcon, Mic, StickyNote, Video, type LucideIcon } from "lucide-react";
import type { MemoryType } from "@/types/memory";

export const MEMORY_TYPE_ICONS: Record<MemoryType, LucideIcon> = {
  web: Globe,
  video: Video,
  note: StickyNote,
  image: ImageIcon,
  document: FileText,
  voice: Mic,
};
