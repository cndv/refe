<template>
  <view class="container">
    <!-- <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view> -->
    <tn-nav-bar title="转诊申请" :beforeBack="beforeBack" leftArrow fixed>
      转诊申请
    </tn-nav-bar>
    <view :style="{ height: statusBarHeight + 'px' }" class="status-bar"></view>
    <!-- 调整scroll-view高度以容纳内容和底部按钮 -->
    <view class="submit-button-container">
      <tn-button
        type="primary"
        size=""
        height="60rpx"
        background-color="#007aff"
        fontColor="#ffffff"
        class="submit-button"
        @click="handleSubmit"
        >提交</tn-button
      >
    </view>
    <scroll-view scroll-y class="form-section">
      <tn-collapse :accordion="false">
        <tn-collapse-item title="患者信息" :open="true" name="1">
          <view class="form-item">
            <text class="required">患者姓名：</text>
            <tn-input
              v-model="form.patient_name"
              placeholder="请输入患者姓名"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <text class="required">性别：</text>
            <tn-radio-group v-model="form.patient_gender_data">
              <tn-radio key="1" name="1">男</tn-radio>
              <tn-radio key="0" name="0">女</tn-radio>
            </tn-radio-group>
          </view>
          <view class="form-item">
            <text class="required">年龄：</text>
            <tn-input
              v-model="form.patient_age"
              type="number"
              placeholder="请输入年龄"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <text>联系方式：</text>
            <tn-input
              v-model="form.patient_phone"
              type="number"
              placeholder="请输入联系方式"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <text>联系人：</text>
            <tn-input
              v-model="form.patient_contacts"
              placeholder="请输入联系人"
              clearable
            ></tn-input>
          </view>
        </tn-collapse-item>
        <tn-collapse-item title="病历信息" :open="true" name="2">
          <view class="form-item">
            <text class="required">主要诊断：</text>
            <tn-input
              v-model="form.referral_diagnosis"
              placeholder="请输入主要诊断"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <text class="required">病情等级：</text>
            <tn-radio-group v-model="form.referral_urgency_data">
              <tn-radio name="1">一般</tn-radio>
              <tn-radio name="2">病重</tn-radio>
              <tn-radio name="3">复杂</tn-radio>
            </tn-radio-group>
          </view>
          <view class="form-item">
            <text>病情描述：</text>
            <tn-input
              type="textarea"
              v-model="form.referral_disease_desc"
              placeholder="请输入病情概述"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <tn-image-upload
              :action="action"
              uploadText="病情描述"
              :header="{ token: token }"
              :fileList="form.referral_disease_desc_images"
              ref="referral_disease_desc_images"
              :toJson="true"
            >
              <tn-button icon="plus">上传</tn-button>
            </tn-image-upload>
          </view>
          <view class="form-item">
            <text>诊疗过程：</text>
            <tn-input
              type="textarea"
              v-model="form.referral_treatment_process"
              placeholder="请输入诊疗过程"
              clearable
            ></tn-input>
          </view>
          <view class="form-item">
            <tn-image-upload
              :action="action"
              uploadText="诊疗过程"
              :header="{ token: token }"
              :fileList="form.referral_treatment_process_images"
              ref="referral_treatment_process_images"
              :toJson="true"
            >
              <tn-button icon="plus">上传</tn-button>
            </tn-image-upload>
          </view>
          <view class="form-item">
            <text class="required">转诊目的：</text>
            <tn-input
              type="textarea"
              v-model="form.referral_reason"
              placeholder="请输入转诊目的"
              clearable
            ></tn-input>
          </view>
        </tn-collapse-item>
        <tn-collapse-item title="上传报告" :open="true" name="3">
          <view class="form-item">
            <text>检查报告：</text>
            <tn-image-upload
              :action="action"
              :header="{ token: token }"
              ref="inspection_report_images"
            >
              <tn-button icon="plus">上传</tn-button>
            </tn-image-upload>
          </view>
          <view class="form-item">
            <text>检验报告：</text>
            <tn-image-upload
              :action="action"
              :header="{ token: token }"
              ref="inspectd_report_images"
            >
              <tn-button icon="plus">上传</tn-button>
            </tn-image-upload>
          </view>
          <view class="form-item">
            <text>其他：</text>
            <tn-image-upload
              :action="action"
              :header="{ token: token }"
              ref="additional_images"
              :toJson="true"
            >
              <tn-button icon="plus">上传</tn-button>
            </tn-image-upload>
          </view>
        </tn-collapse-item>
      </tn-collapse>

      <view
        :style="{ height: bottomBarHeight + 'px' }"
        class="status-bar"
      ></view>
    </scroll-view>
    <tn-modal
      v-model="show"
      title="提交转诊成功"
      content="转诊申请提交成功，等待审核中"
      :button="button"
      :maskCloseable="false"
      @click="inquiry"
    ></tn-modal>
  </view>
</template>

