<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)">
        <div class="rank" v-if="rank">
          <span :class="rankCls(index)">{{rankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{desc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      desc(song) {
        return `${song.singer}·${song.album}`;
      },
      selectItem(song, index) {
        this.$emit("selectItem", song, index);
      },
      rankCls(index) {
        if(index < 3) {
          return `icon icon${index}`
        }else {
          return "text";
        }
      },
      rankText(index) {
        if(index > 2) {
          return index + 1;
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>