<template>
  <view>
    <view class="box" v-if="friendApplicationList.length > 0">
      <view v-for="(item, index) in friendApplicationList" :key="index">
        <view class="list">
          <view class="list-left">
            <image class="list-URL" :src="item.avatar"></image>
            <view class="list-name">
              <text class="friend-name">{{ item.userID }}</text>
              <text class="request-name">请求添加好友（{{ item.wording }}）</text>
            </view>
          </view>
          <view class="list-right">
            <view class="butt">
              <u-button text="同意" class="agree" @tap="agreeApplication(item.userID)"></u-button>
              <u-button text="拒绝" class="refuse" @tap="refuseApplication(item.userID)"></u-button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-empty v-else text="暂无好友申请" marginTop="50%" icon="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/moreImg.png"></u-empty>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 页面初始信息
      friendApplicationList: '',
    };
  },
  onLoad() {
    let promise = uni.$TUIKit.getFriendApplicationList();
    promise
      .then(imResponse => {
        // friendApplicationList - 好友申请列表 - [FriendApplication]
        // unreadCount - 好友申请的未读数
        this.friendApplicationList = imResponse.data.friendApplicationList;
        console.log(this.friendApplicationList);
      })
      .catch(function (imError) {
        console.warn('getFriendApplicationList error:', imError); // 获取好友申请列表失败的相关信息
      });
  },
  methods: {
    agreeApplication(value) {
      console.log(value);
      let promise = uni.$TUIKit.acceptFriendApplication({
        userID: value,
        // remark: '客服小亮',
        type: this.TIM.TYPES.SNS_APPLICATION_AGREE_AND_ADD,
      });
      promise
        .then(function (imResponse) {
          // 同意好友成功后，SDK 会触发 TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED 事件
          uni.navigateBack({
            delta: 1,
          });
        })
        .catch(function (imError) {
          console.warn('acceptFriendApplication error:', imError);
        });
    },
    refuseApplication(value) {
      console.log(value);
      let promise = uni.$TUIKit.refuseFriendApplication({
        userID: value,
      });
      promise
        .then(function (imResponse) {
          // 拒绝成功后，SDK 会触发 TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED 事件
          console.log('拒绝成功！！！');
        })
        .catch(function (imError) {
          console.warn('refuseFriendApplication error:', imError);
        });
    },
  },
};
</script>

<style scoped>
.box {
  width: 100%;
}

.list {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.list-left {
  display: flex;
}

.list-name {
  max-width: 70%;
  flex: 1;
}

.list-name text {
  display: block;
}

.friend-name {
  line-height: 26px;
  font-size: 16px;
  font-family: 'PingFangSC-Regular';
  color: #333333;
}

.request-name {
  line-height: 20px;
  font-size: 12px;
  font-family: 'PingFangSC-Regular';
  color: #999999;
  max-width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-URL {
  padding-left: 12px;
  padding-right: 12px;
  align-items: center;
  display: inline-block;
  width: 48px;
  height: 48px;
  margin-right: 5px;
}

.list-right {
  width: 100%;
  height: 56px;
  position: absolute;
  display: flex;
  justify-content: flex-end;
}

.butt {
  display: flex;
  margin: 0 10px;
}

.agree {
  width: 48px;
  height: 30px;
  margin-right: 20px;
}

.refuse {
  width: 48px;
  height: 30px;
}
</style>
