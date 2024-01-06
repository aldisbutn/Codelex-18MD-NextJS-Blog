/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
