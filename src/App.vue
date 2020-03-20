<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from "components/content/m-header/m-header.vue";
  import Tab from "components/content/tab/tab.vue";

  export default {
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style lang="stylus">
  @import "./common/stylus/variable.styl"

  #app
    color $color-theme
    background-color $color-background
</style>
