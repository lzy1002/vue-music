import * as types from "./mutations-types.js";

import {shuffle} from "../common/js/utils.js";
import {playMode} from "../common/js/config.js";

export const selectPlay = function ({commit, state}, {list, index}) {  // 用于当点击某个音乐列表中的某个音乐时将整个音乐列表的数据和当前点击的这一项音乐在列表中的索引存入到vuex中对应的state中 同时将播放状态设置为true 播放器全屏设置为true
  commit(types.SET_SEQUENCE_LIST, list);
  if(state.mode !== playMode.random) {  // 当点击列表时 判断当前播放状态是不是随机播放
    commit(types.SET_PLAYLIST, list);  // 如果不是随机播放则将传递进来的正序的列表和当前点击的索引直接调用mutations中的方法设置给state
  }else {  // 如果是随机播放
    let id = list[index].id;  // 则拿到当前点击的正序列表中的这一项的id值
    let randomList = state.playList;  // 拿到之前的乱序列表
    index = randomList.findIndex(item => item.id === id);  // 在乱序列表中找到和点击的正序列表中的id值一致的这一项的索引  然后设置到vuex的state中
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
