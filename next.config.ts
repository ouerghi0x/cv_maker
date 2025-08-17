/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/dms/image/**',
      },
      {
        protocol: 'https',
        hostname: 'static.licdn.com',
        port: '',
        pathname: '/**', // allow all paths from static.licdn.com
      },
    ],
  },
};

module.exports = nextConfig;
