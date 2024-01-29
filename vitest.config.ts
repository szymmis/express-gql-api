/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    env: {
      DB_PATH: "test.sqlite3",
    },
  },
});
