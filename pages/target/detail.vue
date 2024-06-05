<template>
  <view class="container">
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <tn-nav-bar title="转诊详情" fixed>转诊详情</tn-nav-bar>
    <tn-tabs
      v-model="activeTab"
      :list="tabs"
      :isScroll="true"
      :current="current"
      name="name"
      @change="changeTab"
      color="#007AFF"
      :top="0"
    ></tn-tabs>

    <!-- 患者信息 -->
    <view v-if="activeTab === 0" class="patient-info">
      <scroll-view class="content" scroll-y>
        <view class="patient-info">
          <tn-avatar
            size="xl"
            fontSize="32"
            backgroundColor="#01BEFF"
            :text="referral.patient_name"
          ></tn-avatar>
          <view class="view_info">
            <view class="info">
              <view class="name">{{ referral.patient_name }}</view>
              <view class="tag" :class="referral.referral_status_data">{{
                referral.referral_status_data_text
              }}</view>
            </view>
            <view class="details">
              <view
                >{{ referral.patient_gender_data_text
                }}{{ referral.patient_age }}岁
                {{ referral.patient_phone }}</view
              >
            </view>
          </view>
        </view>
        <view class="additional-info">
          <view>转诊编号：{{ referral.coded }}</view>
          <view>联系人：{{ referral.patient_contacts }}</view>
        </view>
        <view class="medical-info">
          <view class="section-title">病历信息</view>
          <view class="info-item">
            <view class="label">主要诊断：</view>
            <view class="value">{{ referral.referral_diagnosis }}</view>
          </view>

          <view class="info-item">
            <view class="label">病情等级：</view>
            <tn-tag type="warning" backgroundColor="tn-bg-blue">{{
              referral.referral_urgency_data_text
            }}</tn-tag>
          </view>
          <view class="info-item">
            <view class="label">病情概述：</view>
            <view class="value">
              {{ referral.referral_disease_desc }}
            </view>
          </view>
          <view class="info-item">
            <view class="label">治疗过程：</view>
            <view class="value">
              {{ referral.referral_treatment_process }}
            </view>
          </view>
          <view class="info-item">
            <view class="label">转诊目的：</view>
            <view class="value">
              {{ referral.referral_reason }}
            </view>
          </view>
        </view>
        <view class="reports">
          <view class="section-title">检查报告</view>
          <view class="report-grid">
            <image
              class="report-image"
              v-for="(img, index) in inspection_report_images"
              :key="index"
              :src="img"
            ></image>
          </view>
          <!-- <view class="more-button">
            <tn-button type="default" size="small">更多</tn-button>
          </view> -->
        </view>
        <view class="reports">
          <view class="section-title">检验报告</view>
          <view class="report-grid">
            <image
              class="report-image"
              v-for="(img, index) in inspectd_report_images"
              :key="index"
              :src="img"
            ></image>
          </view>
        </view>
        <view class="reports">
          <view class="section-title">其他</view>
          <view class="report-grid">
            <image
              class="report-image"
              v-for="(img, index) in additional_images"
              :key="index"
              :src="img"
            ></image>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 转诊流程 -->
    <view v-if="activeTab === 1" class="referral-process">
      <view class="timeline">
        <tn-steps
          :list="steps_list"
          direction="column"
          icon="dotIcon"
          :current="steps"
        ></tn-steps>
        <!-- <view class="item" v-for="step in steps" :key="step.time">
          <view class="time">{{ step.time }}</view>
          <view class="description">{{ step.description }}</view>
        </view> -->
      </view>
    </view>

    <!-- 转诊交流记录 -->
    <view v-if="activeTab === 2" class="communication-record">
      <view class="record" v-for="record in records" :key="record.time">
        <view class="time">{{ record.time }}</view>
        <view class="sender">{{ record.sender }}</view>
        <view class="message">{{ record.message }}</view>
      </view>
    </view>

    <!-- 床位预约信息 -->
    <view v-if="activeTab === 3" class="bed-info">
      <view v-if="bedInfo" class="bed_info_box">
        <view class="item">
          <view class="label">预约科室：</view>
          <view class="value">{{ bedInfo.department }}</view>
        </view>
        <view class="item">
          <view class="label">预约床位：</view>
          <view class="value">{{ bedInfo.bed }}</view>
        </view>
        <view class="item">
          <view class="label">入住时间：</view>
          <view class="value">{{ bedInfo.checkinTime }}</view>
        </view>
        <view class="item">
          <view class="label">联系人：</view>
          <view class="value">{{ bedInfo.contact }}</view>
        </view>
        <view class="item">
          <view class="label">联系方式：</view>
          <view class="value">{{ bedInfo.contactInfo }}</view>
        </view>
      </view>
      <view v-else class="empty">
        <image src="/static/images/empty.png" class="empty-image"></image>
        <view class="empty-text">暂无内容</view>
      </view>
    </view>
  </view>
</template>

