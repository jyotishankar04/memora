import "dotenv/config";
import { db } from "./index";
import { roles } from "./schema";

const defaultRoles = [
  { name: "free_user", description: "Default role granted to every new user on signup", isSystem: true },
  { name: "pro_user", description: "Paid tier with expanded limits", isSystem: true },
  { name: "admin", description: "Full administrative access", isSystem: true },
];

async function seed() {
  await db.insert(roles).values(defaultRoles).onConflictDoNothing({ target: roles.name });
  console.log(`Seeded roles: ${defaultRoles.map((r) => r.name).join(", ")}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
