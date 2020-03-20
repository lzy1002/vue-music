<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll";

  import {addClass} from "../../../common/js/dom.js";

  export default {
    name: "slider",
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        children: [],
        dots: [],
        currentPageIndex: 0  // 用于dot
      }
    },
    mounted() {
      window.setTimeout(_ => {  // 设置定时器的作用是等dom真正渲染完毕后再进行初始化 延迟20毫秒是因为浏览器的刷新机制是17毫秒 这里也可以使用$nextTick
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if(this.autoPlay) this._play();  // 让轮播图自动播放一次

        window.addEventListener("resize", () => {  // 在页面尺寸发生变化时调用_setSliderWidth方法为每个图片的盒子设置宽度和为整体滚动的容器设置宽度
          this._setSliderWidth(true);  // 传入true是因为方法内部需要根据这个值来判断是否是resize时触发该方法
          this.slider.refresh();  // 调用该方法会让页面在resize的时候更加流畅
        })

      }, 20);
    },
    methods: {
      _setSliderWidth(isResize) {  // 用于初始化sliderGroup元素的宽度 保证所有图片都可以横向展示 和 为替换插槽的每一个元素添加slider-item类
        this.children = this.$refs.sliderGroup.children;
        let width = 0;  // sliderGroup的宽度
        let sliderWidth = this.$refs.slider.clientWidth;  // 拿到轮播图最外层容器的宽度 其实也就是屏幕的宽度 用来表示每一张图片的宽度

        for(let i = 0; i< this.children.length; i++) {
          let child = this.children[i];  // 拿到每一个元素
          addClass(child, "slider-item");
          child.style.width = sliderWidth + "px"; // 设置每一张图片的宽度为当前屏幕的宽度
          width += sliderWidth;
        }

        if(this.loop && !isResize) {  // 如果轮播图需要循环播放 那么还需要让sliderGroup的宽度加上两个屏幕的宽度
          width += 2 * sliderWidth;
        }

        this.$refs.sliderGroup.style.width = width + "px";
      },
      _initSlider() {  // 用于初始化BScroll 实现轮播效果
        this.slider = new BScroll(this.$refs.slider, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        this.slider.on("scrollEnd", () => {  // 为BScroll实例绑定滚动结束事件
          let pageIndex = this.slider.getCurrentPage().pageX;  // 当每次滚动结束的时候 都可以通过该方法拿到当前滚动位置对应的索引
          this.currentPageIndex = pageIndex;  // 把当前的索引设置给data中对应的变量

          if(this.autoPlay) {  // 当每次滚动结束之后 判断是否需要自动轮播 如果需要 那么就清除上一次定时器 并调用自动播放的方法
            window.clearTimeout(this.timeId);
            this._play();
          }
        })
      },
      _initDots() {  // 用于初始化指示器
        this.dots = new Array(this.children.length);  // 创建一个空数组 用于遍历生成dot
      },
      _play() {  // 用于自动播放轮播图
        this.timeId = window.setTimeout(_ => {
          this.slider.next();  // 该方法用于让轮播图播放下一张  当设置了loop的时候 这个下一张方法会自动以循环形式播放
        }, this.interval);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>