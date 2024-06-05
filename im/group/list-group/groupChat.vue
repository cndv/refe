<template>
  <view>
    <view class="box">
      <view v-if="groupList.length > 0">
        <u-swipe-action>
          <u-swipe-action-item :threshold="60" :options="options1" v-for="(item, index) in groupList" :key="index" @click="del(item.groupID)" :autoClose="true">
            <view class="swipe-action u-border-top u-border-bottom" @tap="handleRoute(item.groupID)">
              <view class="swipe-action__content">
                <view class="list">
                  <view class="list-left">
                    <image class="list-URL" :src="item.avatar"></image>
                    <view class="list-name">
                      <text class="friend-name">{{ item.name }}</text>
                      <text class="request-name">{{ item.lastMessage.messageForShow }}</text>
                    </view>
                  </view>
                  <view class="list-right">
                    <text>{{ item.lastMessage.lastTime }}</text>
                  </view>
                </view>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
      <u-empty v-else text="暂无群聊" marginTop="50%" icon="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/moreImg.png"></u-empty>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      // 页面初始信息
      groupList: '',
      options1: [
        {
          text: '删除',
          style: {
            backgroundColor: '#f56c6c',
          },
        },
      ],
      ownID: '',
    };
  },
  onLoad() {
    this.mess();
    this.getPer();
  },
  methods: {
    // 删除群聊
    del(groupID) {
      let promise = uni.$TUIKit.getGroupProfile({
        groupID: groupID,
        groupCustomFieldFilter: ['key1', 'key2'],
      });
      promise
        .then(imResponse => {
          console.log(imResponse.data.group);
          const groupInformation = imResponse.data.group;
          if (this.ownID === groupInformation.ownerID) {
            console.log('群主');
            uni.showModal({
              title: '提示',
              content: '确定删除群聊？',
              success: res => {
                if (res.confirm) {
                  uni.showModal({
                    title: '提示',
                    content: '您是群主，删除失败',
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              },
            });
          } else {
            console.log('成员');
            uni.showModal({
              title: '提示',
              content: '确定退出群聊？',
              success: res => {
                if (res.confirm) {
                  let promise = uni.$TUIKit.quitGroup(groupID);
                  promise
                    .then(function (imResponse) {
                      console.log(imResponse.data.groupID); // 退出成功的群 ID
                      uni.showModal({
                        title: '提示',
                        content: '成功退出',
                        success: res => {
                          if (res.confirm) {
                            console.log('用户点击确定');
                            uni.navigateBack({
                              delta: 1,
                            });
                          } else if (res.cancel) {
                            console.log('用户点击取消');
                          }
                        },
                      });
                    })
                    .catch(function (imError) {
                      console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
                    });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              },
            });
          }
        })
        .catch(function (imError) {
          console.warn('getGroupProfile error:', imError); // 获取群详细资料失败的相关信息
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
    // 最后一条消息时间
    mess() {
      let promise = uni.$TUIKit.getGroupList();
      promise
        .then(imResponse => {
          console.log(imResponse.data.groupList); // 群组列表
          const groupList = imResponse.data.groupList;
          const findValueByname = groupList.map(item => {
            if (item.avatar === 'FaceUrl') {
              return item.avatar;
            }
          });
          for (var j = 0; j < findValueByname.length; j++) {
            if (findValueByname[j] === 'FaceUrl') {
              console.log(j);
              console.log(groupList[j]);
              groupList[j].avatar = 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/gruopavatar.png';
            }
          }
          console.log(findValueByname);
          for (var i = 0; i < groupList.length; i++) {
            var time = groupList[i].lastMessage.lastTime;
            var now = Math.round(new Date().getTime() / 1000).toString();
            var ms = now - time;
            var s = Math.floor(ms);
            var m = Math.floor(ms / 60);
            var h = Math.floor(ms / (60 * 60));
            var day = Math.floor(ms / (24 * 60 * 60));
            if (day > 14) {
              groupList[i].lastMessage.lastTime = '';
            } else {
              if (day < 10) {
                groupList[i].lastMessage.lastTime = day + '天前';
                if (h < 24) {
                  groupList[i].lastMessage.lastTime = h + '小时前';
                  if (m < 60) {
                    groupList[i].lastMessage.lastTime = Math.floor(ms / 60) + '分钟前';
                    if (s < 60) {
                      groupList[i].lastMessage.lastTime = '刚刚';
                    }
                  }
                }
              }
            }
          }
          this.groupList = groupList;
        })
        .catch(function (imError) {
          console.warn('getGroupList error:', imError); // 获取群组列表失败的相关信息
        });
    },
    handleRoute(id) {
      const GROUP = 'GROUP' + id;
      uni.navigateTo({
        url: `/im/chat/chat?conversationID=${GROUP}`,
      });
    },
  },
};
</script>
<style scoped>
.box {
  width: 100%;
  border-top: 1px solid #eef0f3;
}

.list {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 24px;
  padding: 20rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
}

.list-left {
  display: flex;
}

.list-name {
  max-width: 70%;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  align-items: center;
  display: inline-block;
  width: 48px;
  height: 48px;
  margin-right: 15px;
  border-radius: 10rpx;
}

.list-right {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: flex-end;
  line-height: 56px;
  font-size: 12px;
  color: #999999;
  padding-right: 15px;
}
</style>
