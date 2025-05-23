/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['../ui'], // Add this line
};

module.exports = nextConfig;
