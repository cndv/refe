<template>
	<view class="box">
		<view class="box-top">
			<text class="total">群成员 共{{friendList.length}}人</text>
			<view class="list">
				<view class="list-item" v-for="(item,index) in friendList" :key='index' @tap="handleRoute(item.userID)">
					<image class="list-URL" :src="item.avatar || head"></image>
					<text>{{item.userID}}</text>
				</view>
				<!-- v-show="shows" -->
				<view class="list-item" @click='addfriends'  >
					<u-icon class="list-URL" name="plus-people-fill" color="#A6ADBB" size="36"></u-icon>
					<text>邀请成员</text>
				</view>
				<view class="list-item" @click='delfriends' v-show="!isShow">
					<u-icon class="list-URL" name="trash" color="#A6ADBB" size="36"></u-icon>
					<text>删除成员</text>
				</view>
			</view>
				<u-gap height="10" bgColor="#F6F7F9"></u-gap>
		</view>
	 
		<view class="box-center">
			<view class="info-list">
				<view class="line" @tap.stop="changeAvatar">
					<text class="list-left">群头像</text>
					<view class="list-right"  >
						<image class="image_radius"
							:src="groupInformation.avatar">
						</image>
						<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
					</view>
					<view class="popup-mask-avatar" v-if="popupToggleAvatar" @tap.stop="handleEditToggleAvatar">
						<view class="popup-main-avatar" @tap.stop="handleCatchTap">
							<view class="pop-main-header-avatar">
								<label class="popup-main-header-title-avatar">设置头像</label>
								<label class="button-avatar" @tap.stop="handleEditSubmitAvatar">确认</label>
								<view class="image-list">
									<image v-for="(item, index) in avatarList" :key="index"
										:class="'image-avatar ' + (item.URL === avatar && 'image-avatar-active')"
										:src="item.URL" :data-value="item" @tap="click"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="line" @tap="handleEditToggle">
					<text class="list-left">群聊昵称</text>
					<view class="list-right" >
						<text>{{groupInformation.name}}</text>
						<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
					</view>
					<view class="popup-mask" v-if="popupToggle" @tap.stop="handleEditToggle">
						<view class="popup-main" @tap.stop="handleCatchTap">
							<view class="popup-main-header">
								<label class="popup-main-header-title">修改群聊昵称</label>
								<button class="button" @tap.stop="handleEditSubmit" :disabled="!infoNick">确认</button>
							</view>
							<input class="popup-main-input" type="text" :value="infoNick" @input="bindEditInput" />
							<label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
						</view>
					</view>
				</view>
				<view class="line">
					<text class="list-left">群ID</text>
					<text class="list-right">{{groupInformation.groupID}}</text>
				</view>
				<view class="line">
					<text class="list-left">群类型</text>
					<text class="list-right">社交群</text>
				</view>
				<view class="line"  @tap="handleEdit">
					<text class="list-left">我的本群昵称</text>
					<view class="list-right" >
						<text class="list-right">{{ownNick}}</text>
						<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
					</view>
					<view class="popup-mask" v-if="popup" @tap.stop="handleEdit">
						<view class="popup-main" @tap.stop="handleCatchTap">
							<view class="popup-main-header">
								<label class="popup-main-header-title">修改我的群昵称</label>
								<button class="button" @tap.stop="change" :disabled="!infoName">确认</button>
							</view>
							<input class="popup-main-input" type="text" :value="infoName" @input="Input" />
							<label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
						</view>
					</view>
				</view>
				<view class="line"  @tap="handleIntroduction">
					<text class="list-left">群介绍</text>
					<view class="list-right introduction" >
						<text>{{groupInformation.introduction}}</text>
						<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
					</view>
					<view class="popup-mask" v-if="popupIntro" @tap.stop="handleIntroduction">
						<view class="popup-main" @tap.stop="handleCatchTap">
							<view class="popup-main-header">
								<label class="popup-main-header-title">修改群聊介绍</label>
								<button class="button" @tap.stop="introductionSubmit"
									:disabled="!infoIntroduction">确认</button>
							</view>
							<input class="popup-main-input" type="text" :value="infoIntroduction" @input="introInput" />
							<label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
						</view>
					</view>
				</view>
				<view class="line"  @tap="handleNotification">
					<text class="list-left">群公告</text>
					<view class="list-right introduction" >
						<text>{{groupInformation.notification}}</text>
						<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
					</view>
					<view class="popup-mask" v-if="popupNoti" @tap.stop="handleNotification">
						<view class="popup-main" @tap.stop="handleCatchTap">
							<view class="popup-main-header">
								<label class="popup-main-header-title">修改群公告</label>
								<button class="button" @tap.stop="notificationSubmit"
									:disabled="!infoNotification">确认</button>
							</view>
							<input class="popup-main-input" type="text" :value="infoNotification" @input="notiInput" />
							<label class="text">仅限中文、字母、数字和下划线，2-20个字</label>
						</view>
					</view>
				</view>
				<view class="line">
					<text class="list-left">申请加入群方式</text>
					<text class="list-right">{{groupInformation.joinOption}}</text>
				</view>
				<view class="line">
					<text class="list-left">消息提示类型</text>
					<view class="list-right">
						<picker class="tip" @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">
								<text>{{array[index]}}</text>
								<u-icon name="arrow-right" color="#B2B3B2" size="20"></u-icon>
							</view>
						</picker>
					</view>
				</view>
				<view class="line">
					<text class="list-left">全体禁言</text>
					<view class="uni-list">
						<view class="uni-list-cell uni-list-cell-pd" @click="banned">
							<switch :checked="show" />
						</view>
					</view>
				</view>
				<view class="butt">
					<u-button type="error" class="quit-main" @tap="exit" v-show="isShow">退出群聊</u-button>
					<br>
					<u-button type="warning" class="quit-main" @tap="dissovle" v-show="!isShow">解散群聊</u-button>
				</view>
			</view>

		</view>
	</view>
	</view>
