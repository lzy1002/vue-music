<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @selectItem="selectSinger" ref="list"></list-view>

    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import {ERR_OK} from "../../api/config.js";
  import {Singer} from "../../common/js/singer.js";

  import {getSingerList} from "../../api/singer.js";

  import {playListMixin} from "../../common/js/mixin.js";

  import {SET_SINGER} from "../../store/mutations-types.js";
  import {mapMutations} from "vuex";

  import ListView from "../../components/common/listview/listview.vue";

  const HOT_NAME = "热门";
  const HOT_SINGER_LEN = 10;

  export default {
    name: "singer",
    mixins: [playListMixin],
    data() {
      return {
        singers: [],
        transitionName: ""
      }
    },
    components: {
      ListView
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({path: `/singer/${singer.id}`});
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then(res => {
          if(res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
            console.log(this.singers);
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };

        list.forEach((item, index) => {
          if(index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }

          const key = item.Findex;

          if(!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        });

        let hot = [];
        let ret = [];

        for(let key in map) {
          let val = map[key];
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          }else if(val.title === HOT_NAME) {
            hot.push(val);
          }
        }

        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        return hot.concat(ret);

      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? "60px" : "";
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      ...mapMutations({
        setSinger: SET_SINGER  // 把mutations中名为SET_SINGER的值的方法 映射到setSinger中 之后就可以使用setSinger来调用方法了
      })
    },
    created() {
      this._getSingerList();
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .move-enter-active, .move-leave-active
    transition all 0.5s ease
  .move-enter, .move-leave-to
    transform translate3d(100%, 0, 0)

  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
