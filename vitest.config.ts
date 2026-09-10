import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["{packages,apps,scripts}/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    passWithNoTests: true,
  },
});
