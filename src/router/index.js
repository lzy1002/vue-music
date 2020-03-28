import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Recommend = () => import("../views/recommend/recommend.vue");
const Disc = () => import("../views/disc/disc.vue");
const Singer = () => import("../views/singer/singer.vue");
const SingerDetail = () => import("../views/singer-detail/singer-detail.vue");
const Rank = () => import("../views/rank/rank.vue");
const TopList = () => import("../views/top-list/top-list.vue");
const Search = () => import("../views/search/search.vue");

const routes = [
  {path: "/", redirect: "/recommend"},
  {path: "/recommend", component: Recommend,
    children: [
      {path: ":id", component: Disc}
    ]
  },
  {path: "/singer", component: Singer,
    children: [
      {path: ":id", component: SingerDetail}
    ]
  },
  {path: "/rank", component: Rank,
    children: [
      {path: ":id", component: TopList}
    ]
  },
  {path: "/search", component: Search}
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
