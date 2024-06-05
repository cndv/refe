<script>
import Vue from "vue";
import store from "./store/index.js";
import updateCustomBarInfo from "./tuniao-ui/libs/function/updateCustomBarInfo.js";

// #ifdef H5
import TIM from "tim-js-sdk/tim-js-friendship.js";
import COS from "cos-js-sdk-v5";
// #endif

// #ifdef MP-WEIXIN  || APP-PLUS
import TIM from "tim-wx-sdk/tim-wx-friendship.js";
import COS from "cos-wx-sdk-v5";
// #endif

let sdkAppID = 1600037870;

// APP通话插件
// #ifdef  APP-PLUS
const TUICallKit = uni.requireNativePlugin("TencentCloud-TUICallKit");
TUICallKit.enableFloatWindow(true);
console.log(TUICallKit, "通话初始化TUICallKit ｜ ok");
// #endif

export default {
  onLaunch: function () {
    console.log("App Launch my");
    uni.getSystemInfo({
      success: function (e) {
        // #ifndef H5
        // 获取手机系统版本
        const system = e.system.toLowerCase();
        const platform = e.platform.toLowerCase();
        // 判断是否为ios设备
        if (
          platform.indexOf("ios") != -1 &&
          (system.indexOf("ios") != -1 || system.indexOf("macos") != -1)
        ) {
          Vue.prototype.SystemPlatform = "apple";
        } else if (
          platform.indexOf("android") != -1 &&
          system.indexOf("android") != -1
        ) {
          Vue.prototype.SystemPlatform = "android";
        } else {
          Vue.prototype.SystemPlatform = "devtools";
        }
        // #endif
      },
    });

    // 获取设备的状态栏信息和自定义顶栏信息
    // store.dispatch('updateCustomBarInfo')
    updateCustomBarInfo().then((res) => {
      store.commit("$tStore", {
        name: "vuex_status_bar_height",
        value: res.statusBarHeight,
      });
      store.commit("$tStore", {
        name: "vuex_custom_bar_height",
        value: res.customBarHeight,
      });
    });

    // #ifdef MP-WEIXIN
    //更新检测
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager &&
        updateManager.onCheckForUpdate((res) => {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(() => {
              uni.showModal({
                title: "更新提示",
                content: "新版本已经准备就绪，是否需要重新启动应用？",
                success: (res) => {
                  if (res.confirm) {
                    uni.clearStorageSync(); // 更新完成后刷新storage的数据
                    updateManager.applyUpdate();
                  }
                },
              });
            });

            updateManager.onUpdateFailed(() => {
              uni.showModal({
                title: "已有新版本上线",
                content:
                  "小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~",
                showCancel: false,
              });
            });
          } else {
            //没有更新
          }
        });
    } else {
      uni.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请更新到最新的微信后再重试。",
        showCancel: false,
      });
    }
    // #endif

    // 挂载TIM SDK
    Vue.prototype.TIM = TIM;
    this.initialization();
  },
  onShow: function () {
    // console.log('App Show')
    this.initialization();
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    userProfile: null,
    headerHeight: 0,
    statusBarHeight: 0,
  },
  methods: {
    // 初始化 IM

    initialization() {
      const sdkID = uni.getStorageSync("sdkAppID");
      if (sdkID) {
        sdkAppID = sdkID;
      }
      console.log("sdkAppID", sdkAppID);

      // 初始化 TIM SDK
      uni.$TUIKit = TIM.create({ SDKAppID: sdkAppID });
      wx.$TUIKit = uni.$TUIKit;

      // 注册 COS 插件
      if (typeof uni.$TUIKit.registerPlugin === "function") {
        // #ifdef H5
        uni.$TUIKit.registerPlugin({ "cos-js-sdk": COS });
        // #endif

        // #ifdef APP-PLUS || MP-WEIXIN
        uni.$TUIKit.registerPlugin({ "cos-wx-sdk": COS });
        // #endif
      }

      // #ifdef APP-PLUS
      uni.$TUICallKit = TUICallKit;
      // #endif

      console.log("-------------------------------------");
      console.log("uni.$TUIKit", uni.$TUIKit);

      // 设置日志级别
      uni.$TUIKit.setLogLevel(0);

      // 存储 TIM SDK 全局实例
      uni.$TUIKitTIM = TIM;
      uni.$TUIKitEvent = TIM.EVENT;
      uni.$TUIKitVersion = TIM.VERSION;
      uni.$TUIKitTypes = TIM.TYPES;

      // 重置登录数据
      uni.$resetLoginData = this.resetLoginData();

      // 监听 TIM SDK 事件
      uni.$TUIKit.on(uni.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady);
      uni.$TUIKit.on(uni.$TUIKitEvent.KICKED_OUT, this.onKickedOut);
      uni.$TUIKit.on(uni.$TUIKitEvent.ERROR, this.onTIMError);
      uni.$TUIKit.on(uni.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange);
      uni.$TUIKit.on(uni.$TUIKitEvent.SDK_RELOAD, this.onSDKReload);
      uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.onSDKReady);

      // 检查是否已登录
      this.isLogin();
    },
    // initialization() {
    //   const sdkID = uni.getStorageSync("sdkAppID");
    //   if (sdkID) {
    //     sdkAppID = sdkID;
    //   }
    //   console.log("sdkAppID", sdkAppID);
    //   // 初始化tim
    //   uni.$TUIKit = TIM.create({
    //     SDKAppID: sdkAppID,
    //   });
    //   wx.$TUIKit = uni.$TUIKit;

    //   // #ifdef  H5
    //   uni.$TUIKit.registerPlugin({
    //     "cos-js-sdk": COS,
    //   });
    //   // #endif

    //   // #ifdef  APP-PLUS || MP-WEIXIN
    //   uni.$TUIKit.registerPlugin({
    //     "cos-wx-sdk": COS,
    //   });
    //   // #endif

    //   // #ifdef  APP-PLUS
    //   uni.$TUICallKit = TUICallKit;
    //   // #endif
    //   console.log("-------------------------------------");
    //   console.log("uni.$TUIKit", uni.$TUIKit);

    //   uni.$TUIKit.setLogLevel(0);

    //   uni.$TUIKitTIM = TIM;
    //   uni.$TUIKitEvent = TIM.EVENT;
    //   uni.$TUIKitVersion = TIM.VERSION;
    //   uni.$TUIKitTypes = TIM.TYPES; // 监听系统级事件
    //   uni.$resetLoginData = this.resetLoginData(); // 重置登录数据
    //   uni.$TUIKit.on(uni.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady);
    //   uni.$TUIKit.on(uni.$TUIKitEvent.KICKED_OUT, this.onKickedOut);
    //   uni.$TUIKit.on(uni.$TUIKitEvent.ERROR, this.onTIMError);
    //   uni.$TUIKit.on(uni.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange);
    //   uni.$TUIKit.on(uni.$TUIKitEvent.SDK_RELOAD, this.onSDKReload);
    //   uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.onSDKReady);

    //   // 是否登录
    //   this.isLogin();
    // },
    isLogin() {
      const userID = uni.getStorageSync("userID");
      const userSig = uni.getStorageSync("userSig");
      console.log("userID", userID, "userSig", userSig);
      if (!userID) {
        console.log("未登录", uni.getStorageSync("userID"));
        console.log("未登录", uni.getStorageSync("userSig"));
        uni.navigateTo({
          url: "/common/login",
        });
      } else {
        // 登录im
        uni.$TUIKit
          .login({
            userID: userID,
            userSig: userSig,
          })
          .then((res) => {
            console.log("IM登录成功", res);
          })
          .catch(() => {});
      }

      // 登录 native 原生通话插件
      // #ifdef  APP-PLUS
      uni.$TUICallKit.login(
        {
          SDKAppID: sdkAppID,
          userID: userID,
          userSig: userSig,
        },
        (res) => {
          if (res.code === 0) {
            console.log("app视频通话登录成功");
          } else {
            console.log(`app视频通话, error message = ${res.msg}`);
          }
        }
      );
      // #endif
    },
    resetLoginData() {
      this.globalData.expiresIn = "";
      this.globalData.sessionID = "";
      this.globalData.userInfo = {
        userID: "",
        userSig: "",
        token: "",
        phone: "",
      };
      this.globalData.userProfile = null;
    },
    onTIMError() {},
    onNetStateChange() {},
    onSDKReload() {},
    onSDKReady() {
      console.log("IM SDK Ready");
      this.$store.commit("login");
      if (!wx.$TRTCCalling) {
        wx.$TRTCCalling = new TRTCCalling({
          sdkAppID: sdkAppID,
          tim: wx.$TUIKit,
        });
        console.log("TD:初始化 TRTCCalling in App.vue 加载SDK Ready");
      }
    },
    onSdkNotReady() {},
    onKickedOut() {
      setTimeout(() => {
        uni.showToast({
          title: "您被踢下线",
          icon: "error",
        });
      }, 1000);
      // uni.navigateTo({
      //   url: "/im/login/login",
      // });
    },
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "./tuniao-ui/index.scss";
@import "./tuniao-ui/iconfont.css";
@import "uview-ui/index.scss";
</style>
