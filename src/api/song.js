import {commonParams, options} from "./config.js";

import {request} from "../common/js/request.js";
import jsonp from "../common/js/jsonp";

export function getMusicSource(songs) {
  const url = "/api/getSongVkey";
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  let mids = [];
  let types = [];
  songs.forEach(item => {
    mids.push(item.mid);
    types.push(0);
  });

  return new Promise((resolve, reject) => {
    request({
      method: "post",
      url,
      data: {
        comm: data,
        req_0: {
          module: 'vkey.GetVkeyServer',
          method: 'CgiGetVkey',
          param: {
            guid: getUid(),
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
          }
        }
      }
    }).then(res => {
      if(res.data.code === 0 && res.data.req_0.code === 0) {
        let map = {};
        res.data.req_0.data.midurlinfo.forEach(item => {
          map[item.songmid] = item.purl;
        });
        let result = songs.filter(item => {
          let purl = map[item.mid];
          if(purl) {
            item.url = purl.includes("http://") ? purl : `http://dl.stream.qqmusic.qq.com/${purl}`;
            return true;
          }else {
            return false;
          }
        });
        resolve(result);
      }
    })
  })

}

let _uid = '';

export function getUid () {
  if (_uid) {
    return _uid;
  }
  if (!_uid) {
    const t = (new Date()).getUTCMilliseconds();
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10;
  }
  return _uid;
}
