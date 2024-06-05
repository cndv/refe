<template>
  <view class="container">
    <tn-nav-bar title="转诊申请" :beforeBack="beforeBack" leftArrow fixed>
      消息通知
    </tn-nav-bar>
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <scroll-view
      class="scroll-view"
      scroll-y
      @scrolltolower="loadMore"
      :lower-threshold="50"
    >
      <uni-list>
        <uni-list-chat
          v-for="(item, index) in messages"
          :avatar-circle="true"
          :avatar="item.avatar"
          :key="index"
          :title="item.referral_status_data_text"
          :note="
            '发起人：' +
            item.origin_user_text +
            ' 审核人：' +
            item.target_user_text
          "
          ><view class="chat-custom-right">
            <text class="chat-custom-text" style="height: 15px">{{
              item.createtime
            }}</text>
          </view></uni-list-chat
        >
      </uni-list>
      <view class="loading-more" v-if="loadingMore">
        <tn-loading mode="circle" show></tn-loading>
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { ApiReferralNotice } from "@/common/api";
export default {
  data() {
    return {
      statusBarHeight: 0,
      messages: [],
      page: 1,
      pageSize: 20,
      loading: false,
      loadingMore: false,
    };
  },
  onLoad() {
    this.loadMore();
  },
  mounted() {
    // 获取底部导航栏高度
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
  },
  methods: {
    loadMore() {
      if (this.loading) return;
      this.loading = true;
      this.loadingMore = true;
      // 通过api接口请求数据
      ApiReferralNotice().then((res) => {
        this.messages = res.data;
        this.loading = false;
        this.loadingMore = false;
      });
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.scroll-view {
  flex: 1;
  height: 90vh;
  margin-top: 10rpx;
}
.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}
.chat-custom-right {
  /* flex: 1; */
  height: 10px;
  /* width: 20px; */

  display: flex;

  flex-direction: column;
  justify-content: space-start;
  /* align-items: flex-end; */
}
.chat-custom-text {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #999;
}
</style>
