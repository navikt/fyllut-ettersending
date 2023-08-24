// For a detailed explanation regarding each configuration property, visit:
// https://www.mocks-server.org/docs/configuration/how-to-change-settings
// https://www.mocks-server.org/docs/configuration/options

module.exports = {
  config: {},
  plugins: {
    proxyRoutesHandler: {},
    adminApi: {
      https: {},
    },
    inquirerCli: {},
    openapi: {
      collection: {},
    },
  },
  mock: {
    routes: {},
    collections: {
      selected: "base",
    },
  },
  server: {
    cors: {},
    jsonBodyParser: {},
    urlEncodedBodyParser: {},
    https: {},
  },
  files: {
    babelRegister: {},
  },
  variantHandlers: {},
};
