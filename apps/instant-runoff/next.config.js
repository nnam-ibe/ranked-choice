//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  serverRuntimeConfig: {
    database: {
      uri: process.env.MONGODB_URI,
    },
  },
  experimental: {
    appDir: true,
  },
};

module.exports = withNx(nextConfig);
