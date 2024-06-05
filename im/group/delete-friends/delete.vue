<template>
  <view class="box">
    <view class="search">
      <view class="search-bar">
        <image class="pic" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/serach-icon.svg"></image>
        <input class="inp" :value="userID" placeholder="请输入用户ID" @input="userIDInput" @confirm="getuserProfile" @blur="getuserProfile" @click="point" />
      </view>
    </view>
    <view class="uni-list">
      <checkbox-group @change="checkboxChange">
        <label class="list" v-for="item in memberList">
          <view class="check">
            <checkbox class="check-bok" :value="item.userID" :checked="item.checked" />
          </view>
          <view class="friend">
            <image class="friend-avatar" :src="item.avatar || head"></image>
            <view>
              <view class="friend-nick">{{ item.nick }}</view>
              <view class="friend-userID">用户ID：{{ item.userID }}</view>
            </view>
          </view>
        </label>
      </checkbox-group>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userID: '',
      memberList: '',
      seldata: [],
      groupID: '',
      ownID: '',
      head: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png',
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.getPer();
    this.getGroupMemberList(option);
    console.log(option);
    this.groupID = option.groupID;
  },

  methods: {
    point() {
      this.setData({
        memberList: '',
      });
    },
    // 选择框
    checkboxChange: function (e) {
      console.log(this.memberList, '12');
      var memberList = this.memberList;
      var values = e.detail.value;
      console.log(values);
      console.log(memberList);
      this.seldata = values;
    },
    // 获取群成员列表
    getGroupMemberList(option) {
      let promise = uni.$TUIKit.getGroupMemberList({ groupID: option.groupID, count: 300, offset: 0 }); // 从0开始拉取30个群成员
      promise
        .then(imResponse => {
          console.log(imResponse.data.memberList.shift()); // 群成员列表
          this.memberList = imResponse.data.memberList;
        })
        .catch(function (imError) {
          console.warn('getGroupMemberList error:', imError);
        });
    },
    // 点击右上角确定按钮
    onNavigationBarButtonTap: function (e) {
      console.log(e.text); //提交
      console.log(e.fontSize); //16px
      uni.showModal({
        title: '提示',
        content: '确定删除成员？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            let promise = uni.$TUIKit.deleteGroupMember({ groupID: this.groupID, userIDList: this.seldata, reason: '你违规了，我要踢你！' });
            promise
              .then(imResponse => {
                console.log(imResponse.data.group); // 删除后的群组信息
                console.log(imResponse.data.userIDList); // 被删除的群成员的 userID 列表
                uni.navigateBack({
                  delta: 2,
                });
              })
              .catch(function (imError) {
                console.warn('deleteGroupMember error:', imError); // 错误信息
              });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    //获取个人ID
    getPer() {
      let promise = uni.$TUIKit.getMyProfile();
      promise
        .then(imResponse => {
          this.ownID = imResponse.data.userID;
          console.log(imResponse.data.userID);
        })
        .catch(function (imError) {
          console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
        });
    },
    userIDInput(e) {
      console.log(e.detail.value);
      this.userID = e.detail.value;
    },

    getuserProfile() {
      uni.$TUIKit
        .getUserProfile({
          userIDList: [this.userID],
        })
        .then(imRes => {
          if (imRes.data.length > 0) {
            console.log(imRes.data);
            this.memberList = imRes.data;
          } else {
            uni.showToast({
              title: '用户不存在',
              icon: 'error',
            });
            this.userID = '';
          }
        });
    },
  },
};
</script>
<style scoped>
.box {
  width: 100vw;
  height: 100vh;
  background-color: #f4f5f9;
}

.search {
  width: 100%;
  padding: 20rpx 0;
}

.search-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 40rpx;
  width: 670rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

.pic {
  display: inline-block;
  margin-left: 24rpx;
  width: 48rpx;
  height: 48rpx;
}

.inp {
  margin-left: 16rpx;
  line-height: 40rpx;
  font-size: 28rpx;
  width: 100%;
  display: inline-block;
}

.list {
  display: flex;
  flex-wrap: nowrap;
  width: 750rpx;
  height: 150rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #eef0f3;
}
.check {
  height: 150rpx;
  line-height: 150rpx;
  margin: 0 20rpx;
}
.choose {
  margin-left: 40rpx;
  margin-right: 40rpx;
  margin-top: 52rpx;
  margin-bottom: 50rpx;
  width: 48rpx;
  height: 48rpx;
}

.friend {
  width: 622rpx;
  display: flex;

  align-items: center;
}

.friend-avatar {
  width: 96rpx;
  height: 96rpx;
  margin-right: 24rpx;
}

.friend-nick {
  color: #333333;
  line-height: 50rpx;
  font-size: 36rpx;
  margin-bottom: 4rpx;
}

.friend-userID {
  color: #999999;
  line-height: 40rpx;
  font-size: 28rpx;
}
</style>
