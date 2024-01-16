import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["test/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    coverage: {
      include: ["src/lib/**/*"],
      reporter: ["lcov"],
    },
  },
});
