<template>
  <view>
    <view class="contain">
      <!-- 第一部分 -->
      <view class="view">
        <view class="view-image-text" @tap="personal">
          <image class="image-radius" :src="config.avatar ? config.avatar : 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'"></image>
          <view class="text-container">
            <view class="name">
              {{ config.nick ? config.nick : '提莫' }}
              <text class="hasname" v-if="hasname">(暂无昵称)</text>
            </view>
            <view class="ID">userID:{{ config.userID }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="box">
      <block v-for="(item, index) in userListInfo" :key="index">
        <view class="list" :data-item="item" @tap="handleRouter">
          <image class="list-URL" :src="item.iconUrl"></image>
          <view class="list-name">
            <view>{{ item.name }}</view>
          </view>
          <image class="listimage" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/detail.svg"></image>
        </view>
      </block>
    </view>
    <view class="quit-main">
      <view class="quit-main-text" @tap="quit">退出登录</view>
    </view>
    <view class="pop-mask" v-if="popupToggle">
      <view class="pop-box">
        <text class="text-title">《IM-免责声明》</text>
        <text class="pop-box-text">IM（“本产品”）是由腾讯云提供的一款测试产品，腾讯云享有本产品的著作权和所有权。本产品仅用于功能体验，不得用于任何商业用途。为配合相关部门监管要求，本产品音视频互动全程均有录音录像存档，严禁在使用中有任何色情、辱骂、暴恐、涉政等违法内容传播。</text>
        <view class="agree">
          <button class="pop-agree" @tap="Agree">我已知晓</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      // 页面初始信息
      userListInfo: [
        {
          extra: 1,
          name: '隐私条例',
          path: 'https://web.sdk.qcloud.com/document/Tencent-IM-Privacy-Protection-Guidelines.html',
          nav: 'Privacy-Protection',
          iconUrl: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/Privacyregulations.svg',
        },
        {
          extra: 1,
          name: '用户协议',
          path: 'https://web.sdk.qcloud.com/document/Tencent-IM-User-Agreement.html',
          nav: 'User-Agreement',
          iconUrl: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/Useragreement.svg',
        },
        {
          extra: 3,
          name: '免责声明',
          iconUrl: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/Disclaimers.svg',
        },
        {
          extra: 2,
          name: '关于',
          url: '../about/about',
          iconUrl: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/about.svg',
        },
        {
          extra: 1,
          name: '联系我们',
          path: 'https://cloud.tencent.com/document/product/269/20043',
          iconUrl: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/contact.svg',
        },
      ],
      config: {
        nick: '',
        userID: '',
      },
      hasname: true,
      popupToggle: false,
    };
  },

  components: {},
  props: {},

  onShow() {
    uni.$TUIKit
      .getMyProfile()
      .then(imResponse => {
        this.setData({
          config: imResponse.data,
        });
        app.globalData.userProfile = imResponse.data;

        if (imResponse.data.nick) {
          this.setData({
            hasname: false,
          });
        }
      })
      .catch(imError => {
        console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
      });
  },

  methods: {
    onload() {},

    personal() {
      // TUIKit xxxx | mine | personal | xxxx
      uni.navigateTo({
        url: '/im/personal/personal',
      });
    },

    quit() {
      // TUIKit xxxx | mine | quit | xxxx
      uni.$TUIKit.logout().then(() => {
        uni.clearStorage();
        uni.redirectTo({
          url: '/pages/login',
          success: () => {
            uni.showToast({
              title: '退出成功',
              icon: 'none',
            });
          },
        });
      });
    },

    handleRouter(event) {},

    Agree() {
      this.setData({
        popupToggle: false,
      });
    },
  },
};
</script>
<style scoped>
.page {
  background-color: #ffffff;
}
.contain {
  width: 100%;
  height: 100%;
  background: #5856d5;
}

.view {
  height: 358rpx;
  background: #5856d5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-image-text {
  display: flex;
  width: 90%;
  height: 189rpx;
  justify-content: left;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border-radius: 4px;
  z-index: 1;
  margin-top: 110px;
}
.image-radius {
  padding-left: 43rpx;
  padding-top: 43rpx;
  padding-bottom: 40rpx;
  height: 120rpx;
  width: 120rpx;
}
.name {
  height: 25px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  margin-left: 10px;
  margin-top: 20px;
}

.ID {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  margin-left: 10px;
  margin-top: 10px;
  padding-bottom: 40rpx;
}
.box {
  width: 100%;
}
.list {
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 56px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 24px;
  padding-top: 16px;
  border-bottom: 1px solid #eef0f3;
}
.list-URL {
  padding-left: 12px;
  padding-right: 12px;
  align-items: center;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.list-URL image {
  width: 100%;
  height: 20px;
  vertical-align: -2px;
}

.list-name {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 24px;
}
.listimage {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 36px;
}
.quit-main {
  margin-top: 36px;
  margin-left: 25px;
  margin-right: 20px;
  background-color: white;
  width: 85%;
  height: 46px;
  border: 1px solid #5856d5;
  border-radius: 24px;
  border-radius: 24px;
}
.quit-main-text {
  display: flex;
  justify-content: center;
  margin-top: 13px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #5856d5;
  letter-spacing: 0;
}
.arrow {
  width: 16px;
  height: 16px;
  float: right;
}
.pop-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 2;
  top: 0; /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top)); /*  #endif  */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
}
.pop-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20rpx;
  align-items: center;
  background: #ffffff;
  border: 1px solid #eef0f3;
  z-index: 1;
}
.text-title {
  right: 100px;
  left: 100px;
}
.pop-box-text {
  display: flex;
  padding-top: 10px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;
}
.agree {
  padding-top: 20rpx;
}
.pop-agree {
  padding-top: 20rpx;
  background: rgba(0, 110, 255, 1);
  border-radius: 30px;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  /* text-align: center; */
  font-weight: 500;
}
</style>
