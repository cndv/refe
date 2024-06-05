<template>
  <view class="container" v-if="isLogin">
    <view
      class="chatBg"
      v-if="!isShow && conversation && conversation.userProfile"
      @click="nameTo"
    >
      <image
        v-if="conversation.userProfile"
        :src="
          conversation.userProfile.avatar ||
          'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'
        "
      >
      </image>
      <view class="chatUser">
        <text>{{ conversation.userProfile.nick }}</text>
        <text>23岁</text>
      </view>
    </view>
    <!-- 小程序视频通话 -->
    <!--  #ifdef  MP-WEIXIN -->
    <tuicalling
      ref="TUICalling"
      id="TUICalling-component"
      :config="config"
    ></tuicalling>
    <!--  #endif -->
    <!-- 先查 remark；无 remark 查 (c2c)nick/(group)name；最后查 (c2c)userID/(group)groupID -->
    <!-- <view class="tui-chatroom-navigatorbar" v-if="conversation.type === 'GROUP'"></view> -->
    <view class="group-profile">
      <TUI-group-profile
        id="groip-profile"
        v-if="isShow"
        :conversation="conversation"
      ></TUI-group-profile>
    </view>
    <view class="message-list" @tap="triggerClose">
      <TUI-message-list
        ref="messageList"
        id="message-list"
        :conversation="conversation"
      ></TUI-message-list>
    </view>
    <view class="container-box" v-if="videoPlay" @tap.stop="stopVideoHander">
      <video
        class="video-message"
        v-if="videoPlay"
        :src="videoMessage.payload.videoUrl"
        :poster="videoMessage.payload.snapshotUrl"
        object-fit="cover"
        error="videoError"
        autoplay="true"
        direction="0"
      ></video>
    </view>
    <view class="message-input" v-if="showChat">
      <TUI-message-input
        ref="messageInput"
        id="message-input"
        :conversation="conversation"
        @sendMessage="sendMessage"
        @handleCall="handleCall"
      ></TUI-message-input>
    </view>
  </view>
</template>

<script>
import TUIMessageList from "../components/tui-chat/message-list/index";
import TUIMessageInput from "../components/tui-chat/message-input/index";
import TUIGroupProfile from "../components/tui-group/group-profile/index";

