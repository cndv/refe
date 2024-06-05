<template>
    <view class="container" v-if="isLogin">
        <tn-nav-bar :beforeBack="beforeBack" leftArrow fixed>{{
            conversationName
        }}</tn-nav-bar>
        <view
            :style="{ height: statusBarHeight + 'px' }"
            class="status-bar"
        ></view>
        <view
            class="chatBg"
            v-if="!isShow && conversation && conversation.userProfile"
            @click="nameTo"
        >
            <image
                v-if="conversation.userProfile"
                :src="
                    conversation.userProfile.avatar ||
                    'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'
                "
            >
            </image>
            <!-- <view class="chatUser">
                <text>{{ conversation.userProfile.nick }}</text>
                <text></text>
            </view> -->
        </view>
        <!-- 小程序视频通话 -->
        <!--  #ifdef  MP-WEIXIN -->
        <tuicalling
            ref="TUICalling"
            id="TUICalling-component"
            :config="config"
        ></tuicalling>
        <!--  #endif -->
        <!-- 先查 remark；无 remark 查 (c2c)nick/(group)name；最后查 (c2c)userID/(group)groupID -->
        <!-- <view class="tui-chatroom-navigatorbar" v-if="conversation.type === 'GROUP'"></view> -->
        <!-- <view class="group-profile">
            <TUI-group-profile
                id="groip-profile"
                v-if="isShow"
                :conversation="conversation"
                :referralInfo="referralInfo"
            ></TUI-group-profile>
        </view> -->
        <!-- 弹窗组件 -->
        <view class="popup-content">
            <view class="group-info">
                <view class="group-info-left">
                    <text>转诊状态：待审核</text>
                </view>
                <view class="group-info-right">
                    <view
                        class="group-info-right-r"
                        @click="showPopup = !showPopup"
                    >
                        <text>聊天成员:2 人</text>
                        <text
                            :class="showPopup ? 'tn-icon-up' : 'tn-icon-down'"
                        ></text>
                    </view>
                </view>
            </view>
            <!-- 弹窗组件 -->
            <tn-popup
                v-model="showPopup"
                :marginTop="statusBarHeight + 73"
                mode="top"
            >
                <view class="popup-content">
                    <!-- 申请信息部分 -->
                    <view class="section">
                        <view class="section-title">申请信息</view>
                        <view class="info">
                            <tn-avatar :src="avatar" size="large"></tn-avatar>
                            <view class="text">
                                <view>赵星星 主治医师</view>
                                <view>湖南长沙红枫医院</view>
                            </view>
                        </view>
                        <view class="purpose">
                            转诊目的：该患者属于高危患者，请专家评估后尽快予以转诊治疗，谢谢
                        </view>
                    </view>
                    <!-- 患者信息部分 -->
                    <view class="section">
                        <view class="section-title">患者信息</view>
                        <view class="patient-info">
                            <view class="patient-details">
                                <view>王建国</view>
                                <view class="patient-meta">
                                    <text class="man" size="14">男</text>
                                    <view>55岁</view>
                                    <tn-tag type="warning" size="small"
                                        >待审核</tn-tag
                                    >
                                </view>
                            </view>
                            <view class="document-icons">
                                <text
                                    class="tn-icon-image-text document-icons-size"
                                    size="30"
                                ></text>
                                <text
                                    class="tn-icon-image-text document-icons-size"
                                    size="30"
                                ></text>
                                <text
                                    class="tn-icon-image-text document-icons-size"
                                    size="30"
                                ></text>
                                <text
                                    class="tn-icon-image-text document-icons-size"
                                    size="30"
                                ></text>
                            </view> </view
                    ></view>
                </view>
            </tn-popup>
        </view>
        <view class="message-list" @tap="triggerClose">
            <TUI-message-list
                ref="messageList"
                id="message-list"
                :conversation="conversation"
            ></TUI-message-list>
        </view>
        <view
            class="container-box"
            v-if="videoPlay"
            @tap.stop="stopVideoHander"
        >
            <video
                class="video-message"
                v-if="videoPlay"
                :src="videoMessage.payload.videoUrl"
                :poster="videoMessage.payload.snapshotUrl"
                object-fit="cover"
                error="videoError"
                autoplay="true"
                direction="0"
            ></video>
        </view>
        <view class="message-input" v-if="showChat">
            <TUI-message-input
                ref="messageInput"
                id="message-input"
                :conversation="conversation"
                @sendMessage="sendMessage"
                @handleCall="handleCall"
            ></TUI-message-input>
        </view>
    </view>
