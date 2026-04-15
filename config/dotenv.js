import path from "path";
import dotenv from "dotenv";

const isVercel = Boolean(process.env.VERCEL);

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  // Local dev: allow `.env` to override accidentally-set system env vars.
  // Vercel: platform-provided env vars must win.
  override: !isVercel,
});

