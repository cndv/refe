<template>
  <view class="container">
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <view class="header">
      <view class="title">双向转诊-登录</view>
    </view>
    <image src="/static/images/banner.png" class="banner"></image>
    <view class="tabs">
      <view :class="['tab', { active: currentTab === 0 }]" @click="changeTab(0)"
        >护士登录</view
      >
      <view :class="['tab', { active: currentTab === 1 }]" @click="changeTab(1)"
        >患者登录</view
      >
    </view>
    <view v-if="currentTab === 0" class="login-form">
      <view class="input-container">
        <tn-input
          v-model="username"
          :border="true"
          placeholder="请输入用户名"
          prefix-icon="user"
          class=""
        ></tn-input>
      </view>
      <view class="input-container">
        <tn-input
          v-model="password"
          :border="true"
          placeholder="请输入密码"
          type="password"
          prefix-icon="lock"
          class=""
        ></tn-input>
      </view>
    </view>
    <view v-if="currentTab === 1" class="login-form">
      <view class="input-container">
        <tn-input
          v-model="phone"
          :border="true"
          placeholder="请输入手机号"
          prefix-icon="phone"
        ></tn-input>
      </view>
      <view class="input-container verification-container">
        <tn-input
          v-model="verificationCode"
          :border="true"
          placeholder="请输入验证码"
          class="verification-input"
        ></tn-input>
        <tn-button
          type="default"
          backgroundColor="tn-bg-blue"
          class="verification-button"
          @click="getVerificationCode"
          >{{ verificationButtonText }}</tn-button
        >
      </view>
    </view>
    <view class="button-container">
      <tn-button
        type="primary"
        size="lg"
        width="680rpx"
        backgroundColor="tn-bg-blue"
        fontColor="tn-color-white"
        @click="login"
        >登录</tn-button
      >

      <!-- <tn-button type="primary" class="login-button" @click="login">登录</tn-button> -->
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex"; // 从 vuex 中引入 mapMutations
import { ApiLogin } from "@/common/api";
import { genTestUserSig } from "../../im/debug/GenerateTestUserSig.js";
const app = getApp();
export default {
  data() {
    return {
      currentTab: 0,
      username: "test1",
      password: "123456",
      phone: "",
      verificationCode: "",
      statusBarHeight: 0,
      isCountingDown: false,
      verificationButtonText: "获取验证码",
      countdown: 60,
    };
  },
  methods: {
    ...mapMutations(["$tStore"]),
    changeTab(tab) {
      this.currentTab = tab;
    },
    getVerificationCode() {
      if (this.isCountingDown) return;

      this.isCountingDown = true;
      this.verificationButtonText = `${this.countdown}秒后重试`;

      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval);
          this.isCountingDown = false;
          this.verificationButtonText = "获取验证码";
          this.countdown = 60;
        } else {
          this.verificationButtonText = `${this.countdown}秒后重试`;
        }
      }, 1000);

      // 获取验证码逻辑
      console.log("获取验证码");
    },
    login() {
      if (this.currentTab === 0) {
        // 医护登录逻辑
        console.log("用户名:", this.username, "密码:", this.password);
        // 验证用户名和密码是否为空
        ApiLogin({
          account: this.username,
          password: this.password,
        })
          .then((result) => {
            console.log("登录结果:", result);

            if (result && result.code === 1) {
              console.log("登录成功");
              const token = result.data.userinfo.token;
              const userInfo = result.data.userinfo;
              // 将 token 存储到 Vuex
              // 使用现有的 $tStore mutation 存储 token
              this.$tStore({ name: "vuex_token", value: token });
              this.$tStore({ name: "vuex_userInfo", value: userInfo });
              // 生成腾讯云 IM 用户签名
              const userSig = genTestUserSig(userInfo.tencent_id).userSig;
              const userID = userInfo.tencent_id;
              this.$tStore({ name: "vuex_ImUserSig", value: userSig });
              this.$tStore({
                name: "vuex_ImUserId",
                value: userInfo.tencent_id,
              });

              // 使用现有的 $tStore mutation 存储用户 ID 和用户签名
              app.globalData.userInfo = {
                userSig,
                userID,
              };
              uni.setStorageSync("userInfo", app.globalData.userInfo);
              this.$store.commit("setToken", app.globalData.userInfo);
              this.$tStore({
                name: "vuex_ImUserId",
                value: userInfo.tencent_id,
              });
              console.log("登录成功", this.$store.state.vuex_ImUserSig);
              //this.$store.state.vuex_ImUserSig;
              this.toPage();
              uni.reLaunch({
                url: "/pages/target/index",
              });
              console.log("登录成功", token, userInfo);
            } else {
              console.log("登录失败");
              uni.showToast({
                title:
                  result && result.message
                    ? result.message
                    : "用户名或密码错误",
                icon: "none",
              });
            }
          })
          .catch((error) => {
            console.log("登录失败:", error);
            uni.showToast({
              title: "登录失败",
              icon: "none",
            });
          });
      } else {
        // 患者登录逻辑
        console.log("患者登录", this.phone, this.verificationCode);
      }
    },
    toPage() {
      const userInfo = this.$store.state.vuex_userInfo;
      // 判断用户身份，如果是医生，跳转到医生首页
      if (userInfo.identity_data == 0) {
        // 患者
        uni.reLaunch({
          url: "/pages/target/index",
        });
      } else if (userInfo.identity_data == 1) {
        //上级医院医生
        uni.reLaunch({
          url: "/pages/target/index",
        });
      } else if (userInfo.identity_data == 2) {
        //下级医院医生
        // 如果是患者，跳转到患者首页
        uni.reLaunch({
          url: "/pages/origin/index",
        });
      } else if (userInfo.identity_data == 3) {
        // 上级医院护士
        // 如果是患者，跳转到患者首页
        uni.reLaunch({
          // url: "/pages/target/index",
        });
      } else if (userInfo.identity_data == 4) {
        // 下级医院护士
        // 如果是患者，跳转到患者首页
        uni.reLaunch({
          // url: "/pages/target/index",
        });
      }
    },
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
    const token = this.$store.state.vuex_token;
    if (token) {
      this.toPage();
    }
  },
  mounted() {
    // 判断用户是否登录，如果已经登录，直接跳转到首页

    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
  },
};
</script>

<style scoped>
.container {
  padding: 0;
  text-align: center;
  background-color: #ffffff;
}
.status-bar {
  width: 100%;
  background-color: #ffffff;
}
.header {
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.title {
  font-size: 36rpx;
  color: #333333;
}
.banner {
  width: 100%;
  height: 300rpx;
}
.tabs {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
  border-bottom: 2rpx solid #e0e0e0;
}
.verification-container {
  display: flex;
}
.verification-input {
  flex: 1;
}
.verification-button {
  margin-left: 20rpx;
}
.tab {
  font-size: 32rpx;
  padding: 20rpx 0;
  cursor: pointer;
  flex: 1;
  text-align: center;
}
.tab.active {
  font-weight: bold;
  color: #007aff;
  border-bottom: 4rpx solid #007aff;
}
.login-form {
  margin-top: 40rpx;
  padding: 0 40rpx;
}
.input-container {
  margin-bottom: 40rpx;
}
.input {
  border: 1rpx solid #dcdcdc;
  height: 88rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.button-container {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}
.login-button {
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 36rpx;
  border-radius: 44rpx;
  background-color: #007aff;
  color: #ffffff;
}
</style>
