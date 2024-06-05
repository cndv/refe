<template>
  <view>
    <view class="container">
      <view class="item">
        <view class="avatar" @tap.stop="changeAvatar">
          <text class="aside-left">头像</text>
          <image class="image_radius" :src="userInfo.avatar || 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'"></image>
          <image class="listimage" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/detail.svg"></image>
        </view>
      </view>
      <view class="item">
        <view class="nickname" @tap="handleEditToggle">
          <text class="aside-left">昵称</text>
          <text class="aside-right">{{ userInfo.nick ? userInfo.nick : '提莫' }}</text>
          <image class="listimage" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/detail.svg"></image>
        </view>
      </view>
      <view class="item">
        <view class="nickname">
          <text class="aside-left">性别</text>
          <picker class="aside-right" @change="gender" :value="index" :range="array">
            <view class="uni-input">
              <text>{{ array[index] }}</text>
            </view>
          </picker>
          <image class="listimage" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/detail.svg"></image>
        </view>
      </view>
    </view>
    <view class="popup-mask" v-if="popupToggle" @tap.stop="handleEditToggle">
      <view class="popup-main" @tap.stop="handleCatchTap">
        <view class="popup-main-header">
          <label class="popup-main-header-title">修改昵称</label>
          <button class="button" @tap.stop="handleEditSubmit" :disabled="!infoNick">确认</button>
        </view>
        <input class="popup-main-input" type="text" :value="infoNick" @input="bindEditInput" />
        <label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
      </view>
    </view>
    <view class="popup-mask-avatar" v-if="popupToggleAvatar" @tap.stop="handleEditToggleAvatar">
      <view class="popup-main-avatar" @tap.stop="handleCatchTap">
        <view class="pop-main-header-avatar" :data-item="item">
          <label class="popup-main-header-title-avatar">设置头像</label>
          <label class="button-avatar" @tap.stop="handleEditSubmitAvatar">确认</label>
          <view class="image-list"><image v-for="(item, index) in avatarList" :key="index" :class="'image-avatar ' + (item.URL === avatar && 'image-avatar-active')" :src="item.URL" :data-value="item" @tap="click"></image></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
