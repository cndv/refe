<template>
  <view :class="'text-message ' + (isMine ? 'my-text' : '')">
    <view v-for="(item, index) in renderDom" :key="index" class="message-body-span">
      <span class="message-body-span-text" v-if="item.name === 'span'">{{ item.text }}</span>
      <image v-if="item.name === 'img'" class="emoji-icon" :src="item.src"></image>
    </view>
  </view>
</template>

<script>
import { parseText } from '../../../base/message-facade';

export default {
  data() {
    return {
      renderDom: [],
    };
  },

  components: {},
  props: {
    message: {
      type: Object,
    },
    isMine: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    message: {
      handler: function (newVal) {
        this.setData({
          renderDom: parseText(newVal),
        });
      },
      immediate: true,
      deep: true,
    },
  },

  beforeMount() {
    // 在组件实例进入页面节点树时执行
  },

  destroyed() {
    // 在组件实例被从页面节点树移除时执行
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.text-message {
  display: inline-flex;
  max-width: 60vw;
  line-height: 52rpx;
  padding: 12rpx 24rpx;
  background: #f8f8f8;
  border: 1px solid #d9d9d9;
  border-radius: 2px 10px 10px 10px;
}
.my-text {
  border-radius: 10px 2px 10px 10px;
  // border: 1px solid rgba(0, 110, 255, 0.3);
  background: linear-gradient(to right, #6665f6, #fa709a);
  .message-body-span-text {
    color: #fff !important;
  }
}
.message-body-span {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  outline: none;
  font-size: 28rpx;
  color: #333333;
  position: relative;
  max-width: 60vw;
}
.message-body-span-text {
  width: 100%;
  display: inline;
  word-wrap: break-word;
  word-break: break-all;
}
.message-body-span-image {
  display: inline-block;
  width: 32rpx;
  height: 32rpx;
  margin: 0 4rpx;
}
.emoji-icon {
  width: 20px;
  height: 20px;
}
</style>
