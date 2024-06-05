<template>
  <view>
    <!--miniprogram/pages/TUI-Group/create-group/create.wxml-->
    <view class="container">
      <view class="item" @tap.stop="showtype">
        <view class="group-type">
          <view class="icon-box">
            <text class="icon">*</text>
            <text class="aside-left">群类型</text>
            <text class="aside-right" @tap="popupToggle = true">{{ groupType }}</text>
          </view>

          <image class="listimage" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/detail.svg"></image>
        </view>
      </view>
      <view class="item">
        <view class="group-name">
          <view class="icon-box">
            <text class="icon">*</text>
            <text class="aside-left">群名称</text>
          </view>
          <input class="inputname" placeholder="名称" @input="bindgroupnameInput" placeholder-style="color:#BBBBBB;" />
        </view>
      </view>
      <view class="item">
        <view class="group-ID">
          <text class="aside-left">群ID</text>
          <input class="input" type="number" placeholder="请输入群ID" @input="bindgroupIDInput" placeholder-style="color:#BBBBBB;" />
        </view>
      </view>

      <view class="group-create" @tap="bindConfirmCreate">发起群聊</view>
    </view>

    <view class="pop-mask" v-if="popupToggle" @tap.stop="handleChooseToggle">
      <view class="popup-main" @tap.stop="handleCatchTap">
        <view v-for="(item, index) in groupTypeList" :key="index" :class="'type ' + (item.groupType === groupType && 'type-active')" :data-value="item" @tap="selectType">
          <view class="group-type-list" :data-item="item">
            <view class="list-type">
              <view>{{ item.groupType }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      groupTypeList: [
        {
          groupType: '品牌客户群（Work)',
          Type: uni.$TUIKitTIM.TYPES.GRP_WORK
        },
        {
          groupType: 'VIP专属群（Public)',
          Type: uni.$TUIKitTIM.TYPES.GRP_PUBLIC
        },
        {
          groupType: '临时会议群 (Meeting)',
          Type: uni.$TUIKitTIM.TYPES.GRP_MEETING
        },
        {
          groupType: '直播群（AVChatRoom）',
          Type: uni.$TUIKitTIM.TYPES.GRP_AVCHATROOM
        }
      ],
      groupType: '',
      Type: '',
      name: '',
      groupID: '',
      popupToggle: false
    };
  },

  components: {},
  props: {},
  methods: {
    showtype() {
      this.setData({
        popupToggle: true
      });
    },

    bindgroupIDInput(e) {
      const id = e.detail.value;
      this.setData({
        groupID: id
      });
    },

    bindgroupnameInput(e) {
      const groupname = e.detail.value;
      this.setData({
        name: groupname
      });
    },

    selectType(e) {
      this.setData({
        groupType: e.currentTarget.dataset.value.groupType,
        Type: e.currentTarget.dataset.value.Type,
        name: e.currentTarget.dataset.value.name,
        popupToggle: false
      });
    },

    bindConfirmCreate() {
      const promise = uni.$TUIKit.createGroup({
        type: this.Type,
        name: this.name,
        groupID: this.groupID
      });
      promise
        .then(imResponse => {
          // 创建成功
          // 创建的群的资料
          const { groupID } = imResponse.data.group;
          uni.navigateTo({
            url: `/im/chat/chat?conversationID=GROUP${groupID}`
          });
        })
        .catch((err) => {
          console.log(err,'err')
          uni.showToast({
            title: '群数量已达上限或该群组ID被使用',
            icon: 'none'
          });
        });
    },

    handleChooseToggle() {
      this.setData({
        popupToggle: false
      });
    },

    handleCatchTap() {
      console.log('占位：函数 handleCatchTap 未声明');
    }
  }
};
</script>
<style>
/* miniprogram/pages/TUI-Group/create-group/create.wxss */
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
.icon-box {
  display: flex;
}
.icon {
  color: red;
  padding-top: 34rpx;
}
.group-type {
  background: #ffffff;
  position: relative;
  width: 100%;
  height: 56px;
  padding-left: 20px;
  border-bottom: 1px solid #eef0f3;
  border-top: 8px solid #ffffff;
}
.group-ID {
  background: #ffffff;
  position: relative;
  width: 100%;
  height: 56px;
  padding-left: 20px;
  border-bottom: 1px solid #eef0f3;
  border-top: 8px solid #ffffff;
}
.listimage {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 20px;
  right: 10px;
}
.group-name {
  background: #ffffff;
  display: flex;
  width: 100%;
  height: 56px;
  padding-left: 20px;
  border-bottom: 1px solid #eef0f3;
  border-top: 8px solid #ffffff;
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
.aside-right {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: black;
  letter-spacing: 0;
  padding-left: 130px;
  line-height: 56px;
  z-index: 999;
}
.input {
  float: right;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #999999;
  letter-spacing: 0;
  text-align: right;
  line-height: 56px;
  padding-top: 19px;
  padding-right: 48px;
  width: 70%;
  /* z-index: 999; */
}
.inputname {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #999999;
  letter-spacing: 0;
  text-align: right;
  line-height: 56px;
  padding-left: 180rpx;
  padding-top: 19px;
  width: 50%;
}
.group-create {
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
  line-height: 44rpx;
  font-size: 32rpx;
}
.pop-mask {
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
  height: 30%;
  background: #ffffff;
  padding: 32px 20px;
}
.group-type-list {
  width: 100vw;
  height: 112rpx;
}
.list-type {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 22px;
}
.type-active {
  color: #5856d5;
}
</style>
