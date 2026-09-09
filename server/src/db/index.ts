import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

// Lets a service function accept either the top-level `db` or an in-flight
// transaction client, so callers composing multiple writes atomically (e.g.
// admin/billing assigning a plan while also converting a coupon redemption
// and granting referral credits) can pass their own `tx` through instead of
// each service opening its own nested transaction.
export type DbOrTx = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
