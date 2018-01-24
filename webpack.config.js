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
		path: path.resolve(__dirname, 'build-' + process.env.BROWSER),
		library: "DaltonTabBridge"
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
			{
				test: /\.(styl)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader', 'stylus-loader' ]
				})
			},
			{
				test: /\.(css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader' ]
				})
			},
			{
				test: /\.(png|jpg|gif|svg|otf|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}
		]
	},

	plugins: [
		new ExtractTextPlugin("bundle.css"),
		new HtmlWebpackPlugin({
			title: "New tab"
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "manifests", process.env.BROWSER + ".json"),
				to: "manifest.json"
			},
			{ from: "img", to: "img" },
			"bg.js",
			"newTab.html"
		])
	],

	resolve: {
		modules: [
			path.resolve("./app"),
			path.resolve("./node_modules")
		]
	}
};