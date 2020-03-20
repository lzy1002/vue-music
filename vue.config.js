const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("src", path.resolve(__dirname, "src"))
      .set("common", path.resolve(__dirname, "src/common"))
      .set("components", path.resolve(__dirname, "src/components"))
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/getDiscList": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      }
    }
  }
};
