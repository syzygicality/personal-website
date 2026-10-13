import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: {
    rules: {
      '*.yaml': {
        loaders: ['./loaders/yaml-loader.js'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
