import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  // Mandatory for Drizzle v0.21.0 and above
  dialect: "postgresql", // Replace with "mysql" or "sqlite" if using a different database
  schema: "./src/lib/db/schema.ts",

  // Optional (only needed for specific drivers)
  // driver: "turso", // Replace with the appropriate driver if applicable

  // Connection string (updated format

  dbCredentials: {
    url: "postgresql://chat_pdf_owner:qHvPy7NU1uir@ep-crimson-sky-a1f5x203.ap-southeast-1.aws.neon.tech:5432/chat_pdf"
  },
} satisfies Config;
