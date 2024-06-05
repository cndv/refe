<template>
  <view class="TUI-ImageMessage" @tap="previewImage">
    <image
      :class="'image-message ' + (isMine ? 'my-image' : '')"
      mode="widthFix"
      :src="renderDom[0].src"
    ></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      renderDom: [],
      percent: 0,
    };
  },

  components: {},
  props: {
    message: {
      type: Object,
      default: "",
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
          renderDom: this.parseImage(newVal),
          percent: newVal.percent,
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    parseImage(message) {
      const renderDom = [
        {
          name: "image",
          // 这里默认渲染的是 1080P 的图片
          src: message.payload.imageInfoArray[0].url,
        },
      ];
      return renderDom;
    },
    previewImage() {
      uni.previewImage({
        current: this.renderDom[0].src,
        // 当前显示图片的http链接
        urls: [this.renderDom[0].src],
      });
    },
  },
};
</script>
<style>
@import "./index.css";
</style>
