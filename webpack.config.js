const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.jsx', // Replace with your application's entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Install babel-loader if needed
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Install these loaders if using CSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new Dotenv(),
  ],
  mode: 'development',
};
