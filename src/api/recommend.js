import jsonp from "../common/js/jsonp.js";
import {request} from "../common/js/request.js";

import {commonParams, options} from "./config.js";

export function getRecommend() {
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);

}

export function getDiscList() {
  const url = "/api/getDiscList";
  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: "json"
  });

  console.log(data);

  return request({
    url,
    params: data
  })
}

export function getSongList(disstid) {
  const url = "/api/getSongList";

  const data = Object.assign({} , commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: "json"
  });

  return request({
    url,
    params: data
  })

}
