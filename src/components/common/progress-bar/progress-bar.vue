<template>
  <div class="progress-bar" ref="progressBar" @click="barClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" @touchstart="progressTouchStart" @touchmove="progressTouchMove" @touchend="progressTouchEnd">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const BTN_WIDTH = 16;  // 进度条按钮的宽度

  import {prefixStyle} from "../../../common/js/dom.js";

  const transform = prefixStyle("transform");

  export default {
    name: "progress-bar",
    props: {
      percent: {  // 外部传入的歌曲当前播放进度百分比 例：0.15
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {};  // 用于存储一些touch相关的数据
    },
    methods: {
      progressTouchStart(e) {  // 按钮的touch事件
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.progressWidth = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if(!this.touch.initiated) return;
        const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH;
        this.touch.diff = e.touches[0].pageX - this.touch.startX;
        let offsetWidth = Math.min(barWidth, Math.max(0, this.touch.progressWidth + this.touch.diff));
        this._offset(offsetWidth);
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      barClick(e) {  // 点击进度条盒子时实现切换播放时间
        let clickX = e.pageX;
        let barX = this.$refs.progressBar.offsetLeft;
        let offsetWidth = clickX - barX;
        this._offset(offsetWidth);

        this._triggerPercent();
      },
      _triggerPercent() {  // 根据当前进度条的宽度和进度条盒子宽度 算出当前进度的百分比 并传递到父元素中
        const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH;
        const percent = this.$refs.progress.clientWidth / barWidth;

        this.$emit("percentChange", percent);
      },
      _offset(offsetWidth) {  // 设置按钮和进度条的位置
        this.$refs.progress.style.width = offsetWidth + "px";
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      }
    },
    watch: {
      percent(newPercent) {  // 根据传入的歌曲播放的百分比 计算出进度条当前的宽度
        if(newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH;
          const offsetWidth = barWidth * newPercent;
          this._offset(offsetWidth);
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>