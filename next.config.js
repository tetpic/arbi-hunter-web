/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    files: 'https://arbi-hunter.dev.glob-com.ru/api/asset/files/',
    host: process.env.HOST
  },

  publicRuntimeConfig: {
    HOST: process.env.HOST,
    HOST_INNER: process.env.HOST_INNER,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEV: process.env.NODE_ENV === 'development',
    PROD: process.env.NODE_ENV !== 'development',
    ROBOTS_FILE: process.env.ROBOTS_FILE,
  },
  serverRuntimeConfig: {
    HOST: process.env.HOST,
    HOST_INNER: process.env.HOST_INNER,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEV: process.env.NODE_ENV === 'development',
    PROD: process.env.NODE_ENV !== 'development',
    ROBOTS_FILE: process.env.ROBOTS_FILE,
  },
  images: {
    domains: ['api.arbi-hunter.dev.glob-com.ru', 'api.arbi.com', 'arbi-hunter.dev.glob-com.ru'],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
  },

  webpack: (config, options) => {
    config.externals.push({
      ymaps3: 'ymaps3',
    })
   return config
  },

}

module.exports = nextConfig
