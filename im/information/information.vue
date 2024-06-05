<template>
  <view>
    <view class="contain">
      <view class="view-image-text">
        <image class="image-radius" :src="userInfo.url || 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'"></image>
        <view class="text-container">
          <view class="name">
            <text class="hasname">{{ userInfo.remark }}</text>
          </view>
          <view class="ID">id：{{ userInfo.id }}</view>
        </view>
      </view>
    </view>
    <view class="box">
      <block>
        <view class="list one" @tap="handleEditToggle" v-if="index">
          <view class="list-name">备注名</view>
          <view class="remarkname">
            <text class="aside-right">{{ userInfo.remark }}</text>
            <u-icon class="listimage" name="arrow-right" color="#000000" size="20"></u-icon>
          </view>
          <view class="popup-mask" v-if="popupToggle" @tap.stop="handleEditToggle">
            <view class="popup-main" @tap.stop="handleCatchTap">
              <view class="popup-main-header">
                <label class="popup-main-header-title">修改备注</label>
                <button class="button" @tap.stop="handleEditSubmit" :disabled="!infoNick">确认</button>
              </view>
              <input class="popup-main-input" type="text" :value="infoNick" @input="bindEditInput" />
              <label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
            </view>
          </view>
        </view>
        <view class="list one" v-else>
          <view class="list-name">昵称</view>
          <view class="remarkname">
            <text class="aside-right">{{ userInfo.id }}</text>
          </view>
        </view>
        <view class="list one">
          <view class="list-name">来源</view>
          <view class="remarkname">
            <text class="aside-right">API</text>
          </view>
        </view>
      </block>
    </view>
    <view class="butt">
      <view class="quit-main" v-show="display" @tap="handleAdd">
        <view class="quit-main-text">添加好友</view>
      </view>
      <view class="add-frien" v-if="popupAdd" @tap.stop="handleAdd">
        <view class="add-main" @tap.stop="handleCatchTap">
          <view class="popup-main-header">
            <label class="popup-main-header-title">添加好友</label>
            <button class="button" @tap.stop="friendApplication(userInfo.id)">确认</button>
          </view>
          <view class="add-url">
            <image class="image-radius" :src="userInfo.url || 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'"></image>
            <text>{{ userInfo.id }}</text>
          </view>
          <view class="test">
            <text>请输入验证信息</text>
            <input class="add-input" type="text" placeholder="请输入验证信息" @input="testInput" :value="infoTest" />
          </view>
          <view class="test">
            <text>备注</text>
            <input class="add-input" type="text" placeholder="请输入" @input="remarksInput" :value="infoRemark" />
          </view>
        </view>
      </view>
      <view class="quit-main" @tap="navigateBack">
        <view class="quit-main-text">发送消息</view>
      </view>
      <view class="quit-main" @tap="delFriend(userInfo.id)" v-show="dele">
        <view class="quit-main-text del">删除好友</view>
      </view>
      <view class="quit-main" @tap="join(userInfo.id)" v-if="isShow">
        <view class="quit-main-text del">加入黑名单</view>
      </view>
      <view class="quit-main" @tap="remove(userInfo.id)" v-else>
        <view class="quit-main-text del">移除黑名单</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  // 在test.vue页面，向起始页通过事件传递数据
  onLoad: function (option) {
    if (option.index == 1) {
      this.userInfo = option;
      this.index = true;
      this.dele = true;
    } else if (option.index == 2) {
      this.userInfo = option;
      this.index = false;
      this.userInfo.remark = option.id;
      this.display = true;
    } else if (option.index == 3) {
      this.userInfo = option;
      this.index = true;
      this.dele = true;
      this.isShow = false;
    }
    this.getPer();
  },
  data() {
    return {
      dele: false,
      display: false,
      show: true,
      popupToggle: false,
      popupToggleAvatar: false,
      popupAdd: false,
      userInfo: '',
      infoNick: '', //备注设置
      infoTest: '', //验证信息
      infoRemark: '', //申请备注
      isShow: true,
      own: '',
      index: false,
    };
  },
  components: {},
  props: {},

  onShow() {},

  methods: {
    bindEditInput(e) {
      const val = e.detail.value;
      this.infoNick = val ? val : '';
      console.log(val);
    },
    testInput(e) {
      const val = e.detail.value;
      this.infoTest = val ? val : '';
      console.log(val);
    },
    remarksInput(e) {
      const val = e.detail.value;
      this.infoRemark = val ? val : '';
      console.log(val);
    },
    // 修改昵称 禁止冒泡
    handleCatchTap() {
      return;
    },
    // 修改昵称确认
    handleEditSubmit() {
      console.log(this.userInfo.id);
      console.log(this.userInfo.remark);
      const ID = this.userInfo.id;
      const remark = this.userInfo.remark;
      if (this.infoNick === this.remark) {
        return;
      }
      this.popupToggle = false;
      let promise = uni.$TUIKit.updateFriend({
        userID: ID,
        remark: this.infoNick,
      });
      console.log(ID);
      promise
        .then(imResponse => {
          console.log(imResponse.data); // Friend 实例
          this.userInfo.remark = imResponse.data.remark;
          this.popupToggle = false;
        })
        .catch(function (imError) {
          console.warn('getFriendProfile error:', imError); // 更新失败
        });
    },
    // 添加好友确认
    friendApplication(id) {
			  let toId = id.split("C2C")[1];
      console.log(this.TIM); //添加的好友id
      console.log(this.own); //我的id
      let promise = uni.$TUIKit.addFriend({
       to: toId.split("-")[0],
        source: 'AddSource_Type_Web',
        remark: this.infoRemark,
        // groupName: '好友',
        wording: this.infoTest,
        type: this.TIM.TYPES.SNS_ADD_TYPE_BOTH,
      });
      promise
        .then(imResponse => {
          // 添加好友的请求发送成功
          const { code } = imResponse.data;
          console.log(code);
          if (code === 30539) {
            // 30539 说明 user1 设置了【需要经过自己确认对方才能添加自己为好友】，此时 SDK 会触发 TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED 事件
            uni.showModal({
              title: '提示',
              content: '申请添加好友成功',
              success: res => {
                if (res.confirm) {
                  console.log('用户点击确定');
                  this.setData({
                    popupAdd: !this.popupAdd,
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              },
            });
          } else if (code === 0) {
            // 0 说明 user1 设置了【允许任何人添加自己为 好友】，此时 SDK 会触发 TIM.EVENT.FRIEND_LIST_UPDATED 事件
            uni.showModal({
              title: '提示',
              content: '添加好友成功',
              success: res => {
                if (res.confirm) {
                  console.log('用户点击确定');
                  this.display = false;
                  this.dele = true;
                  this.popupAdd = !this.popupAdd;
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              },
            });
          }
        })
        .catch(function (imError) {
          console.warn('addFriend error:', imError); // 添加好友失败的相关信息
        });
    },
    handleEditToggle() {
      this.popupToggle = !this.popupToggle;
      this.infoNick = this.userInfo.remark;
    },
    handleAdd() {
      this.popupAdd = !this.popupAdd;
    },
    navigateBack() {
      uni.navigateTo({
        url: '/im/chat/chat?conversationID=C2C' + this.userInfo.id,
      });
    },
    // 删除好友
    delFriend(id) {
      uni.showModal({
        title: '提示',
        content: '确定删除好友',
        success:   (res) =>{
          if (res.confirm) {
            console.log('用户点击确定');
            console.log(id);
            let promise = uni.$TUIKit.deleteFriend({
              userIDList: [id],
              type: this.TIM.TYPES.SNS_DELETE_TYPE_BOTH,
            });
            promise
              .then(imResponse => {
                const { successUserIDList, failureUserIDList } = imResponse.data;
                console.log(successUserIDList);
                // 删除成功的 userIDList
                successUserIDList.forEach(item => {
                  const { userID } = item;
                });
                this.add = true;
                // 删除失败的 userIDList
                failureUserIDList.forEach(item => {
                  const { userID, code, message } = item;
                });
                // 如果好友列表有变化，则 SDK 会触发 TIM.EVENT.FRIEND_LIST_UPDATED 事件
                let onFriendListUpdated = function (event) {
                  console.log(event.data);
                };
                uni.navigateBack({
                  delta: 2,
                });
                uni.$TUIKit.on(this.TIM.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated);
              })
              .catch(function (imError) {
                console.warn('removeFromFriendList error:', imError);
              });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 加入黑名单
    join(id) {
      uni.showModal({
        title: '提示',
        content: '确定是否加入黑名单',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            console.log(id);
            let promise = uni.$TUIKit.addToBlacklist({
              userIDList: [id],
            }); // 请注意：即使只添加一个用户帐号到黑名单，也需要用数组类型，例如：userIDList: ['user1']
            promise
              .then(imResponse => {
                this.isShow = false;
                console.log(imResponse.data); // 成功添加到黑名单的账号信息，结构为包含用户 userID 的数组 - [userID]
              })
              .catch(function (imError) {
                console.warn('addToBlacklist error:', imError); // 添加用户到黑名单列表失败的相关信息
              });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    remove(id) {
      uni.showModal({
        title: '提示',
        content: '确定是否移除黑名单',
        success: res => {
          if (res.confirm) {
            let promise = uni.$TUIKit.removeFromBlacklist({
              userIDList: [id],
            }); // 请注意：即使只从黑名单中移除一个用户帐号，也需要用数组类型，例如：userIDList: ['user1']
            promise
              .then(imResponse => {
                this.isShow = true;
                console.log(imResponse.data); // 从黑名单中成功移除的账号列表，结构为包含用户 userID 的数组 - [userID]
              })
              .catch(function (imError) {
                console.warn('removeFromBlacklist error:', imError); // 将用户从黑名单中移除失败的相关信息
              });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 获取个人ID
    getPer() {
      let promise = uni.$TUIKit.getMyProfile();
      promise
        .then(imResponse => {
          this.own = imResponse.data.userID;
        })
        .catch(function (imError) {
          console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
        });
    },
  },
};
</script>

<style scoped>
.add-url {
  display: flex;
}
.add-url text {
  line-height: 120rpx;
  text-align: center;
  margin-left: 20rpx;
}
.add-input {
  background: #f4f5f9;
  padding: 8px 12px;
  border-radius: 10px;
}
.test {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}
.test text {
  width: 34%;
  line-height: 80rpx;
  text-align: right;
  margin-right: 16rpx;
}
.contain {
  width: 100%;
  height: 100%;
}

.view {
  height: 358rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-image-text {
  display: flex;
  height: 189rpx;
  justify-content: left;
  align-items: center;
  background: #ffffff;
  z-index: 1;
  padding: 0 40rpx;
}

.image-radius {
  height: 120rpx;
  width: 120rpx;
  border-radius: 50%;
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
  border-bottom: 1px solid #eef0f3;
}

.list-name {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 24px;
  margin: 0 50rpx;
}

.text-container {
  padding-top: 40rpx;
}

.hasname {
  margin-left: 20rpx;
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

.one {
  justify-content: space-between;
}

.one .api {
  margin-right: 40rpx;
}

.icon {
  margin-right: 20rpx;
}

.aside-right {
  float: right;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #999999;
  letter-spacing: 0;
  text-align: right;
  line-height: 56px;
  padding-right: 36px;
  z-index: 999;
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
  top: 0;
  /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));
  /*  #endif  */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}

.add-frien {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0;
  /*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));
  /*  #endif  */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}

.popup-main {
  width: 100vw;
  background: #ffffff;
  padding: 20px 20px;
  height: 400rpx;
}
.add-main {
  width: 100vw;
  background: #ffffff;
  padding: 20px 20px;
  height: 450rpx;
}
.popup-main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0;
  line-height: 36px;
  margin-bottom: 10rpx;
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

.del {
  color: #dd524d;
}
</style>
