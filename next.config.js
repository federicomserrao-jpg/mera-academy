/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./index.html'],
    },
  },
}

module.exports = nextConfig
