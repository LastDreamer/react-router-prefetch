module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx$/,
        exclude: [/node_modules/],
        loader: 'eslint-loader',
      },
    ],
  },
};
