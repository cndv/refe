<template>
  <div>
    <!--TODO: 默认图片在 cos 上添加 -->
    <movable-area
      v-if="conversation.conversationID"
      class="t-conversation-item-container"
    >
      <movable-view
        class="t-conversation-item"
        direction="horizontal"
        @change="handleTouchMove"
        damping="100"
        :x="xScale"
      >
        <view class="avatar-box">
          <image
            class="t-conversation-item-avatar"
            :src="setConversationAvatar || ''"
            @error="handleImageError"
          ></image>
          <view class="unread" v-if="conversation.unreadCount !== 0">
            <view class="read-text" v-if="conversation.unreadCount > 99"
              >99+</view
            >
            <view class="read-text" v-else>{{ conversation.unreadCount }}</view>
          </view>
        </view>
        <view class="t-conversation-item-content">
          <label class="tui-conversation-item-name">
            {{ conversationName }}
            <text v-if="conversation.type === 'GROUP'">　　-[群聊]</text>
          </label>
          <view class="tui-conversation-lastMessage">
            <text>{{ conversation.lastMessage.messageForShow }}</text>
          </view>
        </view>
        <view class="t-conversation-item-info">
          {{ timeago }}
        </view>
        <!--    <view class="t-conversation-delete" @tap.stop="deleteConversation">删除</view>-->
      </movable-view>
    </movable-area>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xScale: 0,
      conversationName: "",
      conversationAvatar: "",
      setConversationAvatar: "",
      timeago: "",
    };
  },

  components: {},
  props: {
    conversation: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    conversation: {
      handler: function (conversation) {
        // 计算时间戳
        this.setData({
          conversationName: this.getConversationName(conversation),
          setConversationAvatar:
            this.setConversationAvatarHandler(conversation),
          timeago: this.caculateTimeago(
            conversation.lastMessage.lastTime * 1000
          ),
        });
        this.$updateTimeago(conversation);
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    caculateTimeago(dateTimeStamp) {
      const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示

      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const now = new Date().getTime(); // 获取当前时间毫秒

      const diffValue = now - dateTimeStamp; // 时间差

      let result = "";

      if (diffValue < 0) {
        return;
      }

      const minC = diffValue / minute; // 计算时间差的分，时，天，周，月

      const hourC = diffValue / hour;
      const dayC = diffValue / day;
      const weekC = diffValue / week;

      if (weekC >= 1 && weekC <= 4) {
        result = ` ${parseInt(weekC, 10)}周前`;
      } else if (dayC >= 1 && dayC <= 6) {
        result = ` ${parseInt(dayC, 10)}天前`;
      } else if (hourC >= 1 && hourC <= 23) {
        result = ` ${parseInt(hourC, 10)}小时前`;
      } else if (minC >= 1 && minC <= 59) {
        result = ` ${parseInt(minC, 10)}分钟前`;
      } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
      } else {
        const datetime = new Date();
        datetime.setTime(dateTimeStamp);
        const Nyear = datetime.getFullYear();
        const Nmonth =
          datetime.getMonth() + 1 < 10
            ? `0${datetime.getMonth() + 1}`
            : datetime.getMonth() + 1;
        const Ndate =
          datetime.getDate() < 10
            ? `0${datetime.getDate()}`
            : datetime.getDate();
        result = `${Nyear}-${Nmonth}-${Ndate}`;
      }

      return result;
    },
    // 先查 remark；无 remark 查 (c2c)nick/(group)name；最后查 (c2c)userID/(group)groupID
    getConversationName(conversation) {
      if (conversation.type === "@TIM#SYSTEM") {
        return "系统通知";
      }

      if (conversation.type === "C2C") {
        return (
          conversation.remark ||
          conversation.userProfile.nick ||
          conversation.userProfile.userID
        );
      }

      if (conversation.type === "GROUP") {
        return (
          conversation.groupProfile.name || conversation.groupProfile.groupID
        );
      }
    },

    setConversationAvatarHandler(conversation) {
      if (conversation.type === "@TIM#SYSTEM") {
        return "https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/msg/system.png";
      }

      if (conversation.type === "C2C") {
        return (
          conversation.userProfile.avatar ||
          "https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png"
        );
      }

      if (conversation.type === "GROUP") {
        return (
          conversation.groupProfile.avatar ||
          "https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/gruopavatar.png"
        );
      }
    },

    deleteConversation() {
      uni.showModal({
        content: "确认删除会话？",
        success: (res) => {
          if (res.confirm) {
            uni.$TUIKit.deleteConversation(this.conversation.conversationID);
            this.setData({
              conversation: {},
              xScale: 0,
            });
          }
        },
      });
    },

    handleTouchMove(e) {
      if (!this.lock) {
        this.last = e.detail.x;
        this.lock = true;
      }

      if (this.lock && e.detail.x - this.last < -5) {
        this.setData({
          xScale: -75,
        });
        setTimeout(() => {
          this.lock = false;
        }, 2000);
      } else if (this.lock && e.detail.x - this.last > 5) {
        this.setData({
          xScale: 0,
        });
        setTimeout(() => {
          this.lock = false;
        }, 2000);
      }
    },

    $updateTimeago(conversation) {
      if (conversation.conversationID) {
        conversation.lastMessage.messageForShow =
          conversation.lastMessage.messageForShow.slice(0, 15);
      }
      this.setData({
        conversation,
      });
    },

    handleImageError() {
      this.setData({
        setConversationAvatar:
          "https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/gruopavatar.png",
      });
    },
  },
};
</script>

<style scoped>
.t-conversation-item-container {
  width: 100%;
  height: 150rpx;
  background-color: #ffffff;
}

.t-conversation-item {
  width: 100%;
  height: 150rpx;
  display: flex;
  left: 0;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}
.avatar-box {
  position: relative;
  display: inline-flex;
}
.t-conversation-item-avatar {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  border-radius: 14rpx;
  margin: 0 16rpx;
  overflow: auto;
}
.t-conversation-item-content {
  max-width: 60%;
  flex: 1;
  padding-left: 20rpx;
}
.t-conversation-item-info {
  line-height: 34rpx;
  font-size: 24rpx;
  color: #999999;
  margin-right: 30rpx;
}

.t-error {
  background-color: #fb5250;
  color: #fff;
}

.t-conversation-delete {
  width: 144rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e85454;
  color: #ffffff;
  line-height: 44rpx;
  font-size: 32rpx;
}

.tui-conversation-item-name {
  line-height: 53rpx;
  font-size: 36rpx;
  font-family: "PingFangSC-Regular";
  color: #333333;
}

.tui-conversation-lastMessage {
  line-height: 40rpx;
  font-size: 28rpx;
  font-family: "PingFangSC-Regular";
  color: #999999;
  max-width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.unread {
  top: -10rpx;
  right: 0rpx;
  position: absolute;
  padding: 0 10rpx;
  height: 15px;
  border-radius: 16rpx;
  color: #ffffff;
  background-color: red;
}
.read-text {
  line-height: 15px;
  font-size: 10px;
}
</style>
