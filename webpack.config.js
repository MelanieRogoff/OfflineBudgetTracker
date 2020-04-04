const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./public/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
  },
  mode: "development",
  plugins: [
    new WebpackPwaManifest({
      filename: "manifest.json", //name of generated manifest file

      // we aren't using webpack to generate our html so set inject to false
      inject: false,

      // set fingerprints to `false` to make the names of the generated
      // files predictable making it easier to refer to them in our code
      fingerprints: false,

      name: "Budget Tracker App",
      short_name: "Budgeter",
      theme_color: "#ff3299",
      background_color: "#ff3299",
      start_url: "/",
      display: "standalone",

      icons: [
        {
          src: path.resolve(
            __dirname,
            "public/icons/icon-512x512.png"
            ),
          //plugin will generate an image for each size in the size array
          size: [192, 96, 128, 144, 152, 192, 384]
        }
      ]
    })
  ]
};

module.exports = config;
