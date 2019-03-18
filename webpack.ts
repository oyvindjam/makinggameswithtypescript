import { Configuration } from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"

const configuration: Configuration = {
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: /src/
            },
            {
                test: /\.(png|ogg|webm)$/,
                use: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin,
        new HtmlWebpackPlugin({
            title: "Mega fruit baskets",
            favicon: "favicon.ico"
        })
    ]
}

export default configuration