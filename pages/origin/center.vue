<template>
  <view class="center">
    <tn-nav-bar fixed default="用户中心"></tn-nav-bar>
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <view
      class="logo"
      @click="goLogin"
      :hover-class="!login ? 'logo-hover' : ''"
    >
      <image
        class="logo-img"
        :src="login ? uerInfo.avatarUrl || avatarUrl : avatarUrl"
      ></image>
      <view class="logo-title">
        <text class="uer-name"
          >Hi，{{ login ? uerInfo.nickname : "您未登录" }}</text
        >
        <text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <!-- <view class="center-list-item border-bottom">
        <text class="list-icon">&#xe60f;</text>
        <text class="list-text">帐号管理</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view> -->
      <view class="center-list-item">
        <text class="list-icon">&#xe639;</text>
        <text class="list-text">新消息通知</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <view class="center-list-item border-bottom">
        <text class="list-icon">&#xe60b;</text>
        <text class="list-text">帮助与反馈</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
      <view class="center-list-item">
        <text class="list-icon">&#xe65f;</text>
        <text class="list-text">服务条款及隐私</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
    <view class="center-list">
      <view class="center-list-item">
        <text class="list-icon">&#xe614;</text>
        <text class="list-text">关于应用</text>
        <text class="navigat-arrow">&#xe65e;</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      login: false,
      avatarUrl: "../../static/logo.png",
      uerInfo: {},
    };
  },
  mounted() {
    // 获取底部导航栏高度
    uni.getSystemInfo({
      success: (res) => {
        // this.bottomBarHeight = res.safeAreaInsets.bottom;
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
  },
  onLoad() {
    // 判断用户是否登录
    const userInfo = this.$store.state.vuex_userInfo;
    if (userInfo) {
      this.login = true;
      this.uerInfo = userInfo;
    }
  },
  methods: {
    goLogin() {
      if (!this.login) {
        console.log("点击前往登录");
      }
    },
  },
};
</script>

<style>
@font-face {
  font-family: texticons;
  font-weight: normal;
  font-style: normal;
  src: url("https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf")
    format("truetype");
}

page,
view {
  display: flex;
}

page {
  background-color: #f8f8f8;
}

.center {
  flex-direction: column;
}

.logo {
  width: 750upx;
  height: 240upx;
  padding: 20upx;
  box-sizing: border-box;
  background-color: #007aff;
  flex-direction: row;
  align-items: center;
}

.logo-hover {
  opacity: 0.8;
}

.logo-img {
  width: 150upx;
  height: 150upx;
  border-radius: 150upx;
}

.logo-title {
  height: 150upx;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-left: 20upx;
}

.uer-name {
  height: 60upx;
  line-height: 60upx;
  font-size: 38upx;
  color: #ffffff;
}

.go-login.navigat-arrow {
  font-size: 38upx;
  color: #ffffff;
}

.login-title {
  height: 150upx;
  align-items: self-start;
  justify-content: center;
  flex-direction: column;
  margin-left: 20upx;
}

.center-list {
  background-color: #ffffff;
  margin-top: 20upx;
  width: 750upx;
  flex-direction: column;
}

.center-list-item {
  height: 90upx;
  width: 750upx;
  box-sizing: border-box;
  flex-direction: row;
  padding: 0upx 20upx;
}

.border-bottom {
  border-bottom-width: 1upx;
  border-color: #c8c7cc;
  border-bottom-style: solid;
}

.list-icon {
  width: 40upx;
  height: 90upx;
  line-height: 90upx;
  font-size: 34upx;
  color: #4cd964;
  text-align: center;
  font-family: texticons;
  margin-right: 20upx;
}

.list-text {
  height: 90upx;
  line-height: 90upx;
  font-size: 34upx;
  color: #555;
  flex: 1;
  text-align: left;
}

/* .navigat-arrow {
  height: 90upx;
  width: 40upx;
  line-height: 90upx;
  font-size: 34upx;
  color: #555;
  text-align: right;
  font-family: texticons;
} */
</style>
