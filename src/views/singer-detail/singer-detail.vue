<template>
  <div class="singer-detail">
    123123
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "singer-detail",
    computed: {
      ...mapGetters([
        "singer"  // 将getters中的singer取出来使用
      ])
    },
    created() {
      console.log(this.singer);
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable.styl"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background-color $color-background
</style>