<script>
import config from "@/common/config";
import { ApiReferralApply } from "@/common/api";
export default {
  data() {
    return {
      bottomBarHeight: 0,
      statusBarHeight: 0,
      action: config.baseUrl + "/api/common/upload",
      form: {
        id: "3",
        patient_name: "",
        patient_gender_data: "1",
        patient_age: "",
        patient_phone: "",
        patient_contacts: "",
        referral_diagnosis: "",
        referral_urgency_data: "1",
        referral_disease_desc: "",
        referral_treatment_process: "",
        referral_reason: "",
        referral_disease_desc_images: "",
        referral_treatment_process_images: "",
        inspection_report_images: "",
        inspectd_report_images: "",
        additional_images: "",
      },
      show: false,
      button: [
        {
          text: "查看转诊单",
          backgroundColor: "tn-bg-green",
          fontColor: "#FFFFFF",
          //   plain: true,
          //   shape: "round",
        },
        {
          text: "回首页",
          backgroundColor: "tn-bg-indigo",
          fontColor: "#FFFFFF",
        },
      ],
    };
  },
  mounted() {
    // 获取底部导航栏高度
    uni.getSystemInfo({
      success: (res) => {
        this.bottomBarHeight = res.safeAreaInsets.bottom;
        this.statusBarHeight = res.statusBarHeight + 44;
      },
    });
  },
  computed: {
    token() {
      return this.$store.state.vuex_token;
    },
  },
  onLoad() {
    console.log("Page Load");
    // this.show = true;
  },
  methods: {
    beforeBack(index) {
      uni.redirectTo({ url: "/pages/origin/index" });
    },
    beforeUpload(index, list) {
      // 调用自己的接口上传文件
      console.log("Before Upload", index, list);
      return false;
    },
    handleUploadSuccess(res) {
      console.log("Upload Success成功了", res);
    },
    handleSubmit() {
      // 获取附加图片
      if (this.$refs.additional_images && this.$refs.additional_images.lists) {
        this.form.additional_images = this.$refs.additional_images.lists
          .map((element) => element.response.data.url)
          .join(",");
      }

      // 获取诊疗过程图片
      if (
        this.$refs.referral_treatment_process_images &&
        this.$refs.referral_treatment_process_images.lists
      ) {
        this.form.referral_treatment_process_images =
          this.$refs.referral_treatment_process_images.lists
            .map((element) => element.response.data.url)
            .join(",");
      }
      // 获取病情描述图片
      if (
        this.$refs.referral_disease_desc_images &&
        this.$refs.referral_disease_desc_images.lists
      ) {
        this.form.referral_disease_desc_images =
          this.$refs.referral_disease_desc_images.lists
            .map((element) => element.response.data.url)
            .join(",");
      }
      // 获取检查报告图片
      if (
        this.$refs.inspection_report_images &&
        this.$refs.inspection_report_images.lists
      ) {
        this.form.inspection_report_images =
          this.$refs.inspection_report_images.lists
            .map((element) => element.response.data.url)
            .join(",");
      }

      // 获取检验报告图片
      if (
        this.$refs.inspectd_report_images &&
        this.$refs.inspectd_report_images.lists
      ) {
        this.form.inspectd_report_images =
          this.$refs.inspectd_report_images.lists
            .map((element) => element.response.data.url)
            .join(",");
      }

      // 验证必填项
      if (!this.form.patient_name) {
        uni.showToast({
          title: "请填写患者姓名",
          icon: "none",
        });
        return;
      }
      // 患者性别
      if (this.form.patient_gender_data === "") {
        uni.showToast({
          title: "请选择患者性别",
          icon: "none",
        });
        return;
      }
      if (!this.form.patient_age) {
        uni.showToast({
          title: "请填写患者年龄",
          icon: "none",
        });
        return;
      }
      // 联系方式，并验证手机号是否正确
      if (
        this.form.patient_phone &&
        !/^1[3456789]\d{9}$/.test(this.form.patient_phone)
      ) {
        uni.showToast({
          title: "请填写正确的联系方式",
          icon: "none",
        });
        return;
      }

      if (!this.form.referral_diagnosis) {
        uni.showToast({
          title: "请填写主要诊断",
          icon: "none",
        });
        return;
      }
      if (!this.form.referral_reason) {
        uni.showToast({
          title: "请填写转诊目的",
          icon: "none",
        });
        return;
      }
      // 病情等级验证
      if (!this.form.referral_urgency_data) {
        uni.showToast({
          title: "请选择病情等级",
          icon: "none",
        });
        return;
      }

      // 提交转诊
      ApiReferralApply(this.form)
        .then((res) => {
          console.log("转诊申请成功", res);
          uni.showToast({
            title: "转诊申请成功",
            icon: "success",
          });
          this.form.id = res.data.data.id;
          this.show = true;
        })
        .catch((error) => {
          console.log("转诊申请失败", error);
          uni.showToast({
            title: "转诊申请失败",
            icon: "none",
          });
        });

      // 提交逻辑
      console.log("Form Data:", this.form);
    },
    inquiry(index) {
      console.log("查看转诊单", index);
      if (index.index === 0) {
        console.log("查看转诊单11", this.form.id);
        uni.navigateTo({
          url: "/pages/origin/detail?id=" + this.form.id,
        });
      } else {
        uni.reLaunch({
          url: "/pages/origin/index",
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  /* padding-top: 90rpx; nav bar height */
  width: 90vw;
}
.form-section {
  margin: 30rpx;
}
.form-item {
  margin-bottom: 20rpx;
}
.required {
  color: red;
}
.submit-button-container {
  position: fixed;
  right: 50rpx;
  top: 200rpx;
  z-index: 9999; /* Ensure the button is on top */
}
.submit-button {
  background-color: #007aff;
  color: #ffffff !important;
}
</style>
