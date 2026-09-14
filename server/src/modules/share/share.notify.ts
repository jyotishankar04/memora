import { logger } from "../../shared/utils/logger";
import { NotificationType, ShareResourceType } from "../../db/enums";
import { createNotification } from "../notification/notification.service";
import type { ShareRow } from "./share.access";

/**
 * The single seam between sharing and the notification/email subsystems.
 *
 * Every function here returns void and swallows its own failures. Sharing
 * must not fail because a notification insert lost a race or a mailbox is
 * unreachable — the share itself already succeeded by the time these run,
 * and surfacing a 500 would tell the user their action failed when it
 * didn't.
 */

function noun(share: ShareRow): string {
  return share.resourceType === ShareResourceType.COLLECTION ? "collection" : "memory";
}

/** Fire-and-forget wrapper so no caller ever has to remember to catch. */
function emit(what: string, run: () => Promise<unknown>): void {
  void run().catch((err) => logger.warn({ err }, `Failed to deliver notification: ${what}`));
}

export interface ShareInviteNotice {
  granteeUserId: string | null;
  email: string;
  share: ShareRow;
  ownerName: string | null;
}

export function notifyShareInvite(notice: ShareInviteNotice): void {
  // No account yet — nothing to notify in-app. The invite is already
  // stored as a pending grant and activates at signup; email (phase 6)
  // is what reaches this person.
  if (!notice.granteeUserId) return;

  emit("share invite", () =>
    createNotification({
      userId: notice.granteeUserId!,
      type: NotificationType.SHARE_INVITE_RECEIVED,
      title: `${notice.ownerName ?? "Someone"} shared a ${noun(notice.share)} with you`,
      actionUrl: `/s/${notice.share.slug}`,
      metadata: { shareId: notice.share.id, slug: notice.share.slug },
    })
  );
}

export interface AccessRequestedNotice {
  ownerId: string;
  requesterName: string | null;
  share: ShareRow;
  requestId: string;
}

export function notifyAccessRequested(notice: AccessRequestedNotice): void {
  emit("access requested", () =>
    createNotification({
      userId: notice.ownerId,
      type: NotificationType.SHARE_ACCESS_REQUESTED,
      title: `${notice.requesterName ?? "Someone"} wants access to your ${noun(notice.share)}`,
      body: "Approve or decline this request.",
      actionUrl: "/app/shared",
      // shareId + requestId let the notifications page approve inline,
      // rather than sending the owner off to find the right share dialog.
      metadata: {
        shareId: notice.share.id,
        requestId: notice.requestId,
        slug: notice.share.slug,
      },
    })
  );
}

export interface AccessDecisionNotice {
  requesterUserId: string;
  approved: boolean;
  share: ShareRow;
}

export function notifyAccessDecision(notice: AccessDecisionNotice): void {
  emit("access decision", () =>
    createNotification({
      userId: notice.requesterUserId,
      type: notice.approved ? NotificationType.SHARE_ACCESS_APPROVED : NotificationType.SHARE_ACCESS_DENIED,
      title: notice.approved
        ? `You now have access to a shared ${noun(notice.share)}`
        : `Your access request was declined`,
      // Only link somewhere they can actually go.
      actionUrl: notice.approved ? `/s/${notice.share.slug}` : null,
      metadata: { shareId: notice.share.id, slug: notice.share.slug },
    })
  );
}
