/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cdn-info.broadsolutionsgroup.com'],
  },
  experimental: {
    esmExternals: false,
  },
  // 禁用服务端功能，因为Pages是静态部署
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
}

export default nextConfig
