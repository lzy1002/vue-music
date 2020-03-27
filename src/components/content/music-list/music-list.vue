<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="imageUrl" ref="bgImage">
      <div class="play-wrapper" v-if="songs.length">
        <div class="play" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll class="list" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" @scroll="scroll" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectItem="selectItem"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "../../common/scroll/scroll.vue";
  import Loading from "../../common/loading/loading.vue";
  import SongList from "../song-list/song-list.vue";

  import {mapActions} from "vuex";

  import {prefixStyle} from "../../../common/js/dom.js";

  const TITLE_HEIGHT = 40;

  const transform = prefixStyle("transform");

  export default {
    name: "music-list",
    props: {
      bgImage: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      },
      songs: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        scrollY: -1
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.bgImageHeight = this.$refs.bgImage.clientHeight;  // 拿到图片的高度
      this.layerMaxMove = -this.bgImageHeight + TITLE_HEIGHT;  // 拿到layer的最大滚动出去的距离
      this.$refs.list.$el.style.top = `${this.bgImageHeight}px`;
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      },
      selectItem(item, index) {  // item中存储的是音乐列表中被点击的那一个音乐的数据 index是当前这首音乐在音乐列表中的索引
        this.selectPlay({  // 调用actions中的方法 将当前歌手的音乐列表和当前点击的音乐在音乐列表中的索引传递过去
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        "selectPlay",
        "randomPlay"
      ])
    },
    computed: {
      imageUrl() {
        return `backgroundImage: url(${this.bgImage})`;
      }
    },
    watch: {
      scrollY(newY) {
        let maxMove = Math.max(this.layerMaxMove, newY);  // 计算layer的滚动距离 目的是当layer滚动到一定位置之后不再跟随可滚动区域移动 而是固定在某个位置
        let zIndex = 0;
        let scale = 1;
        let blur = 0;
        this.$refs.bgLayer.style[transform] = `translate3d(0, ${maxMove}px, 0)`;
        const percent = Math.abs(newY / this.bgImageHeight);  // 通过该公式计算出可滚动区域当前移动的距离占背景图片高度的百分比 这个百分比用于计算图片的缩放比例和高斯模糊的效果
        if(newY > 0) {
          zIndex = 10;
          scale = 1 + percent;
        }else {
          blur = Math.min(20 * percent, 20);
        }
        this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;

        this.$refs.bgImage.style[transform] = `scale(${scale})`;

        if(newY <= this.layerMaxMove) {
          zIndex = 10;
          this.$refs.bgImage.style.height = TITLE_HEIGHT + "px";
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.playBtn.style.display = "none";
        }else {
          this.$refs.bgImage.style.height = 0 + "px";
          this.$refs.bgImage.style.paddingTop = "70%";
          this.$refs.playBtn.style.display = "";
        }
        this.$refs.bgImage.style.zIndex = zIndex;
      }
    },
    components: {
      Loading,
      Scroll,
      SongList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>