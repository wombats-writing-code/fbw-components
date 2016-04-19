var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: './modules/index.jsx',
    output: {
        filename: 'bundle.js', //this is the default name, so you can skip it
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
		{
		test: /\.scss$/,
		loader: 'style!css!sass'
		},
/*
		{
		test: /\.png$/,
		loader: 'file-loader'
		}
*/
        ]
    },
	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.ProvidePlugin({
			_: "lodash",
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			"keymirror": "keymirror",
			"classNames": "classNames"
		})
	],
    externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    resolve: {
	alias: {
		'jquery': path.resolve( __dirname, './node_modules/commonjs-jquery/commonjs-jquery.js'),
		'lodash': path.resolve( __dirname, './node_modules/lodash/index.js'),
		'react-bootstrap': path.resolve( __dirname, './node_modules/react-bootstrap/dist/react-bootstrap.js'),
		'react-dom': path.resolve( __dirname, './node_modules/react-dom/index.js'),
		'keymirror': path.resolve( __dirname, './node_modules/keymirror/index.js'),
		'classnames': path.resolve( __dirname, './node_modules/classnames/index.js'),
	},
        extensions: ['', '.js', '.jsx']
    }
}
