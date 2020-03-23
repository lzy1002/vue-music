import * as types from "./mutations-types.js";

export const selectPlay = function ({commit, state}, {list, index}) {  // 用于当点击某个音乐列表中的某个音乐时将整个音乐列表的数据和当前点击的这一项音乐在列表中的索引存入到vuex中对应的state中 同时将播放状态设置为true 播放器全屏设置为true
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
