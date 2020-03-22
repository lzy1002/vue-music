import jsonp from "../common/js/jsonp.js";
import {commonParams, options} from "./config";

export function getSingerList() {  // 获取歌手列表数据
  const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";
  const data = Object.assign({}, commonParams, {
    channel: "singer",
    page: "list",
    key: "all_all_all",
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: "yqq",
    g_tk: 1664029744
  });

  return jsonp(url, data, options);

}

export function getSingerDetail(singerId) {  // 接收歌手id 根据歌手id获取歌手的详细信息
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: "yqq",
    order: "listen",
    begin: 0,
    num: 100,
    songstatus: 1,
    g_tk: 1664029744,
    singermid: singerId
  });

  return jsonp(url, data, options);

}
