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
  // Old resume links point at the current resume
  async redirects() {
    return [
      { source: '/Yiran_cv-2.pdf', destination: '/Yiran_Hu_Resume.pdf', permanent: false },
      { source: '/Yiran%20Hu%20-%20Resume.pdf', destination: '/Yiran_Hu_Resume.pdf', permanent: false },
    ]
  },
  // Handle API routes
  experimental: {
    serverComponentsExternalPackages: ['@emailjs/browser'],
  },
}

module.exports = nextConfig
