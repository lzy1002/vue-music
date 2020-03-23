import {playMode} from "../common/js/config.js";

const state = {
  singer: {},
  playing: false,  // 播放器的播放状态
  fullScreen: false,  // 播放器当前是否全屏
  playList: [],  // 播放器的音乐列表
  sequenceList: [],  // 有顺序的音乐列表
  mode: playMode.sequence,  // 播放模式 顺序播放 循环播放 随机播放
  currentIndex: -1  // 当前播放音乐在音乐列表中的索引

};

export default state;
