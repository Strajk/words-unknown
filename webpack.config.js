const path = require("path")
const exec = require("child_process").exec
const json5 = require("json5")
const CopyWebpackPlugin = require("copy-webpack-plugin")
// const stylus = require("stylus")

const pkg = require("./package.json")

function transformManifest (buffer, mode) {
  const manifest = json5.parse(buffer.toString())

  manifest.name = pkg.meta.name
  manifest.version = pkg.version
  manifest.description = pkg.description
  manifest.homepage_url = pkg.homepage

  if (mode === "development") {
    // For easier development
    manifest.permissions.push("tabs")
    manifest.permissions.push(`http://localhost/reloadExtension?id=${pkg.name}`)
  }
  return JSON.stringify(manifest, null, 2)
}

module.exports = (env, argv) => ({
  optimization: {
    minimize: false,
  },
  devtool: "cheap-module-source-map", // To avoid: Refused to evaluate a string as JavaScript because 'unsafe-eval'
  entry: {
    background: "./src/background",
    options: "./src/options",
    inject: "./src/inject",
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: "src",
        from: "**",
        ignore: [
          "*.js", // Handled by Webpack core
          "*.styl", // Handled separately
          "manifest.json5", // Handled separately
        ],
      },
      { context: "src", from: "manifest.json5", to: "manifest.json", transform: buffer => transformManifest(buffer, argv.mode) },
      { from: "node_modules/webextension-polyfill/dist/browser-polyfill.js" },
      // { context: "src", from: "*.styl", to: "[name].css", transform: buffer => stylus.render(buffer.toString()) },
    ]),
    new ReloadPlugin(),
  ],
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js",
  },
})

class ReloadPlugin {
  apply (compiler) {
    compiler.hooks.afterEmit.tap("ReloadPlugin", function (compilation) {
      const BROWSER = "/System/Volumes/Data/Applications/Google Chrome Canary.app" // uncomment for default browser
      const URL = `http://localhost/reloadExtension?id=${pkg.name}`
      if (BROWSER) {
        exec(`open -a "${BROWSER}" ${URL}`)
      } else {
        exec(`open ${URL}`)
      }
    })
  }
}
