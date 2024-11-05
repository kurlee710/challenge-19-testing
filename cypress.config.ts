// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite", // or 'webpack' if you're using that
    },
    supportFile: "cypress/support/component.ts", // Ensure this path is correct
  },
});
