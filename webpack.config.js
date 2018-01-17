var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	entry: './app/main.js',

	devServer: {
		historyApiFallback: {
			rewrites: [
				{ from: /.$/, to: '/newTab.html' },
			]
		}
	},

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build-' + process.env.BROWSER)
	},

	module: {
		rules: [
			{
				test: /.(js|jsx)$/,
				loaders: 'buble-loader',
				include: path.join(__dirname, 'app'),
				query: {
					jsx: "h"
				}
			},
			{test: /\.(styl)$/, use: [ 'style-loader', 'css-loader', 'stylus-loader' ]},
			{test: /\.(css)$/, use: 'css-loader'}
		]
	},

	plugins: [
		new ExtractTextPlugin("style.css"),
		new HtmlWebpackPlugin({
			title: "New tab"
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "manifests", process.env.BROWSER + ".json"),
				to: "manifest.json"
			},
			"128.png",
			"bg.js"
		])
	],

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};