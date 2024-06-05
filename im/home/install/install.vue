<template>
  <view class="box">
    <view class="list">
      <view class="list-name">
        <text>好友申请</text>
      </view>
      <view class="ckeck">
        <radio-group @change="checked" class="radio-group">
          <label v-for="item in radioGroup" :key="item" class="item">
            <radio class="radio" :value="item" :checked="item == activeRadio" />
            <text>{{ item }}</text>
          </label>
        </radio-group>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      info: '',
      activeRadio: '', //存的是选中的value值
      radioGroup: ['允许直接加为好友', '需要验证', '不允许任何人添加好友'],
    };
  },
  onLoad() {
    let promise = uni.$TUIKit.getMyProfile();
    promise
      .then(imResponse => {
        console.log(imResponse.data); // 个人资料 - Profile 实例
        this.info = imResponse.data;
        if (this.info.allowType === 'AllowType_Type_AllowAny') {
          this.activeRadio = '允许直接加为好友';
        }
        if (this.info.allowType === 'AllowType_Type_NeedConfirm') {
          this.activeRadio = '需要验证';
        }
        if (this.info.allowType === 'AllowType_Type_DenyAny') {
          this.activeRadio = '不允许任何人添加好友';
        }
      })
      .catch(function (imError) {
        console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
      });
  },
  methods: {
    checked(e) {
      this.activeRadio = e.detail.value;
      console.log(this.activeRadio);
      if (e.detail.value === '允许直接加为好友') {
        // 修改个人标配资料
        let promise = uni.$TUIKit.updateMyProfile({
          allowType: this.TIM.TYPES.ALLOW_TYPE_ALLOW_ANY,
        });
        promise
          .then(imResponse => {
            this.info = imResponse.data; // 更新资料成功
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      } else if (e.detail.value === '需要验证') {
        // 修改个人标配资料
        let promise = uni.$TUIKit.updateMyProfile({
          allowType: this.TIM.TYPES.ALLOW_TYPE_NEED_CONFIRM,
        });
        promise
          .then(imResponse => {
            this.info = imResponse.data; // 更新资料成功
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      } else if (e.detail.value === '不允许任何人添加好友') {
        // 修改个人标配资料
        let promise = uni.$TUIKit.updateMyProfile({
          allowType: this.TIM.TYPES.ALLOW_TYPE_DENY_ANY,
        });
        promise
          .then(imResponse => {
            this.info = imResponse.data; // 更新资料成功
          })
          .catch(function (imError) {
            console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
          });
      }
    },
  },
};
</script>

<style scoped>
.box {
  width: 100%;
  border-top: 1px solid #eef0f3;
}
.radio-group {
}
.item {
  display: flex;
  margin-bottom: 10rpx;
}

.list {
  display: flex;
  background-color: white;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  border-bottom: 1px solid #eef0f3;
  padding: 10px;
}

.list-name {
  width: 40%;
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
}
</style>
