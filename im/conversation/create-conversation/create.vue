<template>
  <view class="TUI-Create-conversation-container">
    <view class="tui-search-area">
      <view class="tui-search-bar">
        <image
          class="tui-searchcion"
          src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/serach-icon.svg"
        ></image>
        <input
          class="tui-search-bar-input"
          :value="userID"
          placeholder="请输入用户ID"
          @input="userIDInput"
          @confirm="getuserProfile"
          @blur="getuserProfile"
        />
      </view>
      <view class="tui-showID">您的用户ID {{ userInfo.userID }}</view>
    </view>
    <view class="tui-person-to-invite" v-if="searchUser.userID">
      <image
        @click="handleChoose"
        class="tui-normal-choose"
        :src="
          isChoose
            ? 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/single-choice-hover.svg'
            : 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/single-choice-normal.svg'
        "
      ></image>
      <view class="tui-person-profile">
        <image
          class="tui-person-profile-avatar"
          :src="
            searchUser.avatar ||
            'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'
          "
        ></image>
        <view>
          <view class="tui-person-profile-nick">{{ searchUser.nick }}</view>
          <view class="tui-person-profile-userID"
            >用户ID：{{ searchUser.userID }}</view
          >
        </view>
      </view>
    </view>
    <view class="tui-confirm-btn" @tap="bindConfirmInvite">确认邀请</view>
  </view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      userID: "",
      searchUser: {},
      isChoose: false,
      userInfo: {},
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.userInfo = app.globalData.userInfo;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },

    userIDInput(e) {
      this.setData({
        userID: e.detail.value,
        searchUser: {},
      });
    },

    getuserProfile() {
      uni.$TUIKit
        .getUserProfile({
          userIDList: [this.userID],
        })
        .then((imRes) => {
          if (imRes.data.length > 0) {
            this.setData({
              searchUser: imRes.data[0],
            });
          } else {
            uni.showToast({
              title: "用户不存在",
              icon: "error",
            });
            this.setData({
              userID: "",
            });
          }
        });
    },

    handleChoose() {
      this.isChoose = !this.isChoose;
      this.setData({
        searchUser: this.searchUser,
      });
    },

    bindConfirmInvite() {
      if (this.isChoose) {
        uni.navigateTo({
          url: `/im/chat/chat?conversationID=C2C${this.searchUser.userID}`,
        });
      } else {
        uni.showToast({
          title: "请选择相关用户",
          icon: "none",
        });
      }
    },
  },
};
</script>
<style scoped>
.TUI-Create-conversation-container {
  width: 100vw;
  height: 100vh;
  background-color: #f4f5f9;
}

.tui-navigatorbar {
  position: absolute;
  top: 0;
  width: 750rpx;
  height: 176rpx;
  background-color: #5856d5;
}

.tui-navigatorbar-back {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  left: 24rpx;
  bottom: 20rpx;
}

.conversation-title {
  position: absolute;
  width: 350rpx;
  height: 88rpx;
  line-height: 56rpx;
  font-size: 36rpx;
  color: #ffffff;
  z-index: 100;
  bottom: 0;
  left: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tui-search-area {
  width: 100%;
  background-color: #5856d5;
  padding-top: 20rpx;
}
.tui-showID {
  padding-left: 80rpx;
  font-size: 28rpx;
  color: white;
  height: 50rpx;
  padding-top: 18rpx;
}
.tui-search-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 40rpx;
  margin-top: 32rpx;
  width: 670rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 40rpx;
  border-radius: 40rpx;
}

.tui-searchcion {
  display: inline-block;
  margin-left: 24rpx;
  width: 48rpx;
  height: 48rpx;
}

.tui-search-bar-input {
  margin-left: 16rpx;
  line-height: 40rpx;
  font-size: 28rpx;
  width: 100%;
  display: inline-block;
}

.tui-person-to-invite {
  display: flex;
  flex-wrap: nowrap;
  width: 750rpx;
  height: 150rpx;
  background-color: #ffffff;
}

.tui-normal-choose {
  margin-left: 40rpx;
  margin-right: 40rpx;
  margin-top: 52rpx;
  margin-bottom: 50rpx;
  width: 48rpx;
  height: 48rpx;
}

.tui-person-profile {
  width: 622rpx;
  display: flex;
  align-items: center;
}

.tui-person-profile-avatar {
  width: 96rpx;
  height: 96rpx;
  margin-right: 24rpx;
}

.tui-person-profile-nick {
  color: #333333;
  line-height: 50rpx;
  font-size: 36rpx;
  margin-bottom: 4rpx;
}

.tui-person-profile-userID {
  color: #999999;
  line-height: 40rpx;
  font-size: 28rpx;
}

.tui-confirm-btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 100rpx;
  width: 670rpx;
  height: 96rpx;
  background: #5856d5;
  color: #ffffff;
  border-radius: 48rpx;
  border-radius: 48rpx;
  margin-left: 40rpx;
  line-height: 44rpx;
  font-size: 32rpx;
}
</style>
