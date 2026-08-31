import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../../../db";
import { collectionMemories, collections, memories, memoryTags } from "../../../../db/schema";
import { MemoryStatus, MemoryType } from "../../../../db/enums";
import { resolveTagIds, type Tx } from "../../../memory/memory.service";
import { getVectorStore } from "../../vector-store";
import { isVideoUrl } from "../extract-url";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

async function assignCollection(tx: Tx, state: IngestionStateType): Promise<string | null> {
  if (state.collectionAction === "existing" && state.collectionName) {
    const [match] = await tx
      .select({ id: collections.id })
      .from(collections)
      .where(and(eq(collections.userId, state.userId), ilike(collections.name, state.collectionName)));
    if (!match) return null;
    await tx
      .insert(collectionMemories)
      .values({ collectionId: match.id, memoryId: state.memoryId })
      .onConflictDoNothing();
    return match.id;
  }

  if (state.collectionAction === "new" && state.collectionName) {
    const [created] = await tx
      .insert(collections)
      .values({
        userId: state.userId,
        name: state.collectionName,
        icon: state.collectionIcon || "📁",
        description: state.collectionDescription,
      })
      .returning({ id: collections.id });
    await tx.insert(collectionMemories).values({ collectionId: created.id, memoryId: state.memoryId });
    return created.id;
  }

  return null;
}

// Verbatim intent of docs/AI_REQUIREMENTS.md's UpsertPgVector node, split in
// two: scalar AI outputs (title/description/classification) always live on
// the `memories` row regardless of vector backend; only the embeddings go
// through the swappable VectorStore (pgvector locally, Upstash in prod).
export async function upsertVectors(state: IngestionStateType): Promise<IngestionUpdate> {
  let assignedCollectionId: string | null = null;

  // The client's own link detection may have missed it (or the memory was
  // never routed through a client that tries) — DetectContentType's regex
  // backstop found a URL in the raw text, so correct the stored type/url to
  // match rather than leave it filed as a plain note. Known limitation: this
  // doesn't loop back through ParseWebContent, so the embedded/chunked
  // content is still the original note text, not the fetched page — good
  // enough to be findable and correctly typed, not a full re-ingest.
  const reclassifiedAsLink = !state.url && !!state.detectedUrl;
  const correctedType = reclassifiedAsLink
    ? isVideoUrl(new URL(state.detectedUrl as string))
      ? MemoryType.VIDEO
      : MemoryType.WEB
    : undefined;

  // Reaching this node at all means every earlier node completed without
  // throwing — "failed" is reserved for a genuine thrown error (see
  // worker.ts's catch). A link-type memory is "ready" only once it actually
  // has a real preview image; every other case (blocked/no-og/non-link
  // types once classified) is "partial" — the memory always exists either
  // way, this only ever describes enrichment quality.
  const effectiveType = correctedType ?? state.mediaType;
  const isLinkType = effectiveType === MemoryType.WEB || effectiveType === MemoryType.VIDEO;
  const finalStatus =
    !isLinkType || state.previewStatus === "available" ? MemoryStatus.READY : MemoryStatus.PARTIAL;

  await db.transaction(async (tx) => {
    await tx
      .update(memories)
      .set({
        // Never overwrite a title the user actually typed — only fill in
        // when capture left it at the schema default. Prefers the AI title,
        // falling back to the page's own og:title/<title> when AI insight
        // generation itself came up empty (still better than "Untitled").
        title:
          state.existingTitle === "Untitled" ? (state.aiTitle ?? state.previewTitle ?? undefined) : undefined,
        // Spelling/grammar-corrected version of what the user typed as a
        // caption — never runs for "note" (see correctCaption.ts), so a
        // note's own body is never touched here.
        content: state.correctedCaption ?? undefined,
        description: state.aiSummary ?? state.previewDescription ?? undefined,
        resourceCategory: state.resourceCategory,
        inferredIntent: state.inferredIntent,
        intentConfidence: state.intentConfidence,
        contentType: state.contentType,
        extractedFields: Object.keys(state.extractedFields).length > 0 ? state.extractedFields : undefined,
        type: correctedType,
        url: reclassifiedAsLink ? (state.detectedUrl as string) : undefined,
        // Only ParseWebContent (web/video) ever populates these — leaves
        // other types' existing previewImageUrl (e.g. an image attachment's)
        // untouched.
        previewImageUrl: state.previewImageUrl ?? undefined,
        faviconUrl: state.faviconUrl ?? undefined,
        source: state.sourceDomain ?? undefined,
        previewStatus: state.previewStatus ?? undefined,
        previewSource: state.previewSource ?? undefined,
        platform: state.platform ?? undefined,
        resourceType: state.resourceType ?? undefined,
        canonicalUrl: state.canonicalUrl ?? undefined,
        fetchStatus: state.fetchStatus ?? undefined,
        status: finalStatus,
      })
      .where(eq(memories.id, state.memoryId));

    if (state.suggestedTags.length > 0) {
      const tagIds = await resolveTagIds(tx, state.userId, state.suggestedTags);
      if (tagIds.length > 0) {
        await tx
          .insert(memoryTags)
          .values(tagIds.map((tagId) => ({ memoryId: state.memoryId, tagId })))
          .onConflictDoNothing();
      }
    }

    assignedCollectionId = await assignCollection(tx, state);
  });

  await getVectorStore().upsertMemoryVectors({
    memoryId: state.memoryId,
    userId: state.userId,
    documentEmbedding: state.documentEmbedding,
    chunks: state.chunks.map((chunk, index) => ({
      index: chunk.index,
      content: chunk.content,
      tokenCount: chunk.tokenCount,
      embedding: state.chunkEmbeddings[index] ?? [],
    })),
  });

  logNode(state.memoryId, "upsertVectors", {
    titleWritten: state.existingTitle === "Untitled" && !!state.aiTitle,
    tagsLinked: state.suggestedTags.length,
    chunksWritten: state.chunks.length,
    collectionAction: state.collectionAction,
    assignedCollectionId,
    reclassifiedAsLink,
    previewImageUrl: state.previewImageUrl,
    faviconUrl: state.faviconUrl,
    captionCorrected: !!state.correctedCaption,
    finalStatus,
    previewStatus: state.previewStatus,
    previewSource: state.previewSource,
    platform: state.platform,
    fetchStatus: state.fetchStatus,
  });

  return { finalStatus };
}
