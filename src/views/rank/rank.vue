<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.singername}}-{{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div v-if="!topList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from "../../api/rank.js";
  import {ERR_OK} from "../../api/config.js";

  import Scroll from "../../components/common/scroll/scroll.vue";
  import Loading from "../../components/common/loading/loading.vue";

  import {SET_TOPLIST} from "../../store/mutations-types.js";

  import {playListMixin} from "../../common/js/mixin.js";
  import {mapMutations} from "vuex";

  export default {
    name: "rank",
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList();
    },
    methods: {
      _getTopList() {
        getTopList().then(res => {
          if(res.code === ERR_OK) {
            this.topList = res.data.topList;
            console.log(this.topList);
          }
        })
      },
      selectItem(list) {
        this.setTopList(list);
        this.$router.push({
          path: `/rank/${list.id}`
        })
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? "60px" : "";
        this.$refs.rank.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      ...mapMutations({
        "setTopList": SET_TOPLIST
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .move-enter-active, .move-leave-active
    transition all 500ms ease
  .move-enter, .move-leave-to
    transform translateX(100%)

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>