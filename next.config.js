/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Enable static export for better performance
  output: 'standalone',
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Handle API routes
  experimental: {
    serverComponentsExternalPackages: ['@emailjs/browser'],
  },
}

module.exports = nextConfig
