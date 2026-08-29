import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./test/setup.js",
    globals: true,
    testTimeout: 20000, 
  },
});