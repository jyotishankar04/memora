"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles, Globe, Video, FileText, StickyNote, Image as ImageIcon,
  Trash2, FolderOpen, MoreHorizontal, Star, Archive, ExternalLink, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useMemoryQuery,
  useMoveToTrashMutation,
  useToggleFavoriteMutation,
  useUpdateMemoryMutation,
} from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";

function attachmentFilename(fileUrl: string): string {
  return fileUrl.split("/").pop() ?? fileUrl;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

const TYPE_ICONS = { web: Globe, video: Video, note: StickyNote, image: ImageIcon, document: FileText, voice: StickyNote };

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: memory, isLoading, isError } = useMemoryQuery(id);
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const moveToTrashMutation = useMoveToTrashMutation();
  const updateMutation = useUpdateMemoryMutation();

  // No annotation column exists on memories yet (the schema's `content` field is the
  // memory's own body for note-type saves, not a freeform comment on any memory type) —
  // this stays local-only until that's an explicit product decision.
  const [userNote, setUserNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-xs text-muted-foreground">Loading memory&hellip;</div>;
  }

  if (isError || !memory) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Memory not found</h2>
        <button onClick={() => router.push("/app/memories")} className="text-xs font-bold text-primary hover:underline">
          Back to library
        </button>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[memory.type];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">

      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold hover:text-primary flex items-center gap-1 text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavoriteMutation.mutate({ id: memory.id, isFavorite: !memory.isFavorite })}
            className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors"
          >
            <Star className={cn("h-4 w-4", memory.isFavorite ? "fill-amber-500 text-amber-500" : "")} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/app/collections")}>
                <FolderOpen className="h-3.5 w-3.5" /> Move to collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                updateMutation.mutate({ id: memory.id, patch: { isArchived: true } });
                toast.add({ title: "Moved to archive", description: memory.title, type: "success" });
                router.push("/app/memories");
              }}>
                <Archive className="h-3.5 w-3.5" /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move &quot;{memory.title}&quot; to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              You can restore it from Trash within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                moveToTrashMutation.mutate(memory.id);
                toast.add({ title: "Moved to trash", description: memory.title, type: "success" });
                router.push("/app/memories");
              }}
            >
              Move to trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Split grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left 2 columns: Preview & User Notes */}
        <div className="md:col-span-2 space-y-8">

          {/* Visual Source Preview */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              {memory.type.toUpperCase()} PREVIEW
            </span>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="aspect-video w-full rounded-lg bg-muted border border-border/75 flex flex-col items-center justify-center gap-3 relative overflow-hidden text-xs text-muted-foreground font-bold">
                {memory.type === "image" && memory.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain preview image
                  <img src={memory.previewImageUrl} alt={memory.title} className="w-full h-full object-cover" />
                ) : memory.type === "video" ? (
                  <>
                    <Video className="h-10 w-10 text-red-500" />
                    <span>Video preview</span>
                  </>
                ) : memory.type === "note" ? (
                  <>
                    <StickyNote className="h-10 w-10 text-primary" />
                    <p className="max-w-sm px-6 text-[10px] font-medium text-foreground text-center whitespace-pre-wrap">
                      {memory.content}
                    </p>
                  </>
                ) : (
                  <>
                    <TypeIcon className="h-10 w-10 text-primary" />
                    <span>{memory.type === "web" ? "Website" : memory.type} preview</span>
                  </>
                )}
              </div>
            </div>

            {(memory.url || memory.source) && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-muted-foreground truncate max-w-sm">{memory.source ?? memory.url}</span>
                {memory.url && (
                  <a
                    href={memory.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    Open original <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* User Notes editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Your Note
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-primary hover:underline"
              >
                {isEditing ? "Done" : "Edit note"}
              </button>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[100px] text-xs leading-relaxed text-foreground">
                {isEditing ? (
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="w-full bg-transparent resize-none focus:outline-none"
                    rows={4}
                  />
                ) : (
                  <p>{userNote || "No custom note added. Click edit to save context reasons."}</p>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {memory.attachments.length > 0 && (
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                Attachments
              </span>
              <AttachmentGroup>
                {memory.attachments.map((attachment) => (
                  <Attachment key={attachment.id} orientation="vertical">
                    <AttachmentTrigger render={<a href={attachment.fileUrl} target="_blank" rel="noreferrer" />} />
                    <AttachmentMedia variant={attachment.mimeType?.startsWith("image/") ? "image" : "icon"}>
                      {attachment.mimeType?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain attachment thumbnail
                        <img src={attachment.fileUrl} alt="" />
                      ) : (
                        <FileText />
                      )}
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{attachmentFilename(attachment.fileUrl)}</AttachmentTitle>
                      <AttachmentDescription>
                        {[attachment.mimeType, formatFileSize(attachment.fileSize)].filter(Boolean).join(" · ")}
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                ))}
              </AttachmentGroup>
            </div>
          )}

        </div>

        {/* Right column: Memora AI Understanding metadata */}
        <div className="space-y-6">

          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles className="h-4 w-4 fill-current" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Memora understood</h3>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-4 text-xs">

                {/* Description */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-muted-foreground block">DESCRIPTION</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {memory.description || "No description saved for this memory yet."}
                  </p>
                </div>

                {/* Topics */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-muted-foreground block">TAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.length > 0 ? (
                      memory.tags.map(t => (
                        <span key={t} className="text-[8px] font-bold uppercase bg-primary/5 border border-primary/10 text-primary px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground">No tags yet</span>
                    )}
                  </div>
                </div>

                {/* Collections */}
                {memory.collections.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border/20">
                    <span className="text-[8px] font-mono text-muted-foreground block">IN COLLECTIONS</span>
                    <p className="text-[10px] text-foreground font-semibold">
                      {memory.collections.map(c => c.name).join(", ")}
                    </p>
                  </div>
                )}

                {/* Date */}
                <div className="space-y-1 pt-2 border-t border-border/20">
                  <span className="text-[8px] font-mono text-muted-foreground block">CAPTURED ON</span>
                  <p className="text-[10px] text-foreground font-semibold">{timeAgo(memory.createdAt)}</p>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Local animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
