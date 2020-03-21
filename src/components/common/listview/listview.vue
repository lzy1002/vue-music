<template>
  <scroll class="listview" :data="data" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="selectItem(item)" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortCutList" class="item" :class="{current: index === currentIndex}" :data-index="index">{{item}}</li>
      </ul>
    </div>

    <div class="list-fixed" v-show="scrollY < 0" ref="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>

    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>

</template>

<script>
  import Scroll from "../scroll/scroll.vue";
  import Loading from "../loading/loading.vue";

  import {getData} from "../../../common/js/dom.js";

  const ANCHOR_HEIGHT = 18;  // 右边快速入口中每一个元素的高度
  const TITLE_HEIGHT = 30;  // fixedTitle的高度

  export default {
    name: "listview",
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    components: {
      Scroll,
      Loading
    },
    created() {
      this.touch = {};  // 用于存放包含按下和移动时的触摸点
      this.listenScroll = true;  // 传给scroll组件的 是否监听滚动
      this.listHeight = [];  // 用于存放每个list-group的高度
      this.probeType = 3;  // 存储监听滚动的类型
    },
    methods: {
      selectItem(item) {
        this.$emit("selectItem", item);
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, "index");
        if(!anchorIndex && anchorIndex !== 0) return;
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = parseInt(anchorIndex);
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        let anchorIndex = this.touch.anchorIndex + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {  // scroll组件导出的 监听滚动的方法 pos: 当前滚动到的x或y轴的位置
        this.scrollY = pos.y;
      },
      _scrollTo(index) {
        index = index < 0 ? 0 : index;
        index = index > this.data.length - 1 ? this.data.length - 1 : index;
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight() {  // 计算每个list-group的高度
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);

        list.forEach(item => {
          height += item.clientHeight;
          this.listHeight.push(height);
        });
      }
    },
    computed: {
      shortCutList() {  // 得到所有对象中的title 用于展示右侧快速入口导航
        return this.data.map(group => group.title.substr(0, 1));
      },
      fixedTitle() {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : "";  // 计算属性在触发时数据可能还没有传递进来 所以这里需要做一个处理 否则会报错
      }
    },
    watch: {
      data() {  // 因为该组件中的data数据是外部传入的 并且外部的数据也是异步获取的 所以这里当data数据发生变化时 延时20毫秒等待dom根据数据渲染完毕后 再调用计算高度的方法
        window.setTimeout(_ => {
          this._calculateHeight();
        })
      },
      scrollY(newY) {  // 当存储页面滚动位置的变量发生变化时 需要计算出对应当前滚动位置的索引
        const listHeight = this.listHeight;
        listHeight.forEach((item, index) => {
          if(listHeight[index + 1] && this.currentIndex !== index && (Math.abs(newY) >= item && Math.abs(newY) < listHeight[index + 1])) {
            this.currentIndex = index;
          }
        });

        let nextMaxHeight = this.listHeight[this.currentIndex + 1] - TITLE_HEIGHT;
        this.diff = nextMaxHeight + newY;

      },
      diff(newVal) {
        let fixedTop = newVal >= 0 ? 0 : newVal;
        this.fixedTop !== fixedTop ? this.fixedTop = fixedTop : null;  // 减少重复赋值的次数 优化性能
        this.$refs.fixedTitle.style.transform = `translate3d(0, ${this.fixedTop}px, 0)`;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>