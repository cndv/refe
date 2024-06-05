<template>
  <view class="box">
    <view class="moment-top">
      <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_bg_img@2x.png"></image>
      <view class="head" @tap="handleRouter">
        <text>张三</text>
        <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x.png"></image>
      </view>
    </view>
    <view class="moment-list" v-for="item in momentList">
      <view class="moment-list-head">
        <image :src="item.url"></image>
        <view class="text">
          <text class="nick">{{ item.nick }}</text>
          <text class="word">{{ item.word }}</text>
        </view>
      </view>
      <view class="moment-list-center">
        <image :src="item.pic"></image>
        <view class="list-bottom">
          <text class="time">几分钟前</text>
          <text class="ad" v-show="show">广告</text>
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
      </view>
      <view class="line"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      momentList: [
        {
          url: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x(1).png',
          nick: '张三',
          word: '你好，你好呀，你好啊',
          pic: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
        },
        {
          url: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x(1).png',
          nick: '张三',
          word: '你好，你好呀，你好啊',
          pic: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
        },
        {
          url: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x(1).png',
          nick: '张三',
          word: '你好，你好呀，你好啊',
          pic: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
        },
      ],
    };
  },
  methods: {
    handleRouter() {
      console.log(1);
      uni.navigateTo({
        url: '/im/home/wechat-moments/personal',
      });
    },
  },
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
.moment-top {
  > image {
    width: 100%;
    height: 464rpx;
    display: block;
  }
  .head {
    display: flex;
    justify-content: flex-end;
    z-index: 2;
    margin-top: -86rpx;
    > text {
      position: relative;
      font-size: 32rpx;
      line-height: 86rpx;
      margin: 0 26rpx;
    }
    > image {
      width: 172rpx;
      height: 172rpx;
      margin-right: 40rpx;
    }
  }
}
.moment-list {
  margin-left: 32rpx;
  margin-right: 40rpx;
  .moment-list-head {
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
      & .nick {
        color: #007aff;
        margin-bottom: 8rpx;
      }
    }
  }
  .moment-list-center {
    margin-left: 116rpx;
    > image {
      width: 500rpx;
      height: 500rpx;
      margin: 42rpx 0;
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
  }
  .line {
    width: 100%;
    height: 4rpx;
    background-color: #fbf8fb;
  }
}
</style>
