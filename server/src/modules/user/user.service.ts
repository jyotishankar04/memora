import { eq } from "drizzle-orm";
import { db } from "../../db";
import { userOnboarding, users } from "../../db/schema";
import { OrganizeMode } from "../../db/enums";
import type { CompleteOnboardingInput } from "./user.schema";

export async function completeOnboarding(userId: string, input: CompleteOnboardingInput): Promise<void> {
  const organizeMode = input.organizeMode === "manual" ? OrganizeMode.MANUAL : OrganizeMode.AUTO;

  await db.update(users).set({ name: input.name }).where(eq(users.id, userId));

  await db
    .insert(userOnboarding)
    .values({
      userId,
      interests: input.interests,
      contentTypes: input.contentTypes,
      organizeMode,
      completedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userOnboarding.userId,
      set: {
        interests: input.interests,
        contentTypes: input.contentTypes,
        organizeMode,
        completedAt: new Date(),
      },
    });
}
