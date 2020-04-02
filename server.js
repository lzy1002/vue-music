const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

const apiRouter = express.Router();

app.use(express.static("./dist"));

apiRouter.get("/getDiscList", function (req, res) {
  const url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";

  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: "c.y.qq.com"
    },
    params: req.query
  }).then(result => {
    res.json(result.data);
  }).catch(err => {
    console.log(err);
  })

});

apiRouter.post("/getSongVkey", function (req, res) {
  const url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
  console.log(req.body);
  axios.post(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: "c.y.qq.com"
    },
    data: req.body
  }).then(result => {
    res.json(result.data);
  }).catch(err => {
    console.log(err);
  })

});

apiRouter.get("/lyric", function (req, res) {
  const url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";

  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: "c.y.qq.com"
    },
    params: req.query
  }).then(result => {
    res.json(result.data);
  }).catch(err => {
    console.log(err);
  })

});

apiRouter.get("/getSongList", function (req, res) {
  const url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg";

  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: "c.y.qq.com"
    },
    params: req.query
  }).then(result => {
    res.json(result.data);
  }).catch(err => {
    console.log(err);
  })

});

apiRouter.get("/search", function (req, res) {
  const url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";

  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: "c.y.qq.com"
    },
    params: req.query
  }).then(result => {
    res.json(result.data);
  }).catch(err => {
    console.log(err);
  })

});

app.use("/api", apiRouter);

app.listen(3000, function (err) {
  if(err) {
    console.log(err);
    return;
  }
  console.log("服务已开启监听3000端口");
});
