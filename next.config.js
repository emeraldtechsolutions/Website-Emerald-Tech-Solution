/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverRuntimeConfig: {
    host: '0.0.0.0',
    port: 3000,
  },
}

module.exports = nextConfig
