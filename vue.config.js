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
      "/api/getDiscList": {
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
      },
      "/api/getSongVkey": {
        target: "https://u.y.qq.com/cgi-bin/musicu.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/getSongVkey": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      },
      "/api/lyric": {
        target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/lyric": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      },
      "/api/getSongList": {
        target: "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api/getSongList": ""
        },
        headers: {
          referer: "https://c.y.qq.com/",
          host: "c.y.qq.com"
        }
      }
    }
  }
};
