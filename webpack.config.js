const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/js/app.js",
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
};