<template>
  <view class="box">
    <view class="moment">
      <view class="moment-head">
        <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x(1).png"></image>
        <view class="text">
          <text class="nick">欧克</text>
          <text class="word">{{ info.text }}</text>
        </view>
      </view>
      <view class="moment-center">
        <image :src="info.img"></image>
        <view class="place">
          <text>地点位置</text>
        </view>
        <view class="list-bottom">
          <text class="time">几分钟前</text>
          <view class="frame" v-show="!show">
            <view class="spot">
              <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_zan_icon@2x.png"></image>
              <text>赞</text>
            </view>
            <view class="save">
              <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_pl_icon@2x.png"></image>
              <text>评论</text>
            </view>
          </view>
          <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_gd_icon@2x.png" @click="show = !show"></image>
        </view>
        <view class="peoLike">
          <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_xh_icon@2x.png"></image>
          <text>张三</text>
        </view>
      </view>
    </view>
    <view class="line"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      info: '',
    };
  },
  onLoad(info) {
    console.log(info);
    this.info = info;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}
text {
  font-family: PingFangSC-Medium;
}
image {
  display: block;
}

.moment {
  margin-left: 32rpx;
  margin-right: 40rpx;
  .moment-head {
    display: flex;
    margin-top: 26rpx;
    > image {
      width: 90rpx;
      height: 90rpx;
      margin-right: 26rpx;
    }
    .text {
      display: flex;
      flex-direction: column;
      width: 80%;
      & .nick {
        color: #007aff;
        margin-bottom: 8rpx;
      }
    }
  }
  .moment-center {
    margin-left: 116rpx;
    > image {
      width: 500rpx;
      height: 500rpx;
      margin: 42rpx 0 0 0;
    }
    .place {
      font-size: 24rpx;
      line-height: 84rpx;
      color: #007aff;
    }
    .list-bottom {
      display: flex;
      justify-content: space-between;
      height: 70rpx;
      & image {
        width: 40rpx;
        height: 40rpx;
        margin-top: 8rpx;
      }
      .time {
        color: #cccacc;
      }
      .ad {
        color: #007aff;
      }
      .frame {
        width: 276rpx;
        height: 56rpx;
        display: flex;
        justify-content: space-around;
        background-color: #627df7;
        border-radius: 10rpx;
        margin-right: -100rpx;
        .spot {
          display: flex;
          line-height: 56rpx;
        }
        .save {
          display: flex;
          line-height: 56rpx;
        }
        & text {
          margin-left: 15rpx;
          color: #ffffff;
        }
      }
    }
    .peoLike {
      height: 66rpx;
      background-color: #fbf8fb;
      display: flex;
      border-radius: 6rpx;
      line-height: 66rpx;
      > image {
        width: 30rpx;
        height: 30rpx;
        margin: 16rpx 10rpx 0 20rpx;
      }
      > text {
        font-size: 32rpx;
        color: #627df7;
      }
    }
  }
}
.line {
  height: 4rpx;
  margin-top: 30rpx;
  background-color: #fbf8fb;
}
</style>
