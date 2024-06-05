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
				head: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/images/avatar.png'
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(option) {
			this.getFriend();
			this.getGroupMemberList(option);
			console.log(option);
			this.groupID = option.groupID;
		},

		methods: {
			point() {
				this.setData({
					friendList: ''
				});
			},
			// 选择框
			checkboxChange: function(e) {
				var values = e.detail.value;

				this.seldata = values;
				// for(let item of this.friendList){
				// 	console.log(item.userID,'66')
				// 	if(values.includes(item.userID)){
				// 		this.$set(item,'checked',true);
				// 		console.log(item.userID,'1')
				// 	}else{
				// 		this.$set(item,'checked',false)
				// 		console.log(item.userID,'2')
				// 	}
				// }
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
			// 获取群成员列表
			getGroupMemberList(option) {
				let promise = uni.$TUIKit.getGroupMemberList({
					groupID: option.groupID,
					count: 300,
					offset: 0
				}); // 从0开始拉取30个群成员
				promise
					.then(imResponse => {
						console.log(imResponse.data.memberList); // 群成员列表
						this.memberList = imResponse.data.memberList;
						console.log(this.list);
						this.list = this.list.filter(item => {
							let idList = this.memberList.map(v => v.userID);
							return !idList.includes(item.userID);
						});
						this.setData({
							friendList: this.list
						});
					})
					.catch(function(imError) {
						console.warn('getGroupMemberList error:', imError);
					});
			},
			// 点击右上角确定按钮
			onNavigationBarButtonTap: function(e) {
				console.log(this.groupID);
				console.log(this.seldata);
				if (this.seldata.length == 0) {
					uni.showToast({
						title: '请选择',
						icon: 'none'
					});
					return;
				}
				let promise = uni.$TUIKit.addGroupMember({
					groupID: this.groupID,
					userIDList: this.seldata
				});
				console.log(promise, 'promisepromise');
				console.log(promise.message);
				promise
					.then(function(imResponse) {
						console.log(imResponse.data.successUserIDList); // 添加成功的群成员 userIDList
						console.log(imResponse.data.failureUserIDList); // 添加失败的群成员 userIDList
						console.log(imResponse.data.existedUserIDList); // 已在群中的群成员 userIDList
						// 一个用户 userX 最多允许加入 N 个群，如果已经加入了 N 个群，此时再尝试添加 userX 为群成员，则 userX 不能正常加群
						// SDK 将 userX 的信息放入 overLimitUserIDList，供接入侧处理
						console.log(imResponse.data.overLimitUserIDList); // 超过了“单个用户可加入群组数”限制的用户列表，v2.10.2起支持
						console.log(imResponse.data.group); // 添加后的群组信息
						uni.showModal({
							title: '提示',
							content: '邀请成功',
							success: res => {
								if (res.confirm) {
									console.log('用户点击确定');
									uni.navigateBack({
										delta: 2
									});
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					})
					.catch(function(imError) {
						uni.showToast({
							title: imError,
							icon: 'error'
						});
						console.warn('addGroupMember error:', imError); // 错误信息
					});
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