</template>

<script>
import TUIMessageList from "../components/tui-chat/message-list/index";
import TUIMessageInput from "../components/tui-chat/message-input/index";
import TUIGroupProfile from "../components/tui-group/group-profile/index";
import { ApiReferralDetail } from "../../common/api";
import avatar from "uview-ui/libs/config/props/avatar";
export default {
    data() {
        return {
            statusBarHeight: 0,
            conversationName: "",
            conversation: {},
            messageList: [],
            isShow: false,
            showChat: true,
            conversationID: "",
            referralId: "",
            videoPlay: false,
            videoMessage: {},
            referralInfo: {},
            showPopup: false,
            config: {
                sdkAppID: uni.getStorageSync("sdkAppID"),
                userID: uni.getStorageSync("userID"),
                userSig: uni.getStorageSync("userSig"),
                type: 1,
                tim: null,
            },
            friendList: "",
            options: "",
            avatar: "/static/images/avatar.png",
        };
    },

    components: {
        TUIMessageList,
        TUIMessageInput,
        TUIGroupProfile,
    },
    props: {},
    created() {
        uni.$on("videoPlayerHandler", (value) => {
            this.videoPlay = value.isPlay;
            this.videoMessage = value.message;
        });
    },
    computed: {
        isLogin() {
            return this.$store.state.isLogin;
        },
    },
    watch: {
        isLogin(val) {
            if (val) {
                this.getMsg();
            }
        },
    },
    /**
     * 生命周期函数--监听页 面加载
     */
    onLoad(options) {
        this.options = options;
        if (this.isLogin) {
            this.getMsg();
        }
        // 获取设备顶部高度
        uni.getSystemInfo({
            success: (res) => {
                this.statusBarHeight = res.statusBarHeight + 44;
            },
        });
        this.referralId = options.referralId ?? 5;
        // 获取转诊信息
        ApiReferralDetail({ id: this.referralId }).then((res) => {
            console.log("转诊信息", res.data);
            if (res.code === 1) {
                this.referralInfo = res.data;
            } else {
                uni.showToast({
                    title: res.msg,
                    icon: "none",
                });
                // 2秒后跳转到上一页
                setTimeout(() => {
                    uni.navigateBack();
                }, 2000);
            }
        });
    },
    onUnload() {
        // #ifdef  MP-WEIXIN
        this.$refs.TUICalling.destroyed();
        // #endif
    },
    methods: {
        getMsg() {
            this.getFriendList();
            // #ifdef  MP-WEIXIN
            // 初始化 小程序视频通话 TUICalling
            this.config = {
                sdkAppID: uni.getStorageSync("sdkAppID"),
                userID: uni.getStorageSync("userInfo").userID,
                userSig: uni.getStorageSync("userInfo").userSig,
            };
            this.$nextTick(() => {
                this.$refs.TUICalling.init();
            });
            // #endif

            const { conversationID } = this.options;
            this.conversationID = conversationID;
            uni.$TUIKit
                .setMessageRead({
                    conversationID,
                })
                .then(() => {});
            uni.$TUIKit.getConversationProfile(conversationID).then((res) => {
                const { conversation } = res.data;

                this.conversation = conversation;
                uni.setNavigationBarTitle({
                    title: this.getConversationName(conversation),
                });
                this.setData({
                    conversationName: this.getConversationName(conversation),
                    isShow: conversation.type === "GROUP",
                });
            });
        },
        nameTo() {
            this.pageUrl();
        },
        pageUrl() {
            const num = this.conversationID.slice(0, 3);
            const list = this.friendList;
            // 跳转好友信息页面
            if (num === "C2C") {
                const ID = this.conversationID.substring(3);
                const id = list.some((item) => item.userID == ID);
                if (id === true) {
                    let promise = uni.$TUIKit.getFriendProfile({
                        userIDList: [ID],
                    });
                    promise
                        .then(function (imResponse) {
                            const { friendList, failureUserIDList } =
                                imResponse.data;
                            friendList.forEach((friend) => {
                                // Friend 对象
                            });
                            // 失败的 userIDList
                            failureUserIDList.forEach((item) => {
                                const { userID, code, message } = item;
                            });
                            var id = friendList[0].userID;
                            var avatar = friendList[0].profile.avatar;
                            var remark = friendList[0].remark;
                            uni.navigateTo({
                                url:
                                    "/im/information/information?id=" +
                                    id +
                                    "&url=" +
                                    avatar +
                                    "&remark=" +
                                    remark +
                                    "&index=1",
                            });
                        })
                        .catch(function (imError) {
                            console.warn("getFriendProfile error:", imError); // 获取失败
                        });
                } else {
                    let promise = uni.$TUIKit.getUserProfile({
                        userIDList: [ID], // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
                    });
                    promise
                        .then(function (imResponse) {
                            // 存储用户资料的数组 - [Profile]
                            const userID = imResponse.data;
                            for (var i = 0; i < userID.length; i++) {
                                var id = userID[i].userID;
                                var avatar = userID[i].avatar;
                                var nick = userID[i].nick;
                            }
                            uni.navigateTo({
                                url:
                                    "/im/information/information?id=" +
                                    id +
                                    "&url=" +
                                    avatar +
                                    "&nick=" +
                                    nick +
                                    "&index=2",
                            });
                        })
                        .catch(function (imError) {
                            console.warn("getUserProfile error:", imError); // 获取其他用户资料失败的相关信息
                        });
                }
            }

            // 跳转群聊信息页面
            if (num === "GRO") {
                const group = this.conversationID.substring(5);
                uni.navigateTo({
                    url: "/im/information/groupInfo?id=" + group,
                });
            }
        },
        onNavigationBarButtonTap() {
            this.pageUrl();
        },
        stopVideoHander() {
            this.videoPlay = false;
        },
        getFriendList() {
            let promise = uni.$TUIKit.getFriendList();
            promise
                .then((imResponse) => {
                    const friendList = imResponse.data; // 好友列表
                    this.friendList = friendList;
                })
                .catch(function (imError) {
                    console.warn("getFriendList error:", imError); // 获取好友列表失败的相关信息
                });
        },
        getConversationName(conversation) {
            if (conversation.type === "@TIM#SYSTEM") {
                this.setData({
                    showChat: false,
                });
                return "系统通知";
            }

            if (conversation.type === "C2C") {
                return (
                    conversation.remark ||
                    conversation.userProfile.nick ||
                    conversation.userProfile.userID
                );
            }

            if (conversation.type === "GROUP") {
                return (
                    conversation.groupProfile.name ||
                    conversation.groupProfile.groupID
                );
            }
        },
        handleCall(val) {
            console.log(val.detail.userID, "通话id");

            console.log(val.detail.type, "通话类型");
            // 小程序通话
            // #ifdef  MP-WEIXIN
            this.$refs.TUICalling.call({
                userID: val.detail.userID,
                type: val.detail.type,
            });
            // #endif

            // APP通话
            // #ifdef  APP-PLUS
            console.log("callMediaType", Number(val.detail.type));
            uni.$TUICallKit.call(
                {
                    userID: val.detail.userID,
                    callMediaType: Number(val.detail.type),
                },
                (res) => {
                    if (res.code === 0) {
                        console.log("call success");
                    } else {
                        console.log(`${res.msg}`);
                    }
                }
            );
            // #endif
        },
        sendMessage(event) {
            // 将自己发送的消息写进消息列表里面
            this.$refs.messageList.updateMessageList(event.detail.message);
        },

        triggerClose() {
            if (this.showChat) {
                this.$refs.messageInput.handleClose();
            }
        },

        goBack() {
            const pages = getCurrentPages(); // 当前页面栈

            if (
                pages[pages.length - 2].route ===
                    "/im/conversation/create-conversation/create" ||
                pages[pages.length - 2].route ===
                    "pages/TUI-Group/create-group/create" ||
                pages[pages.length - 2].route ===
                    "pages/TUI-Group/join-group/join"
            ) {
                uni.navigateBack({
                    delta: 2,
                });
            } else {
                uni.navigateBack({
                    delta: 1,
                });
            }

            uni.$TUIKit
                .setMessageRead({
                    conversationID: this.conversationID,
                })
                .then(() => {});
        },
    },
};
</script>

