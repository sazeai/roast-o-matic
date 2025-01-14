const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/[...slug]',
      },
    ]
  },
}

module.exports = nextConfig

