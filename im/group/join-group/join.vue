<template>
  <view class="TUI-Create-conversation-container">
    <view class="tui-search-area">
      <view class="tui-search-bar">
        <image class="tui-searchcion" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/serach-icon.svg"></image>
        <input class="tui-search-bar-input" :value="groupID" placeholder="请输入群ID（5213）" @input="groupIDInput" @confirm="searchGroupByID" @blur="searchGroupByID" />
      </view>
    </view>
    <view class="tui-person-to-invite" v-if="searchGroup.groupID">
      <image @tap="handleChoose" class="tui-normal-choose" :src="isChoose ? 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/single-choice-hover.svg' : 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/single-choice-normal.svg'"></image>
      <view class="tui-person-profile">
        <image class="tui-person-profile-avatar" :src="groupAvatar || 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/gruopavatar.png'"></image>
        <view>
          <view class="tui-person-profile-nick">{{ searchGroup.name }}</view>
          <view class="tui-person-profile-userID">群ID：{{ searchGroup.groupID }}</view>
        </view>
      </view>
    </view>
    <view class="tui-confirm-btn" @tap="bindConfirmJoin">确认加入</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      groupID: '',
      searchGroup: {
        groupID: '',
        name: ''
      },
      isChoose: false,
      groupAvatar: ''
    };
  },

  components: {},
  props: {},
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },

    groupIDInput(e) {
      this.setData({
        groupID: e.detail.value
      });
    },

    searchGroupByID() {
      uni.$TUIKit
        .searchGroupByID(this.groupID)
        .then(imResponse => {
          if (imResponse.data.group.groupID !== '') {
            this.searchGroup = imResponse.data.group;
            if (imResponse.data.group.avatar !== 'FaceUrl') {
              this.groupAvatar = imResponse.data.group.avatar;
            }
          }
        })
        .catch(imError => {
          uni.hideLoading();

          if (imError.code === 10007) {
            uni.showToast({
              title: '讨论组类型群不允许申请加群',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: '未找到该群组',
              icon: 'none'
            });
          }
        });
    },

    handleChoose() {
      this.isChoose = !this.isChoose;
      this.setData({
        searchGroup: this.searchGroup
      });
    },

    bindConfirmJoin() {
      uni.$TUIKit
        .joinGroup({
          groupID: this.groupID,
          type: this.searchGroup.type
        })
        .then(imResponse => {
          switch (imResponse.data.status) {
            case uni.$TUIKitTIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
              // 等待管理员同意
              break;

            case uni.$TUIKitTIM.TYPES.JOIN_STATUS_SUCCESS:
              // 加群成功
              console.log(imResponse.data.group); // 加入的群组资料

              break;

            case uni.$TUIKitTIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
              // 已经在群中
              break;

            default:
              break;
          }
        })
        .catch(imError => {
          console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
        });

      if (this.isChoose) {
        uni.navigateTo({
          url: `/im/chat/chat?conversationID=GROUP${this.searchGroup.groupID}`
        });
      } else {
        uni.showToast({
          title: '请选择相关群聊',
          icon: 'error'
        });
      }
    }
  }
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
  position: absolute;
  width: 750rpx;
  height: 144rpx;
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
  position: absolute;
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
