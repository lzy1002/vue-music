import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import state from "./state.js";
import mutations from "./mutations.js";
import * as getters from "./getters.js";
import * as actions from "./actions.js";

import createLogger from "vuex/dist/logger.js";  // 该插件用于在使用vuex做操作之后 在控制台输出当前的行为

const debug = process.env.NODE_ENV !== "production";  // 查看当前是否需要debug环境

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: debug,  // 开启严格模式 如果开启该模式 那么如果修改state中的数据不是通过mutations中的方法 那么则会直接报错
  plugins: debug ? [createLogger()] : []  // 如果当前是开发环境那么则使用插件
})
