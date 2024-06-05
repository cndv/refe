/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
  uni.$tn.http.interceptors.request.use(
    (config) => {
      // 可以使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，默认赋予{}
      config.data = config.data || {};
      // 可以在此通过vm引用vuex中的变量，具体值在vm.vuex_[name]中
      // console.log(vm.vuex_user);
      // console.log("打印token:", vm.$store.state.vuex_token);

      // console.log(vm.vuex_user.userInfo);
      // header中携带token
      if (vm.$store.state.vuex_token) {
        config.header = {
          ...config.header,
          token: vm.$store.state.vuex_token,
        };
      }

      return config;
    },
    (config) => {
      // 可以使用async await 做异步操作
      Promise.reject(config);
    }
  );
};
