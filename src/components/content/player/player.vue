<template>
  <div class="player" v-show="playList.length > 0">   <!--根据音乐列表的歌曲数量来控制播放器整体的显示和隐藏-->
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">    <!--根据是否全屏显示的布尔值来控制全屏的播放器是否显示-->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{current: currentLineNum === index}" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="normalPlayIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen">  <!--如果全屏的播放器没有显示 那么这里的mini播放器就会显示 反之则隐藏-->
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdClass">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayIcon" @click.stop="togglePlaying" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="ended"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";

  import {SET_FULL_SCREEN, SET_PLAYING_STATE, SET_CURRENT_INDEX, SET_PLAY_MODE, SET_PLAYLIST} from "../../../store/mutations-types.js";
  import {playMode} from "../../../common/js/config.js";

  import ProgressBar from "../../common/progress-bar/progress-bar.vue";
  import ProgressCircle from "../../common/progress-circle/progress-circle.vue";
  import Scroll from "../../common/scroll/scroll.vue";

  import {prefixStyle} from "../../../common/js/dom.js";
  import {shuffle} from "../../../common/js/utils.js";

  import animations from "create-keyframe-animation";
  import Lyric from "lyric-parser";

  const transition = prefixStyle("transition");
  const transitionDuration = prefixStyle("transitionDuration");
  const transform = prefixStyle("transform");
  const animation = prefixStyle("animation");

  export default {
    name: "player",
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: "cd",
        playingLyric: ""
      }
    },
    created() {
      this.touch = {};
    },
    computed: {
      normalPlayIcon() {
        return this.playing ? "icon-pause" : "icon-play";
      },
      miniPlayIcon() {
        return this.playing ? "icon-pause-mini" : "icon-play-mini";
      },
      cdClass() {
        return this.playing ? "play" : "play pause";
      },
      iconMode() {
        return this.mode === playMode.sequence ? "icon-sequence" : this.mode === playMode.loop ? "icon-loop" : "icon-random";
      },
      disableCls() {
        return this.songReady ? "" : "disable";
      },
      percent() {  // 计算歌曲当前播放时间占总时间的百分比
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        "playList",
        "fullScreen",
        "currentSong",
        "playing",
        "currentIndex",
        "mode",
        "sequenceList"
      ])
    },
    methods: {
      back() {  // 隐藏全屏播放器  打开mini播放器
        this.setFullScreen(false);  // 由vuex中的数据进行控制
      },
      open() {  // 打开全屏播放器  隐藏mini播放器
        this.setFullScreen(true);
      },
      enter(el, done) {  // 执行cd进入动画
        const {x, y, scale} = this._getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: "move",
          animation,
          presets: {
            duration: 400,
            easing: "linear"
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, "move", done);

      },
      afterEnter() {
        animations.unregisterAnimation("move");
        this.$refs.cdWrapper.style[animation] = "";
      },
      leave(el, done) {  // 注意！！！ done是一个函数 该函数必须在当前次动画结束后调用 如果调用过早 那么动画不会执行 如果不调用 那么后面的afterLeave函数不会执行
        const {x, y, scale} = this._getPosAndScale();

        this.$refs.cdWrapper.style[transition] = "all 200ms";
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        this.$refs.cdWrapper.addEventListener("transitionend", done);
      },
      afterLeave() {
        this.$refs.cdWrapper.style[transition] = "none";
        this.$refs.cdWrapper.style[transform] = "none";
      },
      _getPosAndScale() {  // 获取cd移动到的目标位置的方法 因为屏幕大小可能不一致 所以这里使用js来进行计算  移动的基准是cd的中心点
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

        return {
          x,
          y,
          scale
        }

      },
      togglePlaying() {
        if(!this.songReady) return;
        this.setPlayingState(!this.playing);
        if(this.currentLyric) {
          this.currentLyric.togglePlay();  // 当点击切换播放状态的按钮时 也要切换歌词的滚动状态
        }
      },
      prev() {
        if(!this.songReady) return;  // 判断 只有当 当前歌曲可以播放时才可以点击上一首或者下一首 可以避免错误
        if(this.playList.length === 1) {
          this.loop();
        }else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurrentIndex(index);
          if (this.playing === false) this.togglePlaying();
        }
        this.songReady = false;
      },
      next() {
        if(!this.songReady) return;
        if(this.playList.length === 1) {
          this.loop();
        }else {
          let index = this.currentIndex + 1;
          if (index === this.playList.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (this.playing === false) this.togglePlaying();  // 如果当前播放状态为false 那么就调用切换播放状态的方法 让播放状态为true
        }
        this.songReady = false;
      },
      loop() {
        this.currentTime = 0;
        this.$refs.audio.play();
        if(this.currentLyric) {
          this.currentLyric.seek(0);  // 当歌曲需要单曲循环并播放完毕后 调用该方法 让歌词回调顶部
        }
      },
      ready() {  // 当歌曲可以播放时触发
        this.songReady = true;
      },
      error() {  // 当歌曲播放错误时触发
        this.songReady = true;
      },
      ended() {  // 当歌曲播放完毕后触发
        if(this.mode === playMode.loop) {
          this.loop();
        }else {
          this.next();
        }
      },
      updateTime(e) {  // 当音乐播放时间发生改变时触发
        this.currentTime = e.target.currentTime;
      },
      formatTime(interval) {  // 格式化播放时间的方法
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);

        return `${minute}:${second}`;

      },
      _pad(num, n = 2) {  // 为传入的数字前面补0的方法 当传入的num的长度小于传入的n的数值时 在num前面补一个0 直到补过0的num的长度等于传入的n的数值时停止 返回num
        let len = num.toString().length;

        while(len < n) {
          num = "0" + num;
          len++;
        }

        return num;
      },
      percentChange(percent) {  // 当进度条发生拖拽和点击时 进度条组件向外导出的函数 包含当前进度条的进度
        const currentTime = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = currentTime;
        if(this.playing === false) this.togglePlaying();
        if(this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);  // 当拖拽进度条或点击进度条时调用该方法 传入对应当前进度条位置的毫秒时间 那么插件就会调用handleLyric这个回调函数 并将对应当前时间的歌词的行数传入
        }
      },
      changeMode() {  // 切换播放模式的方法
        const mode = (this.mode + 1) % 3;  // 播放模式为0 || 1 || 2
        this.setPlayMode(mode);  // 调用vuex中的方法修改当前的播放模式
        let list = null;  // 创建一个用来存数组的变量
        if(mode === playMode.random) {  // 判断当前设置的播放模式如果是随机播放
          list = shuffle(this.sequenceList);  // 那么就要对顺序播放的数组进行洗牌 达到随机播放的效果  但是这里需要注意 shuffle方法内部会对传入的数组进行修改 但是这里传入的顺序播放数组是不可以被修改顺序的 所以这里使用数组展开放进另一个数组中的方法 实现浅拷贝 来达到目的
        }else {
          list = this.sequenceList;
        }
        this.resultCurrentIndex(list, this.currentSong);
        this.setPlayList(list);
      },
      resultCurrentIndex(list, currentSong) {  // 该方法用于获取当前正在播放的歌曲在最新的播放列表中的索引 得到索引后将索引设置到vuex的state中  该方法的作用是用于解决当播放列表顺序发生变化但是索引没发生变化 造成修改播放列表之后 正在播放的歌曲发生跳转的问题
        let index = list.findIndex(item => item.id === currentSong.id);
        this.setCurrentIndex(index);
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {  // 调用当前歌曲实例对象中的方法 获取对应当前歌曲的歌词 方法返回promise
          this.currentLyric = new Lyric(lyric, this.handleLyric);  // 使用lyric-parser插件 传入已经转化为汉字的歌词 第二个参数是一个回调函数
          if(this.playing) {
            this.currentLyric.play();  // 当调用这个play方法开始 就会不停的在时间对应歌词时间时触发传入的handleLyric回调函数
          }
          console.log(this.currentLyric);
        }).catch(err => {
          this.currentLyric = null;
          this.currentLineNum = 0;
          this.playingLyric = "";
        })
      },
      handleLyric({lineNum, txt}) {  // 该函数在播放到对应歌词的位置就会回调一次  lineNum: 当前播放到的歌词的行数  txt: 当前播放到的歌词的内容
        this.currentLineNum = lineNum;
        this.playingLyric = txt;
        if(lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        }else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
      },
      middleTouchStart(e) {
        this.touch.initiated = true;
        const touches = e.touches[0];
        this.touch.startX = touches.pageX;
        this.touch.startY = touches.pageY;
        this.$refs.lyricList.$el.style[transitionDuration] = "0ms";
        this.$refs.middleL.style[transitionDuration] = "0ms";
      },
      middleTouchMove(e) {
        if(!this.touch.initiated) return;
        let left = this.currentShow === "cd" ? 0 : -window.innerWidth;
        const touches = e.touches[0];
        const moveX = touches.pageX;
        const moveY = touches.pageY;
        const diffX = moveX - this.touch.startX;
        const diffY = moveY - this.touch.startY;
        if(Math.abs(diffY) > Math.abs(diffX)) return;
        const move = Math.min(0, Math.max(-window.innerWidth, left + diffX));
        this.touch.percent = Math.abs(move / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${move}px, 0, 0)`;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      },
      middleTouchEnd() {
        let left = 0;
        let opacity = undefined;
        if(this.currentShow === "cd") {
          if(this.touch.percent > 0.2) {
            left = -window.innerWidth;
            opacity = 0;
            this.currentShow = "lyric";
          }else {
            left = 0;
            opacity = 1;
          }
        } else{
          if(this.touch.percent < 0.8) {
            left = 0;
            opacity = 1;
            this.currentShow = "cd";
          }else {
            opacity = 0;
            left = -window.innerWidth;
          }
        }
        this.$refs.lyricList.$el.style[transitionDuration] = "300ms";
        this.$refs.middleL.style[transitionDuration] = "300ms";
        this.$refs.lyricList.$el.style[transform] = `translate3d(${left}px, 0, 0)`;
        this.$refs.middleL.style.opacity = opacity;
        this.touch.initiated = false;
        this.touch.percent = undefined;
      },
      ...mapMutations({
        "setFullScreen": SET_FULL_SCREEN,
        "setPlayingState": SET_PLAYING_STATE,
        "setCurrentIndex": SET_CURRENT_INDEX,
        "setPlayMode": SET_PLAY_MODE,
        "setPlayList": SET_PLAYLIST
      })
    },
    watch: {
      currentSong(newSong, oldSong) {  // 当vuex中的getters中根据当前播放列表和当前索引映射出来的当前播放歌曲的数据发生变化时会触发
        if(newSong.id === oldSong.id) {  // 判断如果当前返回的需要播放的歌曲和切换歌曲之前播放的歌曲的数据一致 那么就不执行下面的代码  用于解决切换播放模式后当前播放歌曲没有发生变化 但是会让歌曲播放的问题
          return;
        }
        if(this.currentLyric) {  // 在切换播放歌曲的时候 判断之前有没有lyric-parser插件的实例 如果有 那么就清除上一次的实例 也就是清除了插件上一次创建的定时器 解决了切换歌曲后存在多个定时器导致歌词位置不正确的问题
          this.currentLyric.stop();
          this.currentLineNum = 0;  // 当切换歌曲后 让高亮的歌词行数变为0
        }
        this.$nextTick(_ => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1000);
      },
      playing(newPlaying) {
        const audio = this.$refs.audio;
        this.$nextTick(_ => {
          newPlaying ? audio.play() : audio.pause();
        })

      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>