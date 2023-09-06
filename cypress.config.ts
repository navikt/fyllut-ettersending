import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  component: {
    viewportWidth: 1200,
    viewportHeight: 1000,
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    baseUrl: "http://localhost:3002/fyllut-ettersending",
    chromeWebSecurity: false,
    viewportWidth: 1500,
    viewportHeight: 1200,
    setupNodeEvents(on, config) {},
    env: {
      INNSENDING_API_URL: "http://127.0.0.1:3200",
      SEND_INN_FRONTEND_URL: "http://127.0.0.1:3200/send-inn-frontend",
      MIN_SIDE_FRONTEND_URL: "http://127.0.0.1:3200/min-side-frontend",
    },
  },
});
