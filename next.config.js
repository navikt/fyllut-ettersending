/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
