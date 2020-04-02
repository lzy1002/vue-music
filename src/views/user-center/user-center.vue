<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="changeIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="playRandom">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll :delay-refresh="delayRefresh" ref="favoriteScroll" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @selectItem="selectSong"></song-list>
          </div>
        </scroll>
        <scroll :delay-refresh="delayRefresh" ref="playScroll" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @selectItem="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from "../../components/common/switches/switches.vue";
  import Scroll from "../../components/common/scroll/scroll.vue";
  import SongList from "../../components/content/song-list/song-list.vue";
  import NoResult from "../../components/content/no-result/no-result.vue";

  import Song from "../../common/js/song.js";

  import {playListMixin} from "../../common/js/mixin.js";

  import {mapGetters, mapActions} from "vuex";

  export default {
    name: "user-center",
    mixins: [playListMixin],
    data() {
      return {
        switches: [
          {name: "我喜欢的"},
          {name: "最近听的"}
        ],
        currentIndex: 0,
        delayRefresh: 100
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length ? "60px" : "";
        this.$refs.listWrapper.style.bottom = bottom;
        if(this.currentIndex === 0) {
          this.$refs.favoriteScroll.refresh();
        }else {
          this.$refs.playScroll.refresh();
        }
      },
      back() {
        this.$router.back();
      },
      changeIndex(index) {
        this.currentIndex = index;
      },
      selectSong(song, index) {
        this.insertSong(new Song(song));
      },
      playRandom() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
        if(!list.length) return;
        list = list.map(song => new Song(song));
        this.randomPlay({list});
      },
      ...mapActions([
        "insertSong",
        "randomPlay"
      ])
    },
    computed: {
      noResult() {
        if(this.currentIndex === 0) {
          return !this.favoriteList.length;
        }else {
          return !this.playHistory.length;
        }
      },
      noResultTitle() {
        return this.currentIndex ? "暂无播放历史数据" : "暂无收藏歌曲数据";
      },
      ...mapGetters([
        "playHistory",
        "favoriteList"
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.5s ease
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>