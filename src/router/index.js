import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Recommend = () => import("../views/recommend/recommend.vue");
const Singer = () => import("../views/singer/singer.vue");
const Rank = () => import("../views/rank/rank.vue");
const Search = () => import("../views/search/search.vue");

const routes = [
  {path: "/", redirect: "/recommend"},
  {path: "/recommend", component: Recommend},
  {path: "/singer", component: Singer},
  {path: "/rank", component: Rank},
  {path: "/search", component: Search}
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