</template>

<script>
 
	export default {
		data() {
			return {
				popupToggleAvatar: false, //群头像
				array: ['接受消息并提示', '接受消息但不提示', '屏蔽消息'],
				index: 0,
				shows: false,
				isShow: true,
				friendList: '',
				groupInformation: '',
				popupToggle: false, //群聊昵称
				popup: false, //本群昵称
				popupIntro: false, //群介绍
				popupNoti: false, // 群公告
				infoNick: '',
				infoName: '',
				infoIntroduction: '',
				infoNotification: '',
				show: false,
				ownID: '',
				ownNick: '',
				ownerID: '',
				head: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png',
				avatar: '',
				avatarList: [
					{
						avatarname: '头像5',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_05.png',
					},
					{
						avatarname: '头像6',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_06.png',
					},
					{
						avatarname: '头像7',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_07.png',
					},
					{
						avatarname: '头像8',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_08.png',
					},
					{
						avatarname: '头像9',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_09.png',
					},
					{
						avatarname: '头像10',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_10.png',
					},
					{
						avatarname: '头像11',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_11.png',
					},
					{
						avatarname: '头像12',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_12.png',
					},
					{
						avatarname: '头像13',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_13.png',
					},
					{
						avatarname: '头像14',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_14.png',
					},
					{
						avatarname: '头像15',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_15.png',
					},
					{
						avatarname: '头像16',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_16.png',
					},
					{
						avatarname: '头像17',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_17.png',
					},
					{
						avatarname: '头像18',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_18.png',
					},
					{
						avatarname: '头像19',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_19.png',
					},
					{
						avatarname: '头像20',
						URL: 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_20.png',
					},
				],
			}
		},
		onLoad: function(option) {
			console.log(option);
			this.groupProfile(option);
			this.groupMemberList(option);
			this.getPer();
		},
		methods: {
			// 修改头像
			changeAvatar() {
				this.popupToggleAvatar = true;
			},
			click(e) {
				console.log(e.currentTarget.dataset.value);
				this.avatar = e.currentTarget.dataset.value.URL;
			},
			handleEditToggleAvatar() {
				this.popupToggleAvatar = !this.popupToggleAvatar;
				this.avatar = this.avatar;
			},
			// 修改头像确认
			handleEditSubmitAvatar() {
				const groupID = this.groupInformation.groupID;
				let promise = uni.$TUIKit.updateGroupProfile({
					groupID: groupID,
					avatar: this.avatar
				});
				promise.then(imResponse => {
					console.log(imResponse.data.group) // 修改成功后的群组详细资料
					this.groupInformation = imResponse.data.group;
					this.popupToggleAvatar = !this.popupToggleAvatar;
					uni.showModal({
						title: '提示',
						content: '群头像更换成功',
					});
				}).catch(function(imError) {
					console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
					this.popupToggleAvatar = !this.popupToggleAvatar;
				});
			},
			// 群消息设置
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value);
				this.index = e.target.value;
				const groupID = this.groupInformation.groupID;
				if (this.index === 0) {
					// 拒收群消息后，重新开启新消息提醒
					let promise = uni.$TUIKit.setMessageRemindType({
						groupID: groupID,
						messageRemindType: this.TIM.TYPES.MSG_REMIND_ACPT_AND_NOTE
					});
					promise.then(function(imResponse) {
						// 设置成功后 SDK 会触发 TIM.EVENT.CONVERSATION_LIST_UPDATED 事件（遍历列表，并读取 Conversation.messageRemindType）
						console.log(imResponse.data.group);
					}).catch(function(imError) {
						console.warn('setMessageRemindType error:', imError);
					});
				} else if (this.index === 1) {
					// 群消息免打扰， 一般的实现是在线接收消息， 离线不接收消息（ 在有离线推送的情况下）
					let promise = uni.$TUIKit.setMessageRemindType({
						groupID: groupID,
						messageRemindType: this.TIM.TYPES.MSG_REMIND_ACPT_NOT_NOTE
					});
					promise.then(function(imResponse) {
						// 设置消息免打扰成功
						console.log(imResponse.data.group)
					}).catch(function(imError) {
						// 设置消息免打扰失败
						console.warn('setMessageRemindType error:', imError);
					});
				} else if (this.index === 2) {
					// 拒收群消息（通过 getMessageList 接口可拉取到其他群成员发送的消息）
					let promise = uni.$TUIKit.setMessageRemindType({
						groupID: groupID,
						messageRemindType: this.TIM.TYPES.MSG_REMIND_DISCARD
					});
					promise.then(function(imResponse) {
						// 设置成功后 SDK 会触发 TIM.EVENT.CONVERSATION_LIST_UPDATED 事件（遍历列表，并读取 Conversation.messageRemindType）
						console.log(imResponse.data.group)
					}).catch(function(imError) {
						console.warn('setMessageRemindType error:', imError);
					});
				}
			},
			// 点击进入群成员信息
			handleRoute(id) {
				if (id != this.own) {
					const ID = 'C2C' + id;
					uni.navigateTo({
						url: `/im/chat/chat?conversationID=${ID}`,
					});
				}
			},
			// 邀请好友
			addfriends() {
				const groupID = this.groupInformation.groupID;
				uni.navigateTo({
					url: '/im/group/invitation-friends/invitation?groupID=' + groupID
				});
			},
			// 删除好友
			delfriends() {
				if (this.ownID === this.groupInformation.ownerID) {
					console.log("群主");
					const groupID = this.groupInformation.groupID;
					uni.navigateTo({
						url: '/im/group/delete-friends/delete?groupID=' + groupID
					});
				}
			},
			// 设置禁言
			banned() {
				const groupID = this.groupInformation.groupID;
				if (this.show === false) {
					let promise = uni.$TUIKit.updateGroupProfile({
						groupID: groupID,
						muteAllMembers: true, // true 表示全体禁言，false表示取消全体禁言
					});
					promise.then(imResponse => {
						console.log(imResponse.data.group.muteAllMembers) // 修改成功后的群组详细资料
						this.show = imResponse.data.group.muteAllMembers
					}).catch(function(imError) {
						console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
					});
				}
				if (this.show === true) {
					let promise = uni.$TUIKit.updateGroupProfile({
						groupID: groupID,
						muteAllMembers: false, // true 表示全体禁言，false表示取消全体禁言
					});
					promise.then(imResponse => {
						console.log(imResponse.data.group.muteAllMembers) // 修改成功后的群组详细资料
						this.show = imResponse.data.group.muteAllMembers
					}).catch(function(imError) {
						console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
					});
				}
			},
			// 获取群聊信息
			groupProfile(option) {
				let promise = uni.$TUIKit.getGroupProfile({
					groupID: option.id,
					groupCustomFieldFilter: ['key1', 'key2']
				});
				promise.then(imResponse => {
					console.log(imResponse.data.group, '2222222');
					if(imResponse.data.group.avatar === "FaceUrl"){
						imResponse.data.group.avatar = "https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/gruopavatar.png"
					}
					this.groupInformation = imResponse.data.group;
					this.show = imResponse.data.group.muteAllMembers;
					this.ownNick = imResponse.data.group.selfInfo.nameCard;
					console.log(this.groupInformation)
					if (this.ownID === this.groupInformation.ownerID) {
						console.log("群主");
						this.isShow = false;
						if (this.groupInformation.type === "Private") {
							this.shows = true;
						}
					} else {
						console.log("成员");
						this.isShow = true;
					};
					if (this.groupInformation.selfInfo.messageRemindType === "AcceptAndNotify") {
						this.index = 0;
					} else if (this.groupInformation.selfInfo.messageRemindType === "AcceptNotNotify") {
						this.index = 1;
					} else if (this.groupInformation.selfInfo.messageRemindType === "Discard") {
						this.index = 2;
					}
				}).catch(function(imError) {
					console.warn('getGroupProfile error:', imError); // 获取群详细资料失败的相关信息
				});
			},
			groupMemberList(option) {
				let promise = uni.$TUIKit.getGroupMemberList({
					groupID: option.id,
					count: 100,
					offset: 0
				}); // 从0开始拉取30个群成员
				promise.then(imResponse => {
					console.log(imResponse.data.memberList); // 群成员列表
					this.friendList = imResponse.data.memberList;
				}).catch(function(imError) {
					console.warn('getGroupMemberList error:', imError);
				});
			},
			handleEditToggle() {
				this.popupToggle = !this.popupToggle;
				this.infoNick = this.groupInformation.name;
				console.log(this.infoNick, '999');
			},
			handleEdit() {
				this.popup = !this.popup;
				this.infoName = this.ownNick;
				console.log(this.infoName, '999');
			},
			handleIntroduction() {
				this.popupIntro = !this.popupIntro;
				this.infoIntroduction = this.groupInformation.introduction;
				console.log(this.infoIntroduction, '999');
			},
			handleNotification() {
				this.popupNoti = !this.popupNoti;
				this.infoNotification = this.groupInformation.notification;
				console.log(this.infoNotification, '999');
			},
			// 修改昵称 禁止冒泡
			handleCatchTap() {
				return;
			},
			// 获得更改群昵称输入
			bindEditInput(e) {
				const val = e.detail.value;
				this.infoNick = val ? val : '';
			},
			// 获得更改我的群昵称输入
			Input(e) {
				const val = e.detail.value;
				this.infoName = val ? val : '';
			},
			// 获得更改群介绍输入
			introInput(e) {
				const val = e.detail.value;
				this.infoIntroduction = val ? val : '';
			},
			// 获得更改群公告输入
			notiInput(e) {
				const val = e.detail.value;
				this.infoNotification = val ? val : '';
			},
			// 修改昵称确认
			handleEditSubmit() {
				console.log(this.groupInformation.groupID);
				const groupID = this.groupInformation.groupID;
				if (this.infoNick === this.groupInformation.name) {
					return;
				}
				this.popupToggle = false;
				let promise = uni.$TUIKit.updateGroupProfile({
					groupID: groupID,
					name: this.infoNick, // 修改群名称
				});
				promise.then(imResponse => {
					console.log(imResponse.data.group) // 修改成功后的群组详细资料
					this.groupInformation = imResponse.data.group;
					this.popupToggle = false;
					uni.showModal({
						title: '提示',
						content: '修改成功',
					});
				}).catch(function(imError) {
					console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
				});
			},
			// 修改我的群昵称确认
			change() {
				const groupID = this.groupInformation.groupID;
				const ownID = this.ownID;
				let promise = uni.$TUIKit.setGroupMemberNameCard({
					groupID: groupID,
					userID: ownID,
					nameCard: this.infoName
				});
				promise.then(imResponse => {
					console.log(imResponse.data.member); // 修改后的群成员资料
					this.popup = false;
					this.ownNick = imResponse.data.member.nameCard;
					uni.showModal({
						title: '提示',
						content: '修改成功',
					});
				}).catch(function(imError) {
					console.warn('setGroupMemberNameCard error:', imError); // 设置群成员名片失败的相关信息
				});
			},
			// 修改群介绍确认
			introductionSubmit() {
				console.log(this.groupInformation.groupID);
				const groupID = this.groupInformation.groupID;
				console.log(this.infoIntroduction)
				this.popupIntro = false;
				let promise = uni.$TUIKit.updateGroupProfile({
					groupID: groupID,
					introduction: this.infoIntroduction, // 修改群简介
				});
				promise.then(imResponse => {
					console.log(imResponse.data.group) // 修改成功后的群组详细资料
					this.groupInformation = imResponse.data.group;
					this.popupIntro = false;
					uni.showModal({
						title: '提示',
						content: '修改成功',
					});
				}).catch(function(imError) {
					console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
				});
			},
			// 修改群公告确认
			notificationSubmit() {
				const groupID = this.groupInformation.groupID;
				this.popupNoti = false;
				let promise = uni.$TUIKit.updateGroupProfile({
					groupID: groupID,
					notification: this.infoNotification, // 修改群简介
				});
				promise.then(imResponse => {
					console.log(imResponse.data.group) // 修改成功后的群组详细资料
					this.groupInformation = imResponse.data.group;
					this.popupNoti = false;
					uni.showModal({
						title: '提示',
						content: '修改成功',
					});
				}).catch(function(imError) {
					console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
				});
			},
			//获取个人ID
			getPer() {
				let promise = uni.$TUIKit.getMyProfile();
				promise.then(imResponse => {
					this.ownNick = imResponse.data.nick;
					this.ownID = imResponse.data.userID;
					console.log(imResponse.data);
				}).catch(function(imError) {
					console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
				});
			},
			// 退出群聊
			exit() {
				uni.showModal({
					title: '提示',
					content: '确定退出群聊？',
					success: res => {
						if (res.confirm) {
							const groupID = this.groupInformation.groupID;
							let promise = uni.$TUIKit.quitGroup(groupID);
							promise.then(function(imResponse) {
								console.log(imResponse.data.groupID); // 退出成功的群 ID
								uni.showModal({
									title: '提示',
									content: '成功退出',
									success: res => {
										if (res.confirm) {
											console.log('用户点击确定');
											uni.navigateBack({
												delta: 2
											});
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									},
								});
							}).catch(function(imError) {
								console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},
			// 解散群聊
			dissovle() {
				console.log("ok")
				if (this.groupInformation.type === "Private") {
					uni.showModal({
						title: '提示',
						content: '不能解散 Work 类型的群组',
					});
				} else {
					uni.showModal({
						title: '提示',
						content: '确定解散群聊？',
						success: res => {
							if (res.confirm) {
								const groupID = this.groupInformation.groupID;
								let promise = uni.$TUIKit.dismissGroup(groupID);
								promise.then(function(imResponse) { // 解散成功
									console.log(imResponse.data.groupID); // 被解散的群组 ID
									uni.showModal({
										title: '提示',
										content: '成功解散',
										success: res => {
											if (res.confirm) {
												console.log('用户点击确定');
												uni.navigateBack({
													delta: 2
												});
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										},
									});
								}).catch(function(imError) {
									console.warn('dismissGroup error:', imError); // 解散群组失败的相关信息
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						},
					});
				}


			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-input {
		display: flex;
	}

	.introduction {
		max-width: 50%;
		word-break: break-all;
		white-space: pre-wrap;
		font-size: 14px;
		line-height: 16px;
	}

	.introduction text {
		padding: 6px 0;
		color: #999999;
		display: flex;
		align-items:center;
	}

	.total {
		width: 100%;
		display: block;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		line-height: 14px;
		text-align: center;
		padding-top: 16px;
		border-top: 1px solid #eef0f3;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		background-color: white;
		width: 100%;
		letter-spacing: 0;
		line-height: 24px;
		padding: 40rpx 0;
		border-bottom: 1px solid #eef0f3;
	}

	.list-item {
		display: block;
		display: flex;
		flex-direction: column;
		padding-left: 11px;
		align-items: center;
	}

	.list-item text {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #333333;
	}

	.list-URL {
		width: 50px;
		height: 50px;
		border-radius:10rpx;
		border:2rpx solid #eef0f3;
		display: flex;
    justify-content: center;
	}

	.box-center {
		width: 100%;
	}

	.info-list {
		display: flex;
		flex-flow: column nowrap;
	}

	.line {
		display: flex;
		border-bottom: 1px solid #eef0f3;
		font-family: PingFangSC-Regular;
		font-size: 16px;
		line-height: 50px;
		padding: 10rpx 22rpx;
		justify-content: space-between;
	}

	.list-right {
		display: flex;
		padding: 0;
		color:#B2B3B2;
	}

	.info-list view:nth-child(1) image {
		width: 48px;
		height: 46px;
		padding: 2px;
	}

	.popup-mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: flex-end;
	}

	.popup-main {
		width: 100vw;
		background: #ffffff;
		padding: 32px 20px;
		height: 400rpx;
	}

	.popup-main-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24px;
		color: #000000;
		letter-spacing: 0;
		line-height: 36px;
	}

	.popup-main-header button {
		font-size: 16px;
		color: #5856d5;
		letter-spacing: 0;
		line-height: 28px;
		width: auto !important;
		background: transparent;
		margin: 0 !important;
	}

	.popup-main-input {
		background: #f4f5f9;
		padding: 14px 20px;
		margin: 20px 0;
		border-radius: 20px;
		border-radius: 20px;
	}

	.text {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #999999;
		letter-spacing: 0;
	}

	.butt {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding:50rpx;
		width:80%;
		margin:auto;
		>view{
			margin-bottom:40rpx;
		}
	}

	.quit-main {
		margin-top: 20px;
		width: 40%;
		height: 46px;
	}

	.popup-mask-avatar {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  H5  */
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		/*  #endif  */
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: flex-end;
	}

	.popup-main-avatar {
		width: 100vw;
		height: 54%;
		background: #ffffff;
		padding: 0 20px;
	}

	.popup-main-header-title-avatar {
		margin-bottom: 24px;
		padding-left: 10px;
		width: 104px;
		height: 25px;
	}

	.button-avatar {
		float: right;
		font-size: 16px;
		color: #5856d5;
		letter-spacing: 0;
		line-height: 25px;
		width: auto !important;
		background: transparent;
		margin-right: 28px;
		margin-top: 12px;
	}

	.image-list {
		width: 100%;
		height: 800px;
		overflow: hidden;
		padding-left: 12px;
	}

	.image-avatar {
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 10px;
		border-radius: 4px;
		border: 1px solid #ffffff;
	}

	.image-avatar-active {
		border: 1px solid #5856d5;
		border-radius: 4px;
		border-radius: 4px;
	}
</style>
