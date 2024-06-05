<template>
    <tn-tabbar
        v-model="localCurrentIndex"
        :list="tabbarList"
        activeColor="#007AFF"
        inactiveColor="#AAAAAA"
        activeIconColor="#007AFF"
        :animation="true"
        :safeAreaInsetBottom="true"
        @change="handleChange"
        :beforeSwitch="beforeSwitch"
    ></tn-tabbar>
</template>

<script>
export default {
    props: {
        currentIndex: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            localCurrentIndex: this.currentIndex,
            // 底部tabbar菜单数据
            tabbarList: [
                {
                    title: "转入管理",
                    activeIcon: "tag-fill",
                    inactiveIcon: "tag",
                    pagePath: "",
                },
                {
                    title: "转出管理",
                    activeIcon: "brand-fill",
                    inactiveIcon: "brand",
                    pagePath: "/pages/transferOut/transferOut",
                },
                {
                    title: "",
                    activeIcon: "add-fill",
                    inactiveIcon: "add",
                    activeIconColor: "#FFFFFF",
                    inactiveIconColor: "#FFFFFF",
                    iconSize: 50,
                    out: true,
                    pagePath: "/pages/origin/apply",
                },
                {
                    title: "消息",
                    activeIcon: "discover-fill",
                    inactiveIcon: "discover",
                    pagePath: "/pages/origin/notice",
                },
                {
                    title: "我的",
                    activeIcon: "my-fill",
                    inactiveIcon: "my",
                    pagePath: "/pages/origin/center",
                },
            ],
        };
    },
    watch: {
        currentIndex(newIndex) {
            this.localCurrentIndex = newIndex;
            console.log("currentIndex", this.localCurrentIndex);
        },
    },
    methods: {
        beforeSwitch(index) {
            // 判断用户点击的按钮是否是功能暂未开放的按钮
            if (!this.tabbarList[index].pagePath) {
                // 提示用户 功能暂未开放
                uni.showToast({
                    title: "功能暂未开放",
                    icon: "none",
                });
                return false;
            }
            return true;
        },
        handleChange(index) {
            if (this.localCurrentIndex === index) {
                // 用户点击的是当前选中的按钮，不进行页面跳转
                return;
            }
            // 跳转页面
            const pagePath = this.tabbarList[index].pagePath;
            console.log("pagePath", pagePath);
            if (pagePath) {
                this.localCurrentIndex = index;
                this.$emit("change", index);
                console.log("handleChange", index);
                uni.navigateTo({
                    url: pagePath,
                });
            } else {
                // 提示用户功能开发中
                uni.showToast({
                    title: "功能开发中...",
                    icon: "none",
                });
                return;
            }
        },
    },
};
</script>

<style scoped>
/* 自定义样式（如果有的话） */
</style>
