<template>
  <view class="loginApp">
    <view class="login_title">
      <image class="logo zwyHeight" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/msg.png"></image>
    </view>
    <view class="center">测试账号：user1 user2 user3</view>
    <view class="agreement center">
      <text class="jw-icon icon-xuanzhong" :class="{ active: agreement }" @click="checkAgreement"></text>
      <text @click="checkAgreement">请认真阅读并同意</text>
      <text class="tit" @click="navToAgreementDetail(1)">《用户服务协议》</text>
      <text class="tit" @click="navToAgreementDetail(2)">《隐私权政策》</text>
    </view>
    <view class="wrapper">
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <view class="row">
            <input v-model="username" maxlength="11" placeholder="请输入手机号码" placeholder-style="color: #909399" />
          </view>
        </view>
        <view class="input-item">
          <text class="tit">验证码</text>
          <view class="row">
            <input v-model="code" type="number" maxlength="6" placeholder="请输入手机验证码" placeholder-style="color: #909399" />
            <view class="jw-get-code">
              <text class="text" :class="{ disabled: timeDown > 0 }">
                {{ timeDown > 0 ? '重新获取 ' + timeDown + 's' : '获取验证码' }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="btn">
        <u-button type="primary" text="注册/登录" @click="loginTo()"></u-button>
      </view>
      <!-- #ifdef APP-PLUS || MP-WEIXIN -->
      <view class="other-wrapper" v-if="false">
        <view class="line center">
          <text class="tit">快捷登录</text>
        </view>
        <view class="list row">
          <!-- #ifdef MP-WEIXIN -->
          <view class="item column center" @click="mpWxGetUserInfo">
            <image class="icon" src="https://pbw-uploadfile.oss-cn-beijing.aliyuncs.com/image/icon/login-wx.png"></image>
          </view>
          <!-- #endif -->

          <!-- #ifdef APP-PLUS -->
          <view v-if="canUseAppleLogin" class="item column center" style="width: 180rpx">
            <image class="icon" src="https://pbw-uploadfile.oss-cn-beijing.aliyuncs.com/image/icon/apple.png"></image>
          </view>
          <view class="item column center" style="width: 180rpx">
            <image class="icon" src="https://pbw-uploadfile.oss-cn-beijing.aliyuncs.com/image/icon/login-wx.png"></image>
          </view>
          <!-- #endif -->
        </view>
      </view>
      <!-- #endif -->
    </view>

    <!-- 无网络提示 -->
    <u-no-network></u-no-network>
  </view>
</template>

<script>
import { genTestUserSig } from '../debug/GenerateTestUserSig.js';

const app = getApp();

export default {
  data() {
    return {
      canUseAppleLogin: false,
      agreement: false,
      username: 'user2',
      code: '123456',
      timeDown: ''
    };
  },
  onLoad() {},
  computed: {},
  methods: {
    loginSuccessCallBack(data) {},
    //手机号登录
    loginTo() {
      const userID = this.username;
      const userSig = genTestUserSig(userID).userSig;
      app.globalData.userInfo = {
        userSig,
        userID
      };

      uni.setStorageSync('userInfo', app.globalData.userInfo);

      // 登录腾讯im
      uni.$TUIKit
        .login({
          userID: userID,
          userSig: userSig
        })
        .then(res => {
          this.$store.commit('setToken', app.globalData.userInfo);
          uni.showToast({
            title: '登录中...',
            duration: 3000,
            icon: 'none'
          });
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/msg'
            });
          }, 3000);
        })
        .catch(() => {});
      // 登录 native 原生通话插件
      // #ifdef  APP-PLUS
      uni.$TUICallKit.login(
        {
          sdkAppID: genTestUserSig('').sdkAppID,
          userID: app.globalData.userInfo.userID,
          userSig: app.globalData.userInfo.userSig
        },
        res => {
          console.log('app视频通话登录成功');
        }
      );
      // #endif
    },
    //同意协议
    checkAgreement() {
      this.agreement = !this.agreement;
    },
    //打开协议
    navToAgreementDetail(type) {}
  }
};
</script>

<style scoped lang="scss">
page {
  background: #fff;
}
.btn {
  padding-top: 150rpx;
  width: 70%;
  margin: 0 auto;
}
.center {
  text-align: center;
  color: #909399;
}
.jw-get-code {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36rpx;

  &:before {
    content: '';
    width: 0;
    height: 40;
    border-right: 1px solid #f0f0f0;
  }
  .loading {
    margin-right: 8rpx;
  }
  .text {
    line-height: 28rpx;
    font-size: 26rpx;
    color: #40a2ff;

    &.disabled {
      color: #ccc;
    }
  }
}
.login_title image {
  width: 214rpx;
  height: 214rpx;
}
.login_title {
  text-align: center;
  margin-bottom: 50rpx;
}
.login_title_text image {
  width: 370rpx;
  height: 23rpx;
}
.login_title_text {
  text-align: center;
  margin-bottom: 50rpx;
}
.row {
  display: flex;
  align-items: center;
}
.loginApp {
  padding-top: 15vh;
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
}
.wrapper {
  position: relative;
  z-index: 90;
  padding-bottom: 40rpx;
}
.back-btn {
  position: absolute;
  left: 20rpx;
  top: calc(var(--status-bar-height) + 20rpx);
  z-index: 90;
  padding: 20rpx;
  font-size: 32rpx;
  color: #606266;
}
.left-top-sign {
  font-size: 120rpx;
  color: #f8f8f8;
  position: relative;
  left: 32rpx;
  top: -30rpx;
}

.welcome {
  position: relative;
  left: 50rpx;
  top: -90rpx;
  font-size: 46rpx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
  padding: 0 60rpx;
}
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: #f8f6fc;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;

  &:last-child {
    margin-bottom: 0;
  }
  .row {
    width: 100%;
  }
  .tit {
    height: 50rpx;
    line-height: 56rpx;
    font-size: 26rpx;
    color: #606266;
  }
  input {
    flex: 1;
    height: 60rpx;
    font-size: 30rpx;
    color: #303133;
    width: 100%;
  }
}
/* 其他登录方式 */
.other-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20rpx;
  margin-top: 80rpx;

  .line {
    margin-bottom: 40rpx;

    .tit {
      margin: 0 32rpx;
      font-size: 24rpx;
      color: #606266;
    }
    &:before,
    &:after {
      content: '';
      width: 160rpx;
      height: 0;
      border-top: 1px solid #e0e0e0;
    }
  }
  .item {
    font-size: 24rpx;
    color: #606266;
    border: 0;

    &:after {
      border: 0;
    }
  }
  .icon {
    width: 90rpx;
    height: 90rpx;
    margin: 0 24rpx 16rpx;
  }
}
.agreement {
  position: absolute;
  left: 0;
  bottom: 6vh;
  z-index: 1;
  width: 750rpx;
  height: 90rpx;
  font-size: 24rpx;
  color: #999;

  .jw-icon {
    font-size: 36rpx;
    color: #ccc;
    margin-right: 8rpx;
    margin-top: 1px;

    &.active {
      color: red;
    }
  }
  .tit {
    color: #40a2ff;
  }
}
</style>