<script>
import { ApiReferralDetail, ApiReferralFlow } from "@/common/api";
export default {
  data() {
    return {
      id: "",
      activeTab: 0,
      statusBarHeight: 0,
      current: 0,
      referral: {},
      tabs: [
        { name: "患者信息" },
        { name: "转诊流程" },
        { name: "转诊交流记录" },
        { name: "床位预约信息" },
      ],
      steps: [],
      records: [
        {
          time: "8.22 13:00",
          sender: "张医生",
          message: "收到病人的病历资料。",
        },
        {
          time: "8.22 13:04",
          sender: "张护士",
          message: "病历资料已审核通过。",
        },
        {
          time: "8.22 13:44",
          sender: "阿里医生",
          message: "请将病人转诊到我们科室。",
        },
      ],
      bedInfo: {
        department: "胸外科",
        bed: "中南大学湘雅三院的胸外科住院大楼3楼301",
        checkinTime: "2024/09/09 12:00",
        contact: "王医生",
        contactInfo: "13378878898",
      },
    };
  },
  computed: {
    inspection_report_images() {
      // 将字符串拆分为数组
      // 判断是否为空 是否有,号
      if (!this.referral.inspection_report_images) {
        return [];
      }
      if (this.referral.inspection_report_images.indexOf(",") === -1) {
        return [this.referral.inspection_report_images];
      }
      return this.referral.inspection_report_images.split(",");
    },
    inspectd_report_images() {
      if (!this.referral.inspectd_report_images) {
        return [];
      }
      if (this.referral.inspectd_report_images.indexOf(",") === -1) {
        return [this.referral.inspectd_report_images];
      }
      return this.referral.inspectd_report_images.split(",");
    },
    additional_images() {
      if (!this.referral.additional_images) {
        return [];
      }
      if (this.referral.additional_images.indexOf(",") === -1) {
        return [this.referral.additional_images];
      }
      return this.referral.additional_images.split(",");
    },
    steps_list() {
      return this.steps.map((step) => {
        return {
          name: "\t" + step.referral_status_data_text + "\n" + step.createtime,
          description: step.time,
        };
      });
    },
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.bottomBarHeight = res.safeAreaInsets.bottom;
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
  },
  methods: {
    // 获取转诊详情
    async getReferralDetail(id) {
      const res = await ApiReferralDetail(id);
      console.log("ApiReferralDetail", res.data);
      this.referral = res.data;
    },

    async getReferralFlow(id) {
      const res = await ApiReferralFlow(id);
      console.log("ApiReferralFlow", res.data);
      this.steps = res.data;
    },

    changeTab(index) {
      console.log("changeTab", index);
      this.current = index;
      this.activeTab = index;
      if (index === 1) {
        this.getReferralFlow(this.id);
      }
    },
  },
  // 页面加载时获取数据
  onLoad(options) {
    if (options && options.id) {
      this.id = options.id;
      this.getReferralDetail(this.id);
    } else {
      uni.showToast({
        title: "参数错误",
        icon: "none",
      });
    }

    // 获取底部tabbar高度
    uni.getSystemInfo({
      success: (res) => {
        this.bottomBarHeight = res.safeAreaInsets.bottom;
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
  },
};
</script>

<style scoped>
.container {
  padding-bottom: var(--bottom-bar-height);
}
.status-bar {
  width: 100%;
  background-color: #ffffff;
}
.patient-info .header {
  display: flex;
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}
.content {
  flex: 1;
  padding: 20rpx;
  background-color: #ffffff;
}
.patient-info {
  display: flex;
  padding: 20rpx;
  background-color: #eeeeee;
  border-radius: 8rpx;
}
.view_info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 20rpx;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 80%;
  margin-left: 20rpx;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
}
.tag {
  color: #ffffff;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  display: inline-block;
  margin-left: 20rpx;
}
.tag.Pending {
  background-color: #ffa500;
}
.tag.Rejected {
  background-color: #ff4500;
}
.tag.InProgress {
  background-color: #1e90ff;
}
.tag.Completed {
  background-color: #32cd32;
}
.tag.Cancelled {
  background-color: #808080;
}
.tag.InHandle {
  background-color: #1e90ff;
}
.tag.Accepted {
  background-color: #32cd32;
}
.details {
  font-size: 28rpx;
  color: #666666;
  margin-left: 20rpx;
}
.additional-info {
  height: 110rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333333;
  padding: 0 20rpx;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  background-color: #eeeeee;
}
.medical-info {
  background-color: #eeeeee;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  /* margin-bottom: 10rpx; */
  margin-bottom: 30rpx;
}
.info-item {
  display: flex;
  margin-bottom: 15rpx;
}
.label {
  font-size: 28rpx;
  color: #333333;
  width: 200rpx;
  flex-shrink: 0;
}
.value {
  font-size: 28rpx;
  color: #666666;
  flex: 1;
}
.reports {
  background-color: #eeeeee;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.report-grid {
  display: flex;
  flex-wrap: wrap;
}
.report-image {
  width: 140rpx;
  height: 140rpx;
  margin: 10rpx;
  background-color: #e0e0e0;
}
.more-button {
  text-align: center;
  margin-top: 10rpx;
}
.referral-process .timeline {
  padding: 20rpx;
  background-color: #ffffff;
}
.timeline .item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
  padding: 30rpx;
}
.time {
  font-size: 28rpx;
  color: #666666;
}
.description {
  font-size: 28rpx;
  color: #333333;
  margin-top: 10rpx;
}
.communication-record .record {
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}
.sender {
  font-size: 28rpx;
  font-weight: bold;
}
.message {
  font-size: 28rpx;
  color: #333333;
  margin-top: 10rpx;
}
.bed-info .empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}
.empty-image {
  width: 200rpx;
  height: 200rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
}
.bed_info_box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 80%;
  margin-left: 20rpx;
}
.bed-info .bed_info_box .item {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}
.bed-info .bed_info_box .label {
  width: 200rpx;
  font-size: 28rpx;
  color: #666666;
}
.bed-info .infbed_info_boxo .value {
  font-size: 28rpx;
  color: #333333;
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
