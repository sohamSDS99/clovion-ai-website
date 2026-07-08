/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /features/platform-coverage was removed; send the indexed URL to home (308 permanent).
      { source: '/features/platform-coverage', destination: '/', permanent: true }
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }
    ]
  }
}

module.exports = nextConfig
