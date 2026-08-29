"use client";

import React, { useState } from "react";
import { Upload, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useMemories } from "@/context/MemoryContext";
import { uploadFile } from "@/lib/uploads";
import type { MemoryType } from "@/types/memory";

function typeFromMime(mimeType: string): MemoryType {
  if (mimeType.startsWith("image/")) return "image";
  return "document";
}

export default function CapturePage() {
  const { create } = useMemories();
  const [dragActive, setDragActive] = useState(false);
  const [isSavingFile, setIsSavingFile] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);

  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsSavingFile(true);
    try {
      const uploaded = await uploadFile(file);
      await create({
        type: typeFromMime(uploaded.mimeType),
        title: file.name.replace(/\.[^/.]+$/, ""),
        attachments: [uploaded],
      });
      toast.add({ title: "File saved", description: file.name, type: "success" });
    } catch (err) {
      toast.add({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSavingFile(false);
    }
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    setIsSavingLink(true);
    try {
      const title = (() => {
        try {
          return new URL(linkUrl).hostname;
        } catch {
          return linkUrl;
        }
      })();
      await create({ type: "web", title, url: linkUrl.trim() });
      setLinkSaved(true);
      toast.add({ title: "Link saved", description: linkUrl, type: "success" });
      setLinkUrl("");
      setTimeout(() => setLinkSaved(false), 2000);
    } catch (err) {
      toast.add({
        title: "Couldn't save link",
        description: err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    try {
      await create({ type: "note", title: noteText.slice(0, 60), content: noteText });
      setNoteSaved(true);
      toast.add({ title: "Note saved", description: noteText.slice(0, 60), type: "success" });
      setNoteText("");
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) {
      toast.add({
        title: "Couldn't save note",
        description: err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quick Capture</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Drag and drop screenshots, mockups, or paste URL references directly into your memory engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Drag and Drop Zone */}
        <div className="md:col-span-2">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl aspect-video w-full flex flex-col items-center justify-center p-6 text-center transition-all ${
              dragActive ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Upload className="h-10 w-10 mb-4 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-foreground">
              {isSavingFile ? "Uploading…" : "Drag and drop screenshots or files here"}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
              Images and PDFs, up to 10MB.
            </p>
          </div>
        </div>

        {/* Links / Notes capture panel */}
        <div className="space-y-6 text-xs font-semibold text-foreground/80">
          <form onSubmit={handleSaveLink} className="p-5 border border-border/60 bg-card rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-foreground">Save URL Link</h3>
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-10 pl-9 rounded-xl text-xs"
              />
            </div>
            <Button type="submit" disabled={isSavingLink || !linkUrl.trim()} className="w-full h-9 rounded-full bg-primary text-white text-[10px] font-bold">
              {isSavingLink ? "Saving..." : linkSaved ? (
                <span className="flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5" /> Saved</span>
              ) : "Save Link"}
            </Button>
          </form>

          <form onSubmit={handleSaveNote} className="p-5 border border-border/60 bg-card rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-foreground">Quick Text Note</h3>
            <Textarea
              placeholder="Write a thought down..."
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="rounded-xl text-xs resize-none"
            />
            <Button type="submit" disabled={isSavingNote || !noteText.trim()} className="w-full h-9 rounded-full bg-primary text-white text-[10px] font-bold">
              {isSavingNote ? "Saving..." : noteSaved ? (
                <span className="flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5" /> Saved</span>
              ) : "Save Note"}
            </Button>
          </form>
        </div>

      </div>

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