console.log(app);
export default {
  data() {
    return {
      array: ['未设置性别', '女', '男'],
      index: 0,
      userInfo: {
        nick: '',
        avatarUrl: '',
        avatar: '',
        gender: '',
      },
      config: {
        avatar: '',
        nick: '',
        phone: '',
        token: '',
        userId: '',
        userSig: '',
      },
      infoNick: '',
      avatar: '',
      avatarList: [
        {
          avatarname: '头像1',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_01.png',
        },
        {
          avatarname: '头像2',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_02.png',
        },
        {
          avatarname: '头像3',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_03.png',
        },
        {
          avatarname: '头像4',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_04.png',
        },
        {
          avatarname: '头像5',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_05.png',
        },
        {
          avatarname: '头像6',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_06.png',
        },
        {
          avatarname: '头像7',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_07.png',
        },
        {
          avatarname: '头像8',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_08.png',
        },
        {
          avatarname: '头像9',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_09.png',
        },
        {
          avatarname: '头像10',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_10.png',
        },
        {
          avatarname: '头像11',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_11.png',
        },
        {
          avatarname: '头像12',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_12.png',
        },
        {
          avatarname: '头像13',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_13.png',
        },
        {
          avatarname: '头像14',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_14.png',
        },
        {
          avatarname: '头像15',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_15.png',
        },
        {
          avatarname: '头像16',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_16.png',
        },
        {
          avatarname: '头像17',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_17.png',
        },
        {
          avatarname: '头像18',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_18.png',
        },
        {
          avatarname: '头像19',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_19.png',
        },
        {
          avatarname: '头像20',
          URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_20.png',
        },
      ],
      popupToggle: false,
      popupToggleAvatar: false,
      imageSelected: false,
      imageTitle: '点击操作',
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      userInfo: app.globalData.userProfile,
    });
    console.log(app.globalData.userProfile);
    console.log(app.globalData.userProfile.gender);
    if (app.globalData.userProfile.gender === 'Gender_Type_Unknown') {
      this.index = 0;
    } else if (app.globalData.userProfile.gender === 'Gender_Type_Female') {
      this.index = 1;
    } else if (app.globalData.userProfile.gender === 'Gender_Type_Male') {
      this.index = 2;
    }
    uni.setNavigationBarTitle({
      title: '个人中心',
    });
  },

  methods: {
    // 修改性别
    gender: function (e) {
      console.log('picker发送选择改变，携带值为', e.target.value);
      this.index = e.target.value;
      if (this.index === 0) {
        // 修改个人标配资料
        let promise = uni.$TUIKit.updateMyProfile({
          gender: this.TIM.TYPES.GENDER_UNKNOWN,
        });
        promise
          .then(imResponse => {
            console.log(imResponse.data); // 更新资料成功
            this.userInfo = imResponse.data;
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      } else if (this.index === 1) {
        let promise = uni.$TUIKit.updateMyProfile({
          gender: this.TIM.TYPES.GENDER_FEMALE,
        });
        promise
          .then(imResponse => {
            console.log(imResponse.data); // 更新资料成功
            this.userInfo = imResponse.data;
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      } else if (this.index === 2) {
        let promise = uni.$TUIKit.updateMyProfile({
          gender: this.TIM.TYPES.GENDER_MALE,
        });
        promise
          .then(imResponse => {
            console.log(imResponse.data); // 更新资料成功
            // this.userInfo.gender = '男'
            this.userInfo = imResponse.data;
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      }
    },
    bindEditInput(e) {
      const val = e.detail.value;
      this.setData({
        infoNick: val ? val : '',
      });
    },

    // 修改昵称确认
    handleEditSubmit() {
      if (this.infoNick === app.globalData.userProfile.nick) {
        return;
      }
      this.setData({
        popupToggle: false,
      });
      const promise = uni.$TUIKit.updateMyProfile({
        nick: this.infoNick,
      });
      promise
        .then(imResponse => {
          console.log(imResponse.data); // Friend 实例
          this.setData({
            userInfo: imResponse.data,
            popupToggle: false,
          });
        })
        .catch(imError => {
          this.setData({
            popupToggle: false,
          });
          console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
        });
    },

    handleEditToggle() {
      this.setData({
        popupToggle: !this.popupToggle,
        infoNick: this.userInfo.nick,
      });
      console.log(this.infoNick, '999');
    },

    // 修改昵称 禁止冒泡
    handleCatchTap() {
      return;
    },

    // 修改头像
    changeAvatar() {
      this.setData({
        popupToggleAvatar: true,
      });
    },

    click(e) {
      console.log(e.currentTarget.dataset.value);
      this.setData({
        avatar: e.currentTarget.dataset.value.URL,
      });
    },

    // 修改头像确认
    handleEditSubmitAvatar() {
      uni.$TUIKit
        .updateMyProfile({
          avatar: this.avatar,
        })
        .then(imResponse => {
          this.setData({
            userInfo: imResponse.data,
            popupToggleAvatar: !this.popupToggleAvatar,
          });
        })
        .catch(() => {
          this.setData({
            popupToggleAvatar: !this.popupToggleAvatar,
          });
        });
    },

    handleEditToggleAvatar() {
      this.setData({
        popupToggleAvatar: !this.popupToggleAvatar,
        avatar: this.avatar,
      });
    },
  },
};
</script>
<style>
/* miniprogram/pages/Tui-personal/personal.wxss */
.container {
  background: #eef0f3;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.item {
  display: flex;
  width: 100%;
  justify-content: left;
  align-items: center;
}
.avatar {
  background: #ffffff;
  position: relative;
  width: 100%;
  height: 56px;
  padding-left: 20px;
  border-bottom: 1px solid #eef0f3;
  border-top: 8px solid #ffffff;
}
.nickname {
  position: relative;
  background: #ffffff;
  width: 100%;
  height: 56px;
  padding-left: 20px;
  border-bottom: 1px solid #eef0f3;
  border-top: 10px solid #ffffff;
}
.aside-left {
  display: flex;
  align-items: center;
  float: left;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 56px;
}
.image_radius {
  float: right;
  width: 40px;
  height: 40px;
  padding-right: 48px;
  padding-top: 8px;
}
.aside-right {
  float: right;
  font-size: 16px;
  color: #999999;
  letter-spacing: 0;
  text-align: right;
  line-height: 56px;
  padding-right: 48px;
}
.listimage {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 20px;
  right: 10px;
}
.popup-mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0; /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top)); /*  #endif  */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}
.popup-main {
  width: 100vw;
  height: 400rpx;
  background: #ffffff;
  padding: 32px 20px;
}
.popup-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  line-height: 36px;
}

.popup-main-header button {
  font-size: 16px;
  color: #5856d5;
  letter-spacing: 0;
  line-height: 28px;
  width: auto !important;
  background: transparent;
  margin: 0 !important;
}
.popup-main-input {
  background: #f4f5f9;
  padding: 14px 20px;
  margin: 20px 0;
  border-radius: 20px;
  border-radius: 20px;
}
.text {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
}
.popup-mask-avatar {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0; /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top)); /*  #endif  */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}
.popup-main-avatar {
  width: 100vw;
  height: 70%;
  background: #ffffff;
  padding: 32px 20px;
}
.popup-main-header-avatar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  line-height: 36px;
  height: 510px;
}
.popup-main-header-title-avatar {
  margin-bottom: 24px;
  padding-left: 10px;
  width: 104px;
  height: 25px;
}
.button-avatar {
  /* width: 32px;
  height: 24px; */
  float: right;
  /* padding-top: 5px; */
  font-size: 16px;
  color: #5856d5;
  letter-spacing: 0;
  line-height: 25px;
  width: auto !important;
  background: transparent;
  /* margin-top:-5px; */
  margin-right: 28px;
}
.image-list {
  padding-top: 16px;
  width: 100%;
  height: 800px;
  overflow: hidden;
  padding-left: 10px;
}
.image-avatar {
  width: 68px;
  height: 68px;
  float: left;
  margin: 10px 10px;
  border-radius: 4px;
  border: 1px solid #ffffff;
}
.image-avatar-active {
  border: 1px solid #5856d5;
  border-radius: 4px;
  border-radius: 4px;
}
</style>