export default {
  data() {
    return {
      conversationName: "",
      conversation: {},
      messageList: [],
      isShow: false,
      showChat: true,
      conversationID: "",
      videoPlay: false,
      videoMessage: {},
      config: {
        sdkAppID: uni.getStorageSync("sdkAppID"),
        userID: uni.getStorageSync("userID"),
        userSig: uni.getStorageSync("userSig"),
        type: 1,
        tim: null,
      },
      friendList: "",
      options: "",
    };
  },

  components: {
    TUIMessageList,
    TUIMessageInput,
    TUIGroupProfile,
  },
  props: {},
  created() {
    uni.$on("videoPlayerHandler", (value) => {
      this.videoPlay = value.isPlay;
      this.videoMessage = value.message;
    });
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
  watch: {
    isLogin(val) {
      if (val) {
        this.getMsg();
      }
    },
  },
  /**
   * 生命周期函数--监听页 面加载
   */
  onLoad(options) {
    this.options = options;
    if (this.isLogin) {
      this.getMsg();
    }
  },
  onUnload() {
    // #ifdef  MP-WEIXIN
    this.$refs.TUICalling.destroyed();
    // #endif
  },
  methods: {
    getMsg() {
      this.getFriendList();
      // #ifdef  MP-WEIXIN
      // 初始化 小程序视频通话 TUICalling
      this.config = {
        sdkAppID: uni.getStorageSync("sdkAppID"),
        userID: uni.getStorageSync("userInfo").userID,
        userSig: uni.getStorageSync("userInfo").userSig,
      };
      this.$nextTick(() => {
        this.$refs.TUICalling.init();
      });
      // #endif

      const { conversationID } = this.options;
      this.conversationID = conversationID;
      uni.$TUIKit
        .setMessageRead({
          conversationID,
        })
        .then(() => {});
      uni.$TUIKit.getConversationProfile(conversationID).then((res) => {
        const { conversation } = res.data;

        this.conversation = conversation;
        uni.setNavigationBarTitle({
          title: this.getConversationName(conversation),
        });
        this.setData({
          conversationName: this.getConversationName(conversation),
          isShow: conversation.type === "GROUP",
        });
      });
    },
    nameTo() {
      this.pageUrl();
    },
    pageUrl() {
      const num = this.conversationID.slice(0, 3);
      const list = this.friendList;
      // 跳转好友信息页面
      if (num === "C2C") {
        const ID = this.conversationID.substring(3);
        const id = list.some((item) => item.userID == ID);
        if (id === true) {
          let promise = uni.$TUIKit.getFriendProfile({
            userIDList: [ID],
          });
          promise
            .then(function (imResponse) {
              const { friendList, failureUserIDList } = imResponse.data;
              friendList.forEach((friend) => {
                // Friend 对象
              });
              // 失败的 userIDList
              failureUserIDList.forEach((item) => {
                const { userID, code, message } = item;
              });
              var id = friendList[0].userID;
              var avatar = friendList[0].profile.avatar;
              var remark = friendList[0].remark;
              uni.navigateTo({
                url:
                  "/im/information/information?id=" +
                  id +
                  "&url=" +
                  avatar +
                  "&remark=" +
                  remark +
                  "&index=1",
              });
            })
            .catch(function (imError) {
              console.warn("getFriendProfile error:", imError); // 获取失败
            });
        } else {
          let promise = uni.$TUIKit.getUserProfile({
            userIDList: [ID], // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
          });
          promise
            .then(function (imResponse) {
              // 存储用户资料的数组 - [Profile]
              const userID = imResponse.data;
              for (var i = 0; i < userID.length; i++) {
                var id = userID[i].userID;
                var avatar = userID[i].avatar;
                var nick = userID[i].nick;
              }
              uni.navigateTo({
                url:
                  "/im/information/information?id=" +
                  id +
                  "&url=" +
                  avatar +
                  "&nick=" +
                  nick +
                  "&index=2",
              });
            })
            .catch(function (imError) {
              console.warn("getUserProfile error:", imError); // 获取其他用户资料失败的相关信息
            });
        }
      }

      // 跳转群聊信息页面
      if (num === "GRO") {
        const group = this.conversationID.substring(5);
        uni.navigateTo({
          url: "/im/information/groupInfo?id=" + group,
        });
      }
    },
    onNavigationBarButtonTap() {
      this.pageUrl();
    },
    stopVideoHander() {
      this.videoPlay = false;
    },
    getFriendList() {
      let promise = uni.$TUIKit.getFriendList();
      promise
        .then((imResponse) => {
          const friendList = imResponse.data; // 好友列表
          this.friendList = friendList;
        })
        .catch(function (imError) {
          console.warn("getFriendList error:", imError); // 获取好友列表失败的相关信息
        });
    },
    getConversationName(conversation) {
      if (conversation.type === "@TIM#SYSTEM") {
        this.setData({
          showChat: false,
        });
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
    handleCall(val) {
      console.log(val.detail.userID, "通话id");

      console.log(val.detail.type, "通话类型");
      // 小程序通话
      // #ifdef  MP-WEIXIN
      this.$refs.TUICalling.call({
        userID: val.detail.userID,
        type: val.detail.type,
      });
      // #endif

      // APP通话
      // #ifdef  APP-PLUS
      console.log("callMediaType", Number(val.detail.type));
      uni.$TUICallKit.call(
        {
          userID: val.detail.userID,
          callMediaType: Number(val.detail.type),
        },
        (res) => {
          if (res.code === 0) {
            console.log("call success");
          } else {
            console.log(`${res.msg}`);
          }
        }
      );
      // #endif
    },
    sendMessage(event) {
      // 将自己发送的消息写进消息列表里面
      this.$refs.messageList.updateMessageList(event.detail.message);
    },

    triggerClose() {
      if (this.showChat) {
        this.$refs.messageInput.handleClose();
      }
    },

    goBack() {
      const pages = getCurrentPages(); // 当前页面栈

      if (
        pages[pages.length - 2].route ===
          "/im/conversation/create-conversation/create" ||
        pages[pages.length - 2].route ===
          "pages/TUI-Group/create-group/create" ||
        pages[pages.length - 2].route === "pages/TUI-Group/join-group/join"
      ) {
        uni.navigateBack({
          delta: 2,
        });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }

      uni.$TUIKit
        .setMessageRead({
          conversationID: this.conversationID,
        })
        .then(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.chatBg {
  position: fixed;
  /*  #ifdef H5 */
  top: 120rpx;
  /*  #endif  */
  /*  #ifdef MP-WEIXIN || APP-PLUS */
  top: 20rpx;
  /*  #endif  */

  width: 90%;
  background: linear-gradient(to right, #6665f6, #fa709a);
  border-radius: 10rpx;
  display: flex;
  left: 50%;
  margin-left: -45%;
  padding: 10px 20px;
  box-sizing: border-box;
  z-index: 99;

  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 100rpx;
  }

  .chatUser {
    color: #ffffff;
    font-size: 30rpx;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.tui-chatroom-navigatorbar {
  position: relative;
  flex-shrink: 0;
  height: 90rpx;
}

.tui-chatroom-navigatorbar-back {
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

.message-list {
  flex: 1;
  width: 100vw;
  overflow-y: scroll;
}

.message-input {
  flex-shrink: 0;
  width: 100%;
}

.calling {
  position: fixed;
  z-index: 199;
  top: 0;
  /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));
  /*  #endif  */
  bottom: 0;
  right: 0;
}

.group-profile {
  z-index: 1111;
}

.container-box {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.video-message {
  width: 90vw;
  height: 300px;
}
</style>
