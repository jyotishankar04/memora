import { and, count, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { adminAuditLogs, collections, memories, roles, sessions, users, userRoles } from "../../db/schema";
import { AppError } from "../../shared/errors/app-error";
import { logAdminAction } from "../../shared/utils/audit-log";
import type {
  AnalyticsRangeQuery,
  AuditLogQuery,
  ListUsersQuery,
  UpdateUserRolesInput,
  UpdateUserStatusInput,
} from "./admin.schema";

export interface AdminUserListItem {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  roles: string[];
}

async function attachRoles<T extends { id: string }>(items: T[]): Promise<(T & { roles: string[] })[]> {
  if (items.length === 0) return [];
  const ids = items.map((i) => i.id);

  const roleRows = await db
    .select({ userId: userRoles.userId, name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(sql`${userRoles.userId} IN ${ids}`);

  const rolesByUser = new Map<string, string[]>();
  for (const row of roleRows) {
    const list = rolesByUser.get(row.userId) ?? [];
    list.push(row.name);
    rolesByUser.set(row.userId, list);
  }

  return items.map((item) => ({ ...item, roles: rolesByUser.get(item.id) ?? [] }));
}

export async function listUsers(
  query: ListUsersQuery,
): Promise<{ items: AdminUserListItem[]; page: number; limit: number; total: number }> {
  const conditions = [];
  if (query.q) {
    conditions.push(or(ilike(users.email, `%${query.q}%`), ilike(users.name, `%${query.q}%`)));
  }
  if (query.status) {
    conditions.push(eq(users.status, query.status));
  }

  let userIdsWithRole: string[] | null = null;
  if (query.role) {
    const rows = await db
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(roles.name, query.role));
    userIdsWithRole = rows.map((r) => r.userId);
    if (userIdsWithRole.length === 0) {
      return { items: [], page: query.page, limit: query.limit, total: 0 };
    }
    conditions.push(sql`${users.id} IN ${userIdsWithRole}`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ value: total }] = await db.select({ value: count() }).from(users).where(where);

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      status: users.status,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  const items = await attachRoles(rows);
  return { items, page: query.page, limit: query.limit, total };
}

export async function getUserDetail(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const roleRows = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  const [{ value: memoryCount }] = await db.select({ value: count() }).from(memories).where(eq(memories.userId, userId));
  const [{ value: collectionCount }] = await db
    .select({ value: count() })
    .from(collections)
    .where(eq(collections.userId, userId));

  return {
    ...user,
    roles: roleRows.map((r) => r.name),
    stats: { memoryCount, collectionCount },
  };
}

export async function updateUserRoles(
  userId: string,
  input: UpdateUserRolesInput,
  adminUserId: string,
  ipAddress?: string,
) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const [role] = await db.select().from(roles).where(eq(roles.name, input.role)).limit(1);
  if (!role) {
    throw new AppError(`Unknown role "${input.role}"`, 400, "BAD_REQUEST");
  }

  const beforeRoles = (
    await db
      .select({ name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId))
  ).map((r) => r.name);

  if (input.action === "grant") {
    await db
      .insert(userRoles)
      .values({ userId, roleId: role.id, assignedBy: adminUserId })
      .onConflictDoNothing({ target: [userRoles.userId, userRoles.roleId] });
  } else {
    await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role.id)));
  }

  const afterRoles = (
    await db
      .select({ name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId))
  ).map((r) => r.name);

  await logAdminAction({
    adminUserId,
    action: input.action === "grant" ? "user.role.granted" : "user.role.revoked",
    targetType: "user",
    targetId: userId,
    beforeValue: { roles: beforeRoles },
    afterValue: { roles: afterRoles },
    ipAddress,
  });

  return { userId, roles: afterRoles };
}

export async function updateUserStatus(
  userId: string,
  input: UpdateUserStatusInput,
  adminUserId: string,
  ipAddress?: string,
) {
  const [before] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!before) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const [after] = await db
    .update(users)
    .set({ status: input.status, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  await logAdminAction({
    adminUserId,
    action: "user.status.updated",
    targetType: "user",
    targetId: userId,
    beforeValue: { status: before.status },
    afterValue: { status: after.status },
    ipAddress,
  });

  return after;
}

// --- Analytics ---

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function getSignupsOverTime(query: AnalyticsRangeQuery) {
  const since = daysAgo(query.days);
  const rows = await db
    .select({ date: sql<string>`date(${users.createdAt})`, count: count() })
    .from(users)
    .where(gte(users.createdAt, since))
    .groupBy(sql`date(${users.createdAt})`)
    .orderBy(sql`date(${users.createdAt})`);
  return rows;
}

export async function getActiveUsers(query: AnalyticsRangeQuery) {
  const since = daysAgo(query.days);
  const rows = await db
    .select({ date: sql<string>`date(${sessions.lastActivityAt})`, count: sql<number>`count(distinct ${sessions.userId})::int` })
    .from(sessions)
    .where(gte(sessions.lastActivityAt, since))
    .groupBy(sql`date(${sessions.lastActivityAt})`)
    .orderBy(sql`date(${sessions.lastActivityAt})`);
  return rows;
}

export async function getContentGrowth(query: AnalyticsRangeQuery) {
  const since = daysAgo(query.days);
  const memoryRows = await db
    .select({ date: sql<string>`date(${memories.createdAt})`, count: count() })
    .from(memories)
    .where(gte(memories.createdAt, since))
    .groupBy(sql`date(${memories.createdAt})`)
    .orderBy(sql`date(${memories.createdAt})`);

  const collectionRows = await db
    .select({ date: sql<string>`date(${collections.createdAt})`, count: count() })
    .from(collections)
    .where(gte(collections.createdAt, since))
    .groupBy(sql`date(${collections.createdAt})`)
    .orderBy(sql`date(${collections.createdAt})`);

  return { memories: memoryRows, collections: collectionRows };
}

export async function getAuditLog(
  query: AuditLogQuery,
): Promise<{ items: (typeof adminAuditLogs.$inferSelect)[]; page: number; limit: number; total: number }> {
  const [{ value: total }] = await db.select({ value: count() }).from(adminAuditLogs);

  const items = await db
    .select()
    .from(adminAuditLogs)
    .orderBy(desc(adminAuditLogs.createdAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  return { items, page: query.page, limit: query.limit, total };
}
