import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "../db/schema/auth";

const sql = neon(
  "postgresql://audiodb_owner:npg_4xelgwkCYP1Z@ep-young-pond-a5qh2x7v-pooler.us-east-2.aws.neon.tech/audiodb?sslmode=require"
);
export const db = drizzle({
  client: sql,
  schema: { authSchema },
  logger: true,
});

export type DB = typeof db;
