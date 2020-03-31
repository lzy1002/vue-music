import {playMode} from "../common/js/config.js";
import {loadSearch} from "../common/js/cache.js";

const state = {
  singer: {},
  playing: false,  // 播放器的播放状态
  fullScreen: false,  // 播放器当前是否全屏
  playList: [],  // 播放器的音乐列表
  sequenceList: [],  // 有顺序的音乐列表
  mode: playMode.sequence,  // 播放模式 顺序播放 循环播放 随机播放
  currentIndex: -1,  // 当前播放音乐在音乐列表中的索引
  disc: {},  // 点击的推荐歌单的数据
  topList: {},  // 点击的rank的数据
  searchHistory: loadSearch()  // 搜索历史 设置为loadSearch方法的返回值 目的是让每一次刷新页面之后将本地存储中对应的数据同步到这里
};

export default state;
