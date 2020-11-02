require('dotenv').config();

const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const Dotenv = require('dotenv-webpack');

const howToRedirects = require('./data/howto-redirects');

const nextConfig = {
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    // mini-css-extract-plugin generates a warning when importing css as modules
    // as we scope manually we can ignore this warning: https://github.com/zeit/next-plugins/issues/506#issuecomment-589269285
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    );

    config.node = {
      fs: 'empty',
    };

    return config;
  },
  redirects: async () => [
    {
      source: '/dashboards/',
      destination: `/dashboards/global/`,
      permanent: true,
    },
    {
      source: '/topics/',
      destination: `/topics/biodiversity/`,
      permanent: true,
    },
    {
      source: '/grants-and-fellowships/',
      destination: `/grants-and-fellowships/projects/`,
      permanent: true,
    },
    ...howToRedirects.map((r) => ({
      ...r,
      permanent: true,
    })),
  ],
  rewrites: async () => [
    {
      source: '/help/',
      destination: `https://gfw-help-center.herokuapp.com/help/`,
      basePath: false,
    },
    {
      source: '/help/:path*/',
      destination: `https://gfw-help-center.herokuapp.com/help/:path*/`,
      basePath: false,
    },
    {
      source: '/help/:path*',
      destination: `https://gfw-help-center.herokuapp.com/help/:path*`,
      basePath: false,
    },
    {
      source: '/my-gfw/:path*/',
      destination: '/my-gfw/',
    },
  ],
  trailingSlash: true,
};

module.exports = withPlugins(
  [[withSass], [optimizedImages], [withBundleAnalyzer]],
  nextConfig
);
