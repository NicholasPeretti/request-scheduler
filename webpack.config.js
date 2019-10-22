const process = require('process')
const path = require('path')
const { NODE_ENV } = process.env
const isProductionEnv = NODE_ENV === 'production'

module.exports = {
  mode: isProductionEnv ? 'production' : 'development',
  entry: './src/scheduler.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
  }
}
