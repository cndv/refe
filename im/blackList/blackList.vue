<template>
	<view class="box">
		<u-swipe-action v-if="blackList.length > 0">
			<u-swipe-action-item :threshold="60" :options="options1" v-for="item in blackList" @click="remove(item.userID)"
				:autoClose="true">
				<view class="swipe-action u-border-top u-border-bottom" @tap="handleRoute(item.userID)">
					<view class="swipe-action__content">
						<view class="list">
							<view class="list__item">
								<image class="list__item__avatar" :src="item.avatar || head"></image>
								<text class="list__item__user-name">{{ item.userID }}</text>
							</view>
							<u-line></u-line>
						</view>
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
		<u-empty v-else text="黑名单没有人" marginTop="50%"
			icon="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/moreImg.png"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				blackList: '',
				head: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png',
				options1: [{
					text: '移除',
					style: {
						backgroundColor: '#f56c6c',
					},
				}, ],
			};
		},
		onLoad() {
			this.getBlacklist();
		},
		methods: {
			// 移除黑名单
			remove(id) {
				uni.showModal({
					title: '提示',
					content: '确定是否移除黑名单',
					success: res => {
						if (res.confirm) {
							const promise = uni.$TUIKit.removeFromBlacklist({
								userIDList: [id],
							}); // 请注意：即使只从黑名单中移除一个用户帐号，也需要用数组类型，例如：userIDList: ['user1']
							promise
								.then(imResponse => {
									console.log(imResponse.data); // 从黑名单中成功移除的账号列表，结构为包含用户 userID 的数组 - [userID]
									const blackList = imResponse.data;
									// 获取黑名单里好友的信息
									uni.$TUIKit
										.getUserProfile({
											userIDList: blackList, // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
										})
										.then(imResponse => {
											console.log(imResponse.data); // 存储用户资料的数组 - [Profile]
											this.blackList = imResponse.data;
										});
								})
								.catch(function(imError) {
									console.warn('removeFromBlacklist error:', imError); // 将用户从黑名单中移除失败的相关信息
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},
			// 跳转信息页面
			handleRoute(id) {
				const promise = uni.$TUIKit.getUserProfile({
					userIDList: [id], // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
				});
				promise
					.then(imResponse => {
						const avatar = imResponse.data[0].avatar;
						uni.navigateTo({
							url: '/im/information/information?id=' + id + '&url=' + avatar + '&index=3',
						});
						// this.blackList = imResponse.data;
					})
					.catch(function(imError) {
						console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
					});
			},
			// 获取黑名单列表
			getBlacklist() {
				const promise = uni.$TUIKit.getBlacklist();
				promise
					.then(imResponse => {
						console.log(imResponse.data); // 我的黑名单列表，结构为包含用户 userID 的数组 - [userID]
						const blackList = imResponse.data;
						// 获取黑名单里好友的信息
						const promise = uni.$TUIKit.getUserProfile({
							userIDList: blackList, // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
						});
						promise
							.then(imResponse => {
								console.log(imResponse.data); // 存储用户资料的数组 - [Profile]
								this.blackList = imResponse.data;
							})
							.catch(function(imError) {
								console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
							});
					})
					.catch(function(imError) {
						console.warn('getBlacklist error:', imError); // 获取黑名单列表失败的相关信息
					});
			},
		},
	};
</script>

<style lang="scss">
	.list {
		&__item {
			padding: 16px 12px;
			align-items: center;

			&__avatar {
				height: 35px;
				width: 35px;
				border-radius: 3px;
			}

			&__user-name {
				font-size: 16px;
				margin-left: 10px;
				color: $u-main-color;
			}
		}
	}
</style>