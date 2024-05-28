/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')
const nextConfig = nextTranslate({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    host: process.env.HOST
  },

  publicRuntimeConfig: {
    HOST: process.env.HOST,
    HOST_INNER: process.env.HOST,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEV: process.env.NODE_ENV === 'development',
    PROD: process.env.NODE_ENV !== 'development',
    ROBOTS_FILE: process.env.ROBOTS_FILE,
    LOAD_LIMIT: process.env.LOAD_LIMIT,
    FREE_COURSES_ID: process.env.FREE_COURSES_ID,
    POPULAR_COURSES_ID: process.env.POPULAR_COURSES_ID
  },
  serverRuntimeConfig: {
    HOST: process.env.HOST,
    HOST_INNER: process.env.HOST_INNER,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEV: process.env.NODE_ENV === 'development',
    PROD: process.env.NODE_ENV !== 'development',
    ROBOTS_FILE: process.env.ROBOTS_FILE,
    FREE_COURSES_ID: process.env.FREE_COURSES_ID
  },
  images: {
    domains: ['api.arbi-hunter.dev.glob-com.ru', 'api.arbi.com', 'arbi-hunter.dev.glob-com.ru', 'arbihunter.com', 'api.arbihunter.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
  },

  webpack: (config, options) => {
    config.externals.push({
      ymaps3: 'ymaps3',
    })
   return config
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots'
      }
    ]
  }

})

module.exports = nextConfig


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "xo-media-group-ltd",
    project: "arbihunter-web",

    // Only print logs for uploading source maps in CI
    silent: true,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
