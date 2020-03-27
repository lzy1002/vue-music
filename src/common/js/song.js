import {getLyric} from "../../api/song.js";
import {ERR_OK} from "../../api/config.js";

import {Base64} from "js-base64";

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if(this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if(res.data.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.data.lyric);
          resolve(this.lyric);
        }else {
          reject("no lyric");
        }
      })
    })

  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,  // 封面图片地址
  })
}

function filterSinger(singerArr) {
  let ret = [];
  if(!singerArr) return;

  singerArr.forEach(item => {
    ret.push(item.name);
  });

  return ret.join("/");

}
