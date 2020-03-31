<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="search"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div v-show="query" class="search-result" ref="suggestWrapper">
      <suggest ref="suggest" :query="query" :show-singer="showSinger" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>

    <confirm ref="confirm" text="是否清空所有搜索记录" confirm-btn-text="清空" @confirm="clearSearch"></confirm>
    <transition name="move">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from "../../components/content/search-box/search-box.vue";
  import Suggest from "../../components/content/suggest/suggest.vue";
  import SearchList from "../../components/content/search-list/search-list.vue";
  import Confirm from "../../components/common/confirm/confirm.vue";
  import Scroll from "../../components/common/scroll/scroll.vue";

  import {playListMixin} from "../../common/js/mixin.js";

  import {mapActions, mapGetters} from "vuex";

  import {getHotKey} from "../../api/search.js";

  import {ERR_OK} from "../../api/config.js";

  export default {
    name: "search",
    mixins: [playListMixin],
    data() {
      return {
        hotKey: [],
        query: "",
        showSinger: true
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    created() {
      this._getHotKey();
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory);
      },
      ...mapGetters([
        "searchHistory"
      ])
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? "60px" : "";
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh();
        this.$refs.suggestWrapper.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
      _getHotKey() {
        getHotKey().then(res => {
          if(res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
            console.log(this.hotKey);
          }
        })
      },
      addQuery(query) {
        console.log(query);
        this.$refs.searchBox.setQuery(query);
      },
      search(query) {
        this.query = query;
      },
      blurInput() {
        this.$refs.searchBox.blur();
      },
      saveSearch() {  // 当用户点击了某个搜索结果时 调用actions中的方法将当前用户输入的搜索内容添加到本地存储中对应的数组中并将添加后数组同步到vuex中
        this.saveSearchHistory(this.query);
      },
      deleteSearch(query) {  // 删除传入的搜索结果
        this.deleteSearchHistory(query);
      },
      clearSearch() {  // 清空所有的搜索结果
        this.clearSearchHistory();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      ...mapActions([
        "saveSearchHistory",
        "deleteSearchHistory",
        "clearSearchHistory"
      ])
    },
    watch: {
      query(newVal) {
        if(!newVal) {
          window.setTimeout(_ => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .move-enter-active, .move-leave-active
    transition all 500ms ease
  .move-enter, .move-leave-to
    transform translateX(100%)

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>