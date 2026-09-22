# Collections and tags

This page describes how collections and tags are structured. Use this as a reference before modifying categorization logic.

Collections are folders; tags cut across them. Both live in `server/src/modules/collection/` and are referenced from `memory.service.ts`.

The following list describes the collection and tag behavior:

- A collection's `source` is either `user` (created through the API) or `system` (created by the ingestion pipeline's `OrganizeCollection` node, or by onboarding defaults). Only `user` collections count toward anything user-facing; `system` collections are hidden by default (the `includeSystem` query parameter shows them).
- Converting a system collection to a user collection (`convertToUser`) is one-way.
- Tags are scoped per user. A tag name is unique within its owner, resolved or created on demand by `resolveTagIds` (`memory.service.ts`), and shared by both the REST API and the Ask agent's `update_memory` tool.
