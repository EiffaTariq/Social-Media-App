import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./test/setup.js",
    globals: true,
    testTimeout: 20000, // MongoMemoryServer's first boot can be slow
  },
});