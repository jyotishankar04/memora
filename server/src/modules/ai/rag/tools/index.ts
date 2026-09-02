import { searchMemoriesTool } from "./search-memories";
import { searchMemoriesByDateTool } from "./search-memories-by-date";

// Adding a future tool (reminders, collection ops, etc.) is a new file +
// one entry here — no graph changes needed (see nodes/agent.ts).
export const tools = [searchMemoriesTool, searchMemoriesByDateTool];

export { ragToolContextSchema, type RAGToolContext } from "./search-memories";
