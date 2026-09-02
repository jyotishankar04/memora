import { FileTextIcon as FileText, GlobeIcon as Globe, Image01Icon as ImageIcon, Mic01Icon as Mic, StickyNote01Icon as StickyNote, Video01Icon as Video } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { MemoryType } from "@/types/memory";

export const MEMORY_TYPE_ICONS: Record<MemoryType, IconSvgElement> = {
  web: Globe,
  video: Video,
  note: StickyNote,
  image: ImageIcon,
  document: FileText,
  voice: Mic,
};
