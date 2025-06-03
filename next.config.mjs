/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cdn-info.broadsolutionsgroup.com'],
  },
  cssModules: true,
  experimental: {
    esmExternals: false,
  },
}

export default nextConfig
