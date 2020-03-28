export const singer = (state) => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {  // 根据当前播放歌曲的索引从播放列表中取出对应索引的歌曲并返回
  return state.playList[state.currentIndex] || {};
};

export const disc = (state) => state.disc;

export const topList = (state) => state.topList;
