<template>
  <Scroll class="suggest" :data="result" :pull-up="pullUp" @pullUpLoad="pullUpLoad" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </Scroll>
</template>

<script>
  import Scroll from "../../common/scroll/scroll.vue";
  import Loading from "../../common/loading/loading.vue";

  import {mapMutations, mapActions} from "vuex";
  import {SET_SINGER} from "../../../store/mutations-types.js";

  import {search} from "../../../api/search.js";
  import {getMusicSource} from "../../../api/song.js";
  import {ERR_OK} from "../../../api/config.js";

  import {createSong} from "../../../common/js/song.js";
  import {Singer} from "../../../common/js/singer.js";

  const TYPE_SINGER = "singer";
  const perpage = 20;

  export default {
    name: "suggest",
    props: {
      query: {
        type: String,
        default: ""
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullUp: true,
        hasMore: true,
        originArr: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      _search() {
        this.hasMore = true;
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          console.log(res);
          if(res.data.code === ERR_OK) {
            this._genResult(res.data.data);
            this._checkMore(res.data.data);
          }
        })
      },
      _genResult(data) {
        let ret = [];
        if(data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}});
        }
        if(data.song) {
          let arr = this._normalizeSongs(data.song.list);
          this._getMusicSource(ret, arr);
        }
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          if(item.songid && item.albumid) {
            ret.push(createSong(item));
          }
        });
        return ret;
      },
      _getMusicSource(ret, arr) {
        getMusicSource(arr).then(res => {
          let ar = this.originArr.concat(res);
          this.originArr.push(...res);
          this.result = ret.concat(ar);
        })
      },
      getIconCls(item) {
        if(item.type === TYPE_SINGER) {
          return "icon-mine";
        }else {
          return "icon-music";
        }
      },
      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername;
        }else {
          return `${item.name}-${item.singer}`;
        }
      },
      pullUpLoad() {
        if(!this.hasMore) {
          return;
        }
        this.page++;
        this._search();

      },
      _checkMore(data) {
        const song = data.song;
        if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      selectItem(item) {
        if(item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });

          this.setSinger(singer);

          this.$router.push({
            path: `/search/${singer.id}`
          })
        }else {
          this.insertSong(item);

        }
      },
      ...mapMutations({
        setSinger: SET_SINGER
      }),
      ...mapActions([
        "insertSong"
      ])
    },
    watch: {
      query(newQuery) {
        this.originArr = [];
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        this._search(newQuery);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>