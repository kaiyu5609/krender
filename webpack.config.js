var path = require('path')

var config = {
	entry: [
		path.resolve(__dirname, './index.js')
	],
	output: {
		path: path.resolve(__dirname, 'release/'),
		filename: 'krender.js',
		publicPath: 'release',
		library: 'krender',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{test: /\.css$/, use: 'style!css'},
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					}
				}]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.css']
	}
}

module.exports = config;
