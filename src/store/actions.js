import * as types from "./mutations-types.js";

import {shuffle} from "../common/js/utils.js";
import {playMode} from "../common/js/config.js";
import {saveSearch, deleteSearch, clearSearch, savePlay} from "../common/js/cache.js";

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

export const randomPlay = function ({commit}, {list}) {  // 处理点击列表随机播放
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({commit, state}, song) {  // 处理搜索页面点击歌曲时的业务
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  const currentSong = playList[currentIndex];  // 当前正在播放的歌曲

  const fpIndex = playList.findIndex(item => item.id === song.id);  // 查看当前播放列表中是否存在当前传入的歌曲

  currentIndex++;

  playList.splice(currentIndex, 0, song);

  if(fpIndex > -1) {
    if(currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    }else {
      playList.splice(fpIndex + 1, 1);
    }
  }


  let currentSIndex = sequenceList.findIndex(item => item.id === currentSong.id);

  let fsIndex = sequenceList.findIndex(item => item.id === song.id);

  currentSIndex++;

  sequenceList.splice(currentSIndex, 0, song);

  if(fsIndex > -1) {
    if(currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    }else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);

};

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));  // 先调用saveSearch方法 将传入的项添加到本地存储中保存搜索历史的数组中 然后把数组再设置到本地存储中 该方法返回已经添加完当前项的本地存储中的数组 然后再调用mutations中的方法 将返回的数组设置到vuex的state中
};

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = function ({commit, state}, song) {  // 当点击顺序列表中的删除按钮时触发
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  const pIndex = playList.findIndex(item => item.id === song.id);  // 找到播放列表中对应当前传入项的索引
  playList.splice(pIndex, 1);  // 删除掉这一项

  if(currentIndex > pIndex || currentIndex === playList.length) {  // 当删除完播放列表中对应项之后 需要判断删除的这一项是否在当前播放的歌曲的上面或者当前播放的索引等于删除完毕之后的播放列表的长度时
    currentIndex--;  // 那么都让当前播放歌曲的索引-1
  }

  const sIndex = sequenceList.findIndex(item => item.id === song.id);  // 找到顺序列表中对应当前传入项的索引
  sequenceList.splice(sIndex, 1);  // 删除掉顺序列表中的这一项

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  if(!playList.length) {  // 当删除操作完毕之后 判断当前播放列表的长度是否为空 如果为空 那么将播放状态设置为false
    commit(types.SET_PLAYING_STATE, false);
  }else {
    commit(types.SET_PLAYING_STATE, true);  // 如果删除之后列表中还有歌曲 那么就让播放状态设置为true
  }

};

export const clearSongList = function ({commit}) {  // 清空播放列表
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = function ({commit, state}, song) {  // 存储歌曲到播放历史列表中和本地存储中
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};
