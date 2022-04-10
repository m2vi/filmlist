// @ts-check
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 86400 * 1000,
    pagesBufferLength: 100,
  },
  // @ts-ignore
  i18n,
  images: {
    domains: ['cdn.discordapp.com', 'image.tmdb.org'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { buildId, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        BUILD_ID: JSON.stringify(buildId),
      })
    );
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/browse',
        permanent: true,
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
