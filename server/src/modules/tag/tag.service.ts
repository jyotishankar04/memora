import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { memoryTags, tags } from "../../db/schema";

export interface TagResponse {
  id: string;
  name: string;
  memoryCount: number;
}

// Read-only — tags are created implicitly via resolveTagIds() (memory.service.ts)
// whenever a memory is saved/edited with a tag that doesn't exist yet, same as
// how most tag systems work; there's no standalone "create a tag" action.
export async function listTags(userId: string): Promise<TagResponse[]> {
  return db
    .select({
      id: tags.id,
      name: tags.name,
      memoryCount: count(memoryTags.memoryId),
    })
    .from(tags)
    .leftJoin(memoryTags, eq(memoryTags.tagId, tags.id))
    .where(eq(tags.userId, userId))
    .groupBy(tags.id)
    .orderBy(desc(count(memoryTags.memoryId)), tags.name);
}
