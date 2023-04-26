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
  },
  env: {
    NEXT_PUBLIC_SENDINN_URL: "https://www.test.no/sendinn/opprettSoknadResource",
  },
});
