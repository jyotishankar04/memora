import { customType } from "drizzle-orm/pg-core";

// text-embedding-3-small — keep the schema and the embeddings client in sync.
export const EMBEDDING_DIMENSIONS = 1536;

// drizzle-orm has no built-in pgvector column type. The `vector` extension's
// wire format is a plain string like "[0.1,0.2,...]", not JSON — pgvector
// deliberately doesn't accept a JSON array literal here, hence the manual
// bracket-join instead of JSON.stringify.
export const vector = (name: string, dimensions: number) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value) {
      return `[${value.join(",")}]`;
    },
    fromDriver(value) {
      return (value as string)
        .slice(1, -1)
        .split(",")
        .map(Number);
    },
  })(name);

// Populated by a DB trigger (see the ingestion migration), never written by
// the app — this type only exists so the column shows up correctly in the
// generated migration DDL.
export const tsvector = (name: string) =>
  customType<{ data: string }>({
    dataType() {
      return "tsvector";
    },
  })(name);
