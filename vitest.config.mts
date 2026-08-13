import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests run everywhere. Integration tests (tests/integration) need a
 * PostgreSQL database and skip themselves when DATABASE_URL is not set, so
 * `npm test` is always runnable — see TESTING.md.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    // One fork: the integration suite shares a single database.
    pool: "forks",
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
