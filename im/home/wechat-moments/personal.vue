<template>
  <view class="box">
    <view class="personal">
      <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_big_img@2x.png"></image>
      <view class="head">
        <text>欧克</text>
        <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x.png"></image>
      </view>
    </view>
    <view class="center">
      <view class="today">
        <text>今天</text>
        <image src="https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tx_img@2x(2).png"></image>
      </view>
      <view class="list">
        <view class="list__item" v-for="item in actionList">
          <view class="time">
            <text class="yrar">{{ item.year }}</text>
            <text class="day">{{ item.day }}</text>
          </view>
          <image :src="item.img"></image>
          <text @click="handleRouter(item)">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      actionList: [
        {
          img: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
          text: '我这么有趣，谁我这么有趣，谁我这么有趣，谁addfdff我这么有趣，谁我这么有趣，谁我这么有趣，谁addfdff',
          year: '2022年',
          day: '3/28',
        },
        {
          img: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
          text: '我这么有趣，谁错过我就是遗憾',
          year: '2022年',
          day: '3/28',
        },
        {
          img: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
          text: '我这么有趣，谁错过我就是遗憾',
          year: '2022年',
          day: '3/28',
        },
        {
          img: 'https://jw-uniapp.oss-cn-beijing.aliyuncs.com/static/moments/pyq_tp_img@2x.png',
          text: '我这么有趣，谁错过我就是遗憾',
          year: '2022年',
          day: '3/28',
        },
      ],
    };
  },
  methods: {
    handleRouter(item) {
      uni.navigateTo({
        url: '/im/home/wechat-moments/details?text=' + item.text + '&img=' + item.img,
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

.personal {
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
      color: #ffffff;
    }

    > image {
      width: 172rpx;
      height: 172rpx;
      margin-right: 40rpx;
    }
  }
}

.center {
  margin: 46rpx 32rpx 0 32rpx;

  .today {
    height: 140rpx;
    display: flex;

    > text {
      font-size: 44rpx;
      margin-right: 50rpx;
    }

    > image {
      width: 140rpx;
      height: 140rpx;
    }
  }

  .list {
    &__item {
      display: flex;
      margin-top: 60rpx;

      .time {
        width: 108rpx;
        display: flex;
        flex-direction: column;
        font-size: 32rpx;

        .day {
          color: #949494;
        }
      }

      > image {
        width: 170rpx;
        height: 170rpx;
        margin: 0 24rpx 0 24rpx;
      }

      > text {
        font-size: 32rpx;
        width: 52%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }
    }
  }
}
</style>
