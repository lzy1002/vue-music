<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from "better-scroll";

  export default {
    name: "scroll",
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {  // 是否监听插件滚动事件
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      delayRefresh: {
        type: Number,
        default: 20
      }
    },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullUpLoad: this.pullUp
        });

        if(this.listenScroll) {
          this.scroll.on("scroll", pos => {
            this.$emit("scroll", pos);
          })
        }

        if(this.pullUp) {
          this.scroll.on("pullingUp", () => {  // 当可滚动区域到底时触发
            this.$emit("pullUpLoad");
            this.scroll.finishPullUp();
          })
        }

        if(this.beforeScroll) {
          this.scroll.on("beforeScrollStart", () => {  // 当BScroll控制区域开始滚动时触发
            this.$emit("beforeStart");
          })
        }

      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {  // 让插件重新计算可滚动区域的距离
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {  // 传入一个具体数值和动画时间 滚动到指定数值的位置
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {  // 传入一个元素和动画时间 滚动到元素距离页面顶部为0的位置
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    mounted() {
      window.setTimeout(_ => {
        this._initScroll();
      }, 20)
    },
    watch: {
      data() {  // 监听页面中使用该组件时传递的数据 当传入的数据发生变化时 等待20毫秒后执行一次refresh 重新计算可滚动区域的高度
        window.setTimeout(_ => {
          this.refresh();
        }, this.delayRefresh)
      }
    }
  }
</script>

<style scoped>

</style>