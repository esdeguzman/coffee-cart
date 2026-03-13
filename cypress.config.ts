import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    video: true,
    reporter: "mochawesome",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
