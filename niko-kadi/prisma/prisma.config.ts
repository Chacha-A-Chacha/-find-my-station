import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const dbUrl = process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: dbUrl,
  },
  migrate: {
    adapter: async () =>
      new PrismaPg({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }),
  },
});
