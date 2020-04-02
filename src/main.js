import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import fastclick from "fastclick";
fastclick.attach(document.body);

import vueLazyLoad from "vue-lazyload";

import vConsole from "vconsole";
new vConsole();

console.log("text");

Vue.use(vueLazyLoad, {
  loading: require("./common/images/default.png")
});

Vue.config.productionTip = false;

import "./common/stylus/index.styl";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
