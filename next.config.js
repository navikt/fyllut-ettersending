const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/fyllut-ettersending',
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    dirs: ['src', 'cypress'],
  },
  i18n,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
