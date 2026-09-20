# Schema Module Structure

This directory contains the database schema split into logical, maintainable modules instead of one massive file.

## Module Breakdown

### Core Modules
- **enums.schema.ts** - All pgEnum definitions (types for all entities)
- **auth.schema.ts** - Authentication (users, auth identities, sessions, devices)
- **rbac.schema.ts** - Role-based access control (roles, permissions, user roles)
- **onboarding.schema.ts** - User settings, onboarding, calendar connections

### Feature Modules
- **memories.schema.ts** - Core memory management (collections, memories, tags, chunks, attachments)
- **sharing.schema.ts** - Sharing & collaboration (shares, grants, access requests, views)
- **billing.schema.ts** - Subscriptions & payments (plans, transactions, coupons, credits, referrals)

### System Modules
- **system.schema.ts** - Features, announcements, notifications, audit logs
- **ai.schema.ts** - AI subsystem (usage logs, threads)
- **email.schema.ts** - Email management (campaigns, messages, imports)

### Index
- **index.ts** - Central re-export file (imports all modules and re-exports for backward compatibility)

## File Structure Example

```typescript
// schema/memories.schema.ts
import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { memoryTypeEnum, memoryStatusEnum } from "./enums.schema";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ... columns
});

export const memories = pgTable("memories", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ... columns
});
```

## Migration Path

1. Start with **enums.schema.ts** (all pgEnum definitions)
2. Extract **auth.schema.ts** (users, auth identities, sessions)
3. Extract **memories.schema.ts** (collections, memories, tags, chunks)
4. Extract **sharing.schema.ts** (shares, access control)
5. Extract **billing.schema.ts** (plans, transactions, subscriptions)
6. Extract remaining modules
7. Create **index.ts** to re-export everything
8. Update main `schema.ts` to just import from `./schema`

## Import Changes

**Before (old):**
```typescript
import { users, memories, plans } from "../../db/schema";
```

**After (new - still works via index.ts):**
```typescript
import { users, memories, plans } from "../../db/schema"; // Works the same!
```

The `schema/index.ts` file re-exports everything, so all existing imports continue to work without changes.

## Benefits

✅ **Improved Readability** - Find related tables in dedicated files  
✅ **Easier Maintenance** - Changes to billing tables only edit billing.schema.ts  
✅ **Clear Organization** - Each module has a single responsibility  
✅ **Faster Development** - No scrolling through 1758 lines  
✅ **Better Collaboration** - Easier to review and merge changes  
✅ **Backward Compatible** - All imports work unchanged via index.ts re-export
