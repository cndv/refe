<template>
    <view class="container">
        <view
            :style="{ height: statusBarHeight + 'px' }"
            class="status-bar"
        ></view>
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
                            <tn-tag fontColor="#080808" padding="0" width="auto"
                                >上转</tn-tag
                            >
                            <view>
                                {{ referral.patient_name }}
                                {{ referral.patient_gender_data_text }}
                                {{ referral.patient_age }}岁
                            </view>
                        </view>
                        <view class="right">
                            <view
                                class="status"
                                :class="referral.referral_status_data"
                                >{{ referral.referral_status_data_text }}</view
                            >
                        </view>
                    </view>
                    <view class="middle"
                        >转入机构：{{ referral.target_hospital_name }}</view
                    >
                    <view class="bottom"
                        >申请时间：{{ referral.apply_time }}</view
                    >
                </view>
                <view class="actions">
                    <tn-button
                        type="primary"
                        backgroundColor="tn-bg-blue"
                        class="action-button"
                        :plain="true"
                        width="180rpx"
                        height="60rpx"
                        >转诊交流</tn-button
                    >
                    <tn-button
                        v-show="referral.referral_status_data === 'Pending'"
                        type="primary"
                        backgroundColor="tn-bg-blue"
                        class="action-button"
                        width="180rpx"
                        height="60rpx"
                        >转诊审核</tn-button
                    >
                </view>
            </view>
        </view>
        <tn-popup
            v-model="showPopup"
            mode="center"
            :closeBtn="true"
            height="80%"
            width="90%"
        >
            <view class="form-container">
                <view class="container">
                    <view class="header">
                        <view class=""> </view>
                        <text>转诊审核</text>
                        <view class="close-btn">
                            <image
                                class="close-btn"
                                src="../../static/叉叉.png"
                                mode=""
                            ></image>
                        </view>
                    </view>
                    <view class="line"> </view>

                    <view class="form-item">
                        <text class="label">审批意见</text>
                        <radio-group
                            class="radio-group"
                            @change="onOpinionChange"
                        >
                            <label class="radio-label">
                                <radio value="通过"></radio>
                                通过
                            </label>
                            <label class="radio-label">
                                <radio value="拒绝"></radio>
                                拒绝
                            </label>
                        </radio-group>
                    </view>

                    <view class="form-item">
                        <text class="label">接收科室</text>
                        <view class="pickList">
                            <picker
                                mode="selector"
                                :range="departments"
                                @change="onDepartmentChange"
                            >
                                <view class="picker">
                                    <text>{{ selectedDepartment }}</text>
                                </view>
                            </picker>
                            <image
                                class="littleImage"
                                src="../../uni_modules/lonjin-form/static/images/icon-right.png"
                                mode=""
                            >
                            </image>
                        </view>
                    </view>

                    <view class="form-item">
                        <text class="label">接收病区</text>
                        <picker
                            mode="selector"
                            :range="inpatient"
                            @change="inpatientChange"
                        >
                            <view class="picker">
                                <text>{{ selectedInpatient }}</text>
                            </view>
                        </picker>
                    </view>
                    <view class="form-item">
                        <text class="label">亚专科</text>
                        <view @click="goYa" class="yaText">
                            <span v-if="!inputValue">请输入</span>
                            <span v-else>{{ inputValue }}</span>
                        </view>
                    </view>

                    <view class="form-item">
                        <text class="label">审批医生</text>
                        <text class="value">湘雅医生</text>
                    </view>

                    <view class="form-item">
                        <text class="label">建议入院日期</text>
                        <picker mode="date" @change="onDateChange">
                            <view class="picker">
                                <text>{{ date }}</text>
                            </view>
                        </picker>
                    </view>

                    <view class="form-item">
                        <text class="label">建议入院时间</text>
                        <picker mode="time" @change="onTimeChange">
                            <view class="picker">
                                <text>{{ time }}</text>
                            </view>
                        </picker>
                    </view>

                    <!-- <button class="submit-btn" @click="submit">提交</button> -->
                </view>
                <view class="submitList">
                    <view @click="resetButton" class="resetText"> 重置 </view>
                    <view @click="submit" class="submit-btn"> 提交 </view>
                </view>
            </view>
        </tn-popup>
        <!-- <tn-action-sheet
            v-model="showPopup"
            :list="list"
            @click="click"
        ></tn-action-sheet> -->
        <view
            :style="{ height: bottomBarHeight + 'px' }"
            class="status-bar"
        ></view>
        <TargetTabBar :currentIndex="currentIndex" @change="switchTabbar" />
    </view>
</template>

<script>
import { ApiReferralLis } from "../../common/api";
import TargetTabBar from "@/components/TabBar/TargetTabBar.vue";
export default {
    components: {
        TargetTabBar,
    },
    data() {
        return {
            activeTab: 0,
            current: 0,
            activeTabbar: 0,
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
            // 转诊审核弹窗
            showPopup: true,
            // tabbar当前被选中的序号
            currentIndex: 0,
            // 页面的转诊信息
            referrals: [],
            form: {},
            list: [
                {
                    text: "点赞",
                    color: "blue",
                    fontSize: 28,
                    subText: "感谢您的点赞",
                },
                {
                    text: "分享",
                },
                {
                    text: "评论",
                },
            ],
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
    background-color: #ffffff;
    margin-bottom: 10rpx;
    font-size: 28rpx;
    border: 1px solid #f0f0f0;
}
.status.Pending {
    /* background-color: #ffa500; */
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
.form-container {
    padding: 20rpx;
    padding-top: 80rpx;
}

.header {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    margin: auto;
    /* border-bottom: 1px solid #e5e5e5; */
}
.line {
    width: 100%;
    height: 1rpx;
    background-color: #e5e5e5;
}
.littleImage {
    width: 32rpx;
    height: 32rpx;
}
.pickList {
    display: flex;
    align-items: center;
}

.close-btn {
    background: none;
    border: none;
    font-size: 30rpx;
    /* opacity: 0.5; */
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    width: 32rpx;
    height: 32rpx;
}

.form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #e5e5e5;
}
.yaText {
    opacity: 0.5;
}

.label {
    font-size: 32rpx;
}

.radio-group {
    display: flex;
}

.radio-label {
    margin-right: 40rpx;
}

.picker {
    width: 100%;
    height: 50rpx;
    line-height: 50rpx;
    text-align: right;
    color: #999;
}

.submit-btn {
    /* width: 300rpx; */
    /* height: 80rpx; */
    background-color: #007aff;
    color: white;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* .submitList view{
	width: 45%;
	height: 80rpx;
	
} */
.submitList {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0rpx;
}
.submitList view {
    width: 45%;
    height: 80rpx;
}
.resetText {
    /* width: 300rpx; */
    border: 1px solid #f5f6f8;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
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
