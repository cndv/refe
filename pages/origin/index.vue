<template>
  <view class="container">
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <!-- <custom-nav-bar title="首页1111"></custom-nav-bar> -->
    <tn-nav-bar :isBack="false" title="" fixed>转诊列表</tn-nav-bar>
    <tn-tabs
      v-model="activeTab"
      :list="tabs"
      :isScroll="true"
      :current="current"
      name="name"
      @change="change"
      color="#007AFF"
    ></tn-tabs>
    <view class="referral-list">
      <view
        class="referral-card"
        v-for="referral in referrals"
        :key="referral.id"
      >
        <view class="info" @click="viewDetail(referral.id)">
          <view class="top">
            <view class="left">
              <tn-tag fontColor="#080808" padding="0" width="auto">上转</tn-tag>
              <view>
                {{ referral.patient_name }}
                {{ referral.patient_gender_data_text }}
                {{ referral.patient_age }}岁
              </view>
            </view>
            <view class="right">
              <view class="status" :class="referral.referral_status_data">{{
                referral.referral_status_data_text
              }}</view>
            </view>
          </view>
          <view class="middle"
            >转入机构：{{ referral.target_hospital_name }}</view
          >
          <view class="bottom">申请时间：{{ referral.apply_time }}</view>
        </view>
        <view class="actions">
          <tn-button
            type="default"
            backgroundColor="tn-bg-blue"
            class="action-button"
            :plain="true"
            width="180rpx"
            height="60rpx"
            >取消</tn-button
          >
          <tn-button
            type="default"
            backgroundColor="tn-bg-blue"
            class="action-button"
            :plain="true"
            width="180rpx"
            height="60rpx"
            >补充资料</tn-button
          >
          <tn-button
            type="primary"
            backgroundColor="tn-bg-blue"
            class="action-button"
            width="180rpx"
            height="60rpx"
            >转诊交流</tn-button
          >
        </view>
      </view>
    </view>
    <view :style="{ height: bottomBarHeight + 'px' }" class="status-bar"></view>
    <OriginTabBar :currentIndex="currentIndex" @change="switchTabbar" />
  </view>
</template>

<script>
import { ApiReferralLis } from "../../common/api";
import OriginTabBar from "@/components/TabBar/OriginTabBar.vue";
export default {
  components: {
    OriginTabBar,
  },
  data() {
    return {
      activeTab: 0,
      current: 0,
      activeTabbar: 1,
      bottomBarHeight: 0,
      statusBarHeight: 0,
      status: null,
      tabs: [
        { name: "全部", searchName: "" },
        { name: "待审核", searchName: "Pending" },
        { name: "转诊中", searchName: "Accepted" },
        { name: "已完成", searchName: "Completed" },
        { name: "已拒绝", searchName: "Rejected" },
        { name: "已取消", searchName: "Cancelled" },
      ],
      // tabbar当前被选中的序号
      currentIndex: 1,
      // 自定义底栏对应页面的加载情况
      tabberPageLoadFlag: [],
      referrals: [],
    };
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.bottomBarHeight = res.safeAreaInsets.bottom;
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
    this.ApiReferralLis();
  },
  methods: {
    // 跳转详情
    viewDetail(id) {
      uni.navigateTo({
        url: "/pages/target/detail?id=" + id,
      });
    },

    async ApiReferralLis() {
      // 获取转诊列表
      const res = await ApiReferralLis({ status: this.status });
      console.log("ApiReferralLis", res.data.data);
      this.referrals = res.data.data;
    },
    change(index) {
      console.log("change", index);
      this.current = index;
      this.status = this.tabs[index].searchName;
      this.ApiReferralLis(this.status);
    },
    switchTabbar(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style scoped>
.container {
  padding-bottom: var(--bottom-bar-height);
}
.referral-list {
  padding: 20rpx;
}
.referral-card {
  background-color: #ffffff;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.status {
  padding: 10rpx 10rpx;
  width: 120rpx;
  border-radius: 10rpx;
  text-align: center;
  /* color: #ffffff; */
  background-color: #f0f0f0;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  border: 1px solid #f0f0f0;
}
.status.Pending {
  border-color: #ffa500;
  color: #ffa500;
}
.status.Rejected {
  border-color: #ff4500;
  color: #ff4500;
}
.status.InProgress {
  border-color: #1e90ff;
  color: #1e90ff;
}
.status.Completed {
  border-color: #32cd32;
  color: #32cd32;
}
.status.Cancelled {
  border-color: #808080;
  color: #808080;
}
.status.InHandle {
  border-color: #1e90ff;
  color: #1e90ff;
}
.status.Accepted {
  border-color: #32cd32;
  color: #32cd32;
}
.info {
  margin-top: 10rpx;
}
.info .top {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
}
.info .middle {
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #333333;
}
.info .bottom {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #666666;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}
.action-button {
  margin-left: 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 28rpx;
  border-radius: 30rpx;
}
.cancel-button {
  background-color: #f0f0f0;
  color: #333333;
}
.supplement-button {
  background-color: #f0f0f0;
  color: #333333;
}
.communicate-button {
  background-color: #007aff;
  color: #ffffff;
}
</style>

<style>
:root {
  --bottom-bar-height: 80px; /* 默认值 */
}

@media (min-width: 320px) and (max-width: 480px) {
  :root {
    --bottom-bar-height: calc(
      env(safe-area-inset-bottom) + 20px
    ); /* 使用环境变量 */
  }
}
</style>
