/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack settings
  async rewrites() {
    return [
      {
        source: '/api/documents/:path*',
        destination: 'http://localhost:3001/api/documents/:path*',
      },
    ]
  },
}

module.exports = nextConfig
