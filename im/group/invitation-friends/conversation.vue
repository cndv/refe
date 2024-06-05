<template>
	<view class="box">
		<view class="search">
			<view class="search-bar">
				<image class="pic" src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/assets/serach-icon.svg"></image>
				<input class="inp" :value="userID" placeholder="请输入用户ID" @input="userIDInput" @confirm="getuserProfile"
					@blur="getuserProfile" @click="point" />
			</view>
		</view>
		<view class="uni-list">
			<checkbox-group @change="checkboxChange">
				<label class="list" v-for="(item, index) of friendList" :key="index">
					<view class="check">
						<checkbox class="check-bok" :value="item.userID" :checked="item.checked" />
					</view>
					<view class="friend">
						<image class="friend-avatar" :src="item.avatar || head"></image>
						<view>
							<view class="friend-nick">{{ item.nick }}</view>
							<view class="friend-userID">用户ID：{{ item.userID }}</view>
						</view>
					</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userID: '',
				friendList: '',
				memberList: '',
				seldata: [],
				groupID: '',
				head: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png',
				option: ''
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(option) {
			this.option = option;
			this.getFriend();
			this.groupID = option.groupID;
			this.showMoreHandler();
		},

		methods: {
			showMoreHandler() {
				uni.$TUIKit
					.getGroupMemberList({
						groupID: this.option.groupID.split('GROUP')[1],
						count: 50,
						offset: 0
					}) // 从0开始拉取30个群成员
					.then(imResponse => {
						console.log(imResponse.data.memberList, '22222');

						this.friendList = imResponse.data.memberList;
					});
			},
			point() {
				this.setData({
					friendList: ''
				});
			},
			// 选择框
			checkboxChange: function(e) {
				var values = e.detail.value;
				this.seldata = values;
			},
			// 获取好友列表
			getFriend() {
				let promise = uni.$TUIKit.getFriendList();
				promise
					.then(imResponse => {
						this.list = imResponse.data; // 好友列表
					})
					.catch(function(imError) {
						console.warn('getFriendList error:', imError); // 获取好友列表失败的相关信息
					});
			},

			// 点击右上角确定按钮
			onNavigationBarButtonTap: function(e) {
				if (this.seldata.length == 0) {
					uni.showToast({
						title: '请选择',
						icon: 'none'
					});
					return;
				}

				console.log(this.option.groupID.split('GROUP')[1]);
				console.log(this.seldata);
				console.log('callMediaType:', Number(this.option.callMediaType));
				uni.$TUICallKit.groupCall({
						groupID: this.option.groupID.split('GROUP')[1],
						userIDList: this.seldata,
						callMediaType: Number(this.option.callMediaType)
					},
					res => {
						if (res.code === 0) {
							console.log('groupCall success');
						} else {
							console.log(`error${res.msg}`);
						}
					}
				);
			},
			userIDInput(e) {
				console.log(e.detail.value);
				this.userID = e.detail.value;
			},
			getuserProfile() {
				uni.$TUIKit
					.getUserProfile({
						userIDList: [this.userID]
					})
					.then(imRes => {
						if (imRes.data.length > 0) {
							console.log(imRes.data);
							this.friendList = imRes.data;
						} else {
							uni.showToast({
								title: '用户不存在',
								icon: 'error'
							});
							this.userID = '';
						}
					});
			}
		}
	};
</script>
<style scoped>
	.box {
		width: 100vw;
		height: 100vh;
		background-color: #f4f5f9;
	}

	.search {
		width: 100%;
		padding: 20rpx 0;
	}

	.search-bar {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		margin-left: 40rpx;
		width: 670rpx;
		height: 80rpx;
		background: #ffffff;
		border-radius: 20rpx;
	}

	.pic {
		display: inline-block;
		margin-left: 24rpx;
		width: 48rpx;
		height: 48rpx;
	}

	.inp {
		margin-left: 16rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		width: 100%;
		display: inline-block;
	}

	.list {
		display: flex;
		flex-wrap: nowrap;
		width: 750rpx;
		height: 150rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #eef0f3;
	}

	.check {
		height: 150rpx;
		line-height: 150rpx;
		margin: 0 20rpx;
	}

	.choose {
		margin-left: 40rpx;
		margin-right: 40rpx;
		margin-top: 52rpx;
		margin-bottom: 50rpx;
		width: 48rpx;
		height: 48rpx;
	}

	.friend {
		width: 622rpx;
		display: flex;

		align-items: center;
	}

	.friend-avatar {
		width: 96rpx;
		height: 96rpx;
		margin-right: 24rpx;
	}

	.friend-nick {
		color: #333333;
		line-height: 50rpx;
		font-size: 36rpx;
		margin-bottom: 4rpx;
	}

	.friend-userID {
		color: #999999;
		line-height: 40rpx;
		font-size: 28rpx;
	}
</style>