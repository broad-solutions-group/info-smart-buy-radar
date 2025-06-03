/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cdn-info.broadsolutionsgroup.com'],
  },
  experimental: {
    esmExternals: false,
  },
}

export default nextConfig
