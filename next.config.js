/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { 'better-sqlite3': 'commonjs better-sqlite3' }];
    return config;
  }
}

module.exports = nextConfig 