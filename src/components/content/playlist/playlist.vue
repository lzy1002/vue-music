<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" @click="changeMode" :class="iconMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :delayRefresh="delayRefresh">
          <transition-group name="list" tag="ul">
            <li :key="item.id" ref="listItem" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentCls(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirm-btn-text="清空" @confirm="clearList"></confirm>

      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
  import Scroll from "../../common/scroll/scroll.vue";
  import Confirm from "../../common/confirm/confirm.vue";
  import AddSong from "../../content/add-song/add-song.vue";

  import {mapGetters, mapMutations, mapActions} from "vuex";
  import {SET_CURRENT_INDEX, SET_PLAYING_STATE} from "../../../store/mutations-types.js";
  import {playMode} from "../../../common/js/config.js";

  import {playerMixin} from "../../../common/js/mixin.js";

  export default {
    name: "playlist",
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        delayRefresh: 100
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        window.setTimeout(_ => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong);
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      getCurrentCls(item) {  // 根据当前播放歌曲的id和顺序列表中每一项的id对比 如果一致 那么则返回一个icon的类 表示正在播放列表中的这一首歌曲
        if(item.id === this.currentSong.id) {
          return "icon-play";
        }
        return "";
      },
      selectItem(item, index) {  // 当点击顺序列表中的某一首歌曲的时候 播放歌曲播放列表中对应的歌曲
        if(this.mode === playMode.random) {  // 判断当前的播放状态是不是随机播放 如果是随机播放 那么歌曲播放列表中的歌曲就是乱序的
          index = this.playList.findIndex(song => song.id === item.id);  // 那么就要根据当前点击的顺序列表中的歌曲的数据中的id 去乱序的播放列表中找到对应id的歌曲的索引 然后将索引设置给currentIndex完成播放点击的歌曲的业务
        }
        this.setCurrentIndex(index);  // 如果不是随机播放 那么就说明当前歌曲播放列表中的歌曲是和顺序列表中的歌曲顺序是一致的 那么可以直接将点击的顺序列表的索引 设置给currentIndex去播放歌曲播放列表中对应的歌曲
        this.setPlayingState(true);
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex(item => item.id === current.id);
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
      },
      deleteOne(item) {  // 当点击顺序列表中的删除按钮时触发
        this.deleteSong(item);
        if(!this.playList.length) {
          this.showFlag = false;
        }
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      clearList() {  // 清空播放列表
        this.clearSongList();
        this.hide();
      },
      addSong() {  // 添加歌曲到列表
        this.$refs.addSong.show();
      },
      ...mapMutations({
        "setCurrentIndex": SET_CURRENT_INDEX,
        "setPlayingState": SET_PLAYING_STATE
      }),
      ...mapActions([
        "deleteSong",
        "clearSongList"
      ])
    },
    computed: {
      modeText() {  // 根据播放模式返回不同的文字
        return this.mode === playMode.sequence ? "顺序播放" : this.mode === playMode.loop ? "单曲循环" : "随机播放";
      },
      ...mapGetters([
        "sequenceList",
        "currentSong",
        "mode",
        "playList"
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!this.showFlag || newSong.id === oldSong.id) {
          return;
        }
        this.scrollToCurrent(newSong);
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>