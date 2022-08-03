const { readdirSync, lstatSync } = require('fs')
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

const folders = readdirSync(resolve(__dirname, 'assets'))
  .filter(folder => {
    const file = resolve(__dirname, 'assets', folder)
    return lstatSync(file).isFile() || readdirSync(file).length
  })

module.exports = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      }
    ],
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin({
      patterns: folders.map(asset => ({
        from: resolve(__dirname, 'assets', asset),
        to: resolve(__dirname, '.webpack/assets', asset)
      }))
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
