import Vue from "vue";
import App from "./App";
import store from "./store";

// 引入全局TuniaoUI
import TuniaoUI from "tuniao-ui";
Vue.use(TuniaoUI);

// // 全局mixins，用于实现setData等功能';
import Mixin from "@/store/mixins.js";
Vue.mixin(Mixin);

// 引入TuniaoUI提供的vuex简写方法
let vuexStore = require("@/store/$tn.mixin.js");
Vue.mixin(vuexStore);

// 引入TuniaoUI对小程序分享的mixin封装
let mpShare = require("tuniao-ui/libs/mixin/mpShare.js");
Vue.mixin(mpShare);

Vue.config.productionTip = false;
App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});

// 引入请求封装
require("./util/request/index")(app);

app.$mount();
