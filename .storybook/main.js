const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@emotion/core': toPath('node_modules/@emotion/react'),
      },
    };

    return config;
  },
};
