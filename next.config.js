/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/fyllut-ettersending",
  reactStrictMode: true,
  output: "standalone",
  eslint: {
    dirs: ["src", "cypress"],
  },
  i18n: {
    locales: ["nb", "en", "nn"],
    defaultLocale: "nb",
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
