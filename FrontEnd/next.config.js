const path = require("path");
const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");

module.exports = withSass(
    withCss({
        // target: 'serverless',
        webpack: config => {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: "empty"
            };

            // Resolves alias to root folder
            config.resolve.alias["@"] = __dirname;

            // Provide alias for plugins
            config.plugins.push(
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "window.jQuery": "jquery",
                    "window.moment": "moment",
                    moment: "moment",
                    Raphael: "raphael" // required by morris.js
                })
            );

            // Fix for flot resize
            config.module.rules.push({
                test: /jquery\.flot\.resize\.js$/,
                use: ["imports-loader?this=>window"]
            });

            // Font face support
            config.module.rules.push({
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000,
                        name: "[name].[ext]"
                    }
                }
            });

            return config;
        }
    })
);
