/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/fyllut-ettersending",
  reactStrictMode: true,
  output: "standalone",
  eslint: {
    dirs: ["src", "cypress"],
  },
  i18n: {locales: ["no"], defaultLocale: "no"},
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
}

module.exports = nextConfig;
