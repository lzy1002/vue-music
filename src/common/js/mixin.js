import {mapGetters, mapMutations, mapActions} from "vuex";
import {SET_PLAY_MODE, SET_PLAYLIST, SET_CURRENT_INDEX} from "../../store/mutations-types.js";
import {playMode} from "./config.js";
import {shuffle} from "./utils.js";

export const playListMixin = {  // 让页面适配底部mini播放器的混入
  computed: {
    ...mapGetters([
      "playList"
    ])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList() {
      throw new Error("component must implement handlePlayList method");
    }
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  }

};

export const playerMixin = {  // 切换播放模式的混入
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? "icon-sequence" : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
    ...mapGetters([
      "sequenceList"
    ])
  },
  methods: {
    changeMode() {  // 切换播放模式的方法
      const mode = (this.mode + 1) % 3;  // 播放模式为0 || 1 || 2
      this.setPlayMode(mode);  // 调用vuex中的方法修改当前的播放模式
      let list = null;  // 创建一个用来存数组的变量
      if(mode === playMode.random) {  // 判断当前设置的播放模式如果是随机播放
        list = shuffle(this.sequenceList);  // 那么就要对顺序播放的数组进行洗牌 达到随机播放的效果  但是这里需要注意 shuffle方法内部会对传入的数组进行修改 但是这里传入的顺序播放数组是不可以被修改顺序的 所以这里使用数组展开放进另一个数组中的方法 实现浅拷贝 来达到目的
      }else {
        list = this.sequenceList;
      }
      this.resultCurrentIndex(list, this.currentSong);
      this.setPlayList(list);
    },
    resultCurrentIndex(list, currentSong) {  // 该方法用于获取当前正在播放的歌曲在最新的播放列表中的索引 得到索引后将索引设置到vuex的state中  该方法的作用是用于解决当播放列表顺序发生变化但是索引没发生变化 造成修改播放列表之后 正在播放的歌曲发生跳转的问题
      let index = list.findIndex(item => item.id === currentSong.id);
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      "setCurrentIndex": SET_CURRENT_INDEX,
      "setPlayMode": SET_PLAY_MODE,
      "setPlayList": SET_PLAYLIST
    })
  }
};

export const searchMixin = {
  data() {
    return {
      query: ""
    }
  },
  methods: {
    search(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    saveSearch() {  // 当用户点击了某个搜索结果时 调用actions中的方法将当前用户输入的搜索内容添加到本地存储中对应的数组中并将添加后数组同步到vuex中
      this.saveSearchHistory(this.query);
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    deleteSearch(query) {  // 删除传入的搜索结果
      this.deleteSearchHistory(query);
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory"
    ])
  }
};
