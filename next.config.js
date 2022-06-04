const { i18n } = require('./next-i18next.config');

const nextConfig = {
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
};

module.exports = nextConfig;
