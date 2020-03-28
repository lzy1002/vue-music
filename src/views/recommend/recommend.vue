<template>
  <div class="recommend" ref="recommend">
    <scroll :data="discList" class="recommend-content" ref="scroll">
      <div>
        <div class="slider-wrapper">
          <slider v-if="this.recommends.length" :auto-play="false">
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img @load="imageLoad" :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" @click="selectItem(item)" v-for="item in discList">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from "vuex";
  import {SET_DISC} from "../../store/mutations-types.js";

  import {getRecommend, getDiscList} from "../../api/recommend.js";
  import {ERR_OK} from "../../api/config.js";

  import {playListMixin} from "../../common/js/mixin.js";

  import Slider from "../../components/common/slider/slider.vue";
  import Scroll from "../../components/common/scroll/scroll.vue";
  import Loading from "../../components/common/loading/loading.vue";

  export default {
    name: "recommend",
    mixins: [playListMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    methods: {
      _getRecommend() {
        getRecommend().then(res => {
          if(res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if(res.data.code === ERR_OK) {
            this.discList = res.data.data.list;
            console.log(this.discList);
          }
        })
      },
      imageLoad() {
        if(!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? "60px" : "";
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.setDisc(item);
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
      },
      ...mapMutations({
        setDisc: SET_DISC
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .move-enter-active, .move-leave-active
    transition all 500ms ease
  .move-enter, .move-leave-to
    transform translateX(100%)

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>