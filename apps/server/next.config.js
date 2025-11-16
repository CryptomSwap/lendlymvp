const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@lendly/shared'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      const serverNodeModules = path.resolve(__dirname, 'node_modules')
      const fs = require('fs')
      
      // Ensure zod resolves correctly
      if (!config.resolve) config.resolve = {}
      if (!config.resolve.alias) config.resolve.alias = {}
      
      const zodPath = path.join(serverNodeModules, 'zod')
      if (fs.existsSync(zodPath)) {
        config.resolve.alias['zod'] = zodPath
      }
      
      // Module resolution priority
      if (!Array.isArray(config.resolve.modules)) {
        config.resolve.modules = []
      }
      config.resolve.modules.unshift(serverNodeModules)
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