<style lang="scss" scoped>
.chatBg {
    position: fixed;
    /*  #ifdef H5 */
    top: 120rpx;
    /*  #endif  */
    /*  #ifdef MP-WEIXIN || APP-PLUS */
    top: 20rpx;
    /*  #endif  */

    width: 90%;
    background: linear-gradient(to right, #6665f6, #fa709a);
    border-radius: 10rpx;
    display: flex;
    left: 50%;
    margin-left: -45%;
    padding: 10px 20px;
    box-sizing: border-box;
    z-index: 99;

    image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 100rpx;
    }

    .chatUser {
        color: #ffffff;
        font-size: 30rpx;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
}

.container {
    width: 100vw;
    height: 100vh;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
}

.tui-chatroom-navigatorbar {
    position: relative;
    flex-shrink: 0;
    height: 90rpx;
}

.tui-chatroom-navigatorbar-back {
    position: absolute;
    width: 48rpx;
    height: 48rpx;
    left: 24rpx;
    bottom: 20rpx;
}

.conversation-title {
    position: absolute;
    width: 350rpx;
    height: 88rpx;
    line-height: 56rpx;
    font-size: 36rpx;
    color: #ffffff;
    z-index: 100;
    bottom: 0;
    left: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.message-list {
    flex: 1;
    width: 100vw;
    overflow-y: scroll;
}

.message-input {
    flex-shrink: 0;
    width: 100%;
}

.calling {
    position: fixed;
    z-index: 199;
    top: 0;
    /*  #ifdef  H5  */
    top: calc(88rpx + constant(safe-area-inset-top));
    top: calc(88rpx + env(safe-area-inset-top));
    /*  #endif  */
    bottom: 0;
    right: 0;
}

.group-profile {
    z-index: 1111;
}

.container-box {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.video-message {
    width: 90vw;
    height: 300px;
}

.popup-content {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
}
.section {
    margin-bottom: 20px;
}
.section-title {
    font-weight: bold;
    margin-bottom: 10px;
}
.info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.text {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
}
.name-title {
    font-size: 16px;
    font-weight: bold;
}
.hospital {
    font-size: 14px;
    color: #888;
}
.purpose {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
}
.patient-info {
    display: flex;
    flex-direction: column;
}
.patient-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.patient-meta {
    display: flex;
    align-items: center;
}
.patient-meta > view {
    margin: 0 5px;
}
.document-icons {
    display: flex;
    justify-content: space-between;
}
document-icons-size {
    font-size: 30px;
}

.group-info {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
    height: 50px;
}
.group-info-left {
    font-weight: bold;
}
.group-info-right {
    color: #007aff;
}
.group-info-right-r {
    display: flex;
    justify-content: space-between;
}
</style>
