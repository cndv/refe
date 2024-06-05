<template>
  <view class="container-conversation">
    <view class="scroll-box">
      <view class="uni-list margintop-bar">
        <view
          v-for="item in conversationList"
          :key="item.conversationID"
          @tap="handleRoute(item.conversationID)"
        >
          <TUI-conversation-item
            :data-type="item.type"
            :conversation="item"
          ></TUI-conversation-item>
        </view>
      </view>
    </view>
    <view class="bottom-back">
      <view class="bottom-area">
        <view
          v-if="showSelectTag"
          class="conversation-bubble"
          @tap.stop="handleEditToggle"
        >
          <view
            v-for="(item, index) in array"
            :key="index"
            class="picker"
            :data-name="item.name"
            @tap="handleOnTap"
          >
            {{ item.name }}
          </view>
        </view>
        <image
          @tap="showMore"
          class="btn-show-more"
          src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/add.svg"
        ></image>
        <view @tap="learnMore" class="im-link">了解更多IM功能</view>
      </view>
    </view>
  </view>
</template>
<!-- 这里有个加载的补丁逻辑待优化，页面向SDK请求conversationList的时候会有时延，
造成页面的一个抖动，这里加一个if逻辑打一个补丁，后续继续优化 -->
<script>
import TUIConversationItem from "../../../components/tui-conversation/conversation-item/index";
import TUIMessageList from "../../components/tui-chat/message-list/index";

export default {
  data() {
    return {
      conversationList: [],
      showSelectTag: false,
      array: [
        {
          name: "发起会话",
        },
        {
          name: "发起群聊",
        },
        {
          name: "加入群聊",
        },
      ],
    };
  },

  components: {
    TUIConversationItem,
    TUIMessageList,
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 登入后拉去会话列表
    this.getConversationList();
    uni.$TUIKit.on(
      uni.$TUIKitEvent.CONVERSATION_LIST_UPDATED,
      this.onConversationListUpdated
    );
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    uni.$TUIKit.off(uni.$TUIKitEvent.SDK_READY, this.onConversationListUpdated);
  },

  methods: {
    handleRoute(id) {
      const url = `/im/chat/chat?conversationID=${id}`;
      uni.navigateTo({
        url,
      });
    },
    onConversationListUpdated(event) {
      this.setData({
        conversationList: event.data,
      });
    },

    getConversationList() {
      uni.$TUIKit.getConversationList().then((imResponse) => {
        this.setData({
          conversationList: imResponse.data.conversationList,
        });
      });
    },

    showMore() {
      this.setData({
        showSelectTag: !this.showSelectTag,
      });
    },

    learnMore() {},

    handleOnTap(event) {
      this.setData(
        {
          showSelectTag: false,
        },
        () => {
          switch (event.currentTarget.dataset.name) {
            case "发起会话":
              this.$createConversation();
              break;

            case "发起群聊":
              this.$createGroup();
              break;

            case "加入群聊":
              this.$joinGroup();

            default:
              break;
          }
        }
      );
    },

    handleEditToggle() {
      this.setData({
        showSelectTag: false,
      });
    },

    $createConversation() {
      uni.navigateTo({
        url: "/im/conversation/create",
      });
    },

    $createGroup() {
      uni.navigateTo({
        url: "/im/group/create-group/create",
      });
    },

    $joinGroup() {
      uni.navigateTo({
        url: "/im/group/join-group/join",
      });
    },
  },
};
</script>
<style scoped>
.container-conversation {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f7f8fa;
  height: 100vh;
  width: 100%;
}

.scroll-box {
  height: calc(100vh - 165rpx);
  overflow-y: scroll;
}
.margintop-bar {
  margin-bottom: 160 rpx;
}

.btn-show-more {
  display: flex;
  width: 160rpx;
  height: 160rpx;
  padding-left: 3rpx;
}

.picker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 96rpx;
}
.bottom-back {
  position: fixed;
  height: 160rpx;
  width: 100%;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #f4f5f9;
  z-index: 3;
}
.bottom-area {
  flex-direction: column;
  position: absolute;
  bottom: 60rpx;
  right: 0;
  left: 0;
  margin: auto;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.im-link {
  width: 218rpx;
  height: 36rpx;
  font-size: 28rpx;
  line-height: 36rpx;
  margin: 0 auto;
  color: #5856d5;
}
.conversation-bubble {
  padding-top: 40rpx;
  position: absolute;
  width: 300rpx;
  padding-right: 3px;
  background-color: #ffffff;
  height: 320rpx;
  bottom: 220rpx;
  z-index: 100;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
  border-radius: 14rpx;
}
.conversation-bubble:before,
.conversation-bubble:after {
  content: "";
  display: block;
  border-width: 20px;
  position: absolute;
  bottom: -40px;
  left: 54px;
  border-style: solid dashed dashed;
  border-color: #fff transparent transparent;
  font-size: 0;
  line-height: 0;
  margin-left: 4px;
}

.conversation-bubble:after {
  bottom: -33px;
  border-color: #fff transparent transparent;
}
</style>
