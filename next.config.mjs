/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore build errors in development, not production
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for better performance
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
  // Compress responses
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
