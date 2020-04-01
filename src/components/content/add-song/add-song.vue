<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌手" @query="search"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :current-index="currentIndex" @switch="changeIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songScroll" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @selectItem="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :delay-refresh="delayRefresh" ref="searchScroll" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :show-singer="showSinger" @listScroll="blurInput" @select="selectResult"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲以添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from "../search-box/search-box.vue";
  import Suggest from "../suggest/suggest.vue";
  import Switches from "../../common/switches/switches.vue";
  import Scroll from "../../common/scroll/scroll.vue";
  import SongList from "../../content/song-list/song-list.vue";
  import SearchList from "../../content/search-list/search-list.vue";
  import TopTip from "../../common/top-tip/top-tip.vue";

  import {mapGetters, mapActions} from "vuex";

  import Song from "../../../common/js/song.js";

  import {searchMixin} from "../../../common/js/mixin.js";

  export default {
    name: "add-song",
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        // query: "",
        showSinger: false,
        switches: [{name:"最近播放"}, {name: "搜索历史"}],
        currentIndex: 0,
        delayRefresh: 100
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        if(this.currentIndex === 0) {
          this.$refs.songScroll.refresh();
        }else if(this.currentIndex === 1) {
          this.$refs.searchScroll.refresh();
        }
      },
      hide() {
        this.showFlag = false;
      },
      // search(query) {
      //   this.query = query;
      // }
      changeIndex(index) {
        this.currentIndex = index;
      },
      selectResult() {
        this.saveSearchHistory(this.query);
        this.$refs.topTip.show();
      },
      selectSong(song, index) {  // 点击历史歌曲列表导出的方法 song: 歌曲对象 index: 歌曲对象在数组中的索引
        if(index === 0) {
          return;
        }
        this.insertSong(new Song(song));  // 因为当点击播放历史中的歌曲时 拿到的这一项歌曲对象有可能是直接从本地存储中取出来的 那么就不是Song类的实例 所以这里无论当前点击的这一个歌曲对象是否是Song类的实例 那么都将它转化为Song类的实例 这样的话歌曲播放时就可以调用到Song类的实例身上的获取歌词的方法了
        this.$refs.topTip.show();
      },
      ...mapActions([
        "insertSong"
      ])
    },
    computed: {
      ...mapGetters([
        "playHistory",
        "searchHistory"
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.5s ease
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>