/*
 * @Author: Jin Biao
 * @Date: 2022-04-20 08:06:39
 * @LastEditTime: 2022-04-20 08:50:31
 * @Description:
 */
 
export default {
  methods: {
    //setData polyfill 勿删!!!   (用于转换后的uniapp的项目能直接使用this.setData()函数)
    setData: function (obj, callback) {
      let that = this;
      const handleData = (tepData, tepKey, afterKey) => {
        var tepData2 = tepData;
        tepKey = tepKey.split(".");
        tepKey.forEach((item) => {
          if (tepData[item] === null || tepData[item] === undefined) {
            let reg = /^[0-9]+$/;
            tepData[item] = reg.test(afterKey) ? [] : {};
            tepData2 = tepData[item];
          } else {
            tepData2 = tepData[item];
          }
        });
        return tepData2;
      };
      const isFn = function (value) {
        return typeof value == "function" || false;
      };
      Object.keys(obj).forEach(function (key) {
        let val = obj[key];
        key = key.replace(/\]/g, "").replace(/\[/g, ".");
        let front, after;
        let index_after = key.lastIndexOf(".");
        if (index_after != -1) {
          after = key.slice(index_after + 1);
          front = handleData(that, key.slice(0, index_after), after);
        } else {
          after = key;
          front = that;
        }
        if (front.$data && front.$data[after] === undefined) {
          Object.defineProperty(front, after, {
            get() {
              return front.$data[after];
            },
            set(newValue) {
              front.$data[after] = newValue;
              that.hasOwnProperty("$forceUpdate") && that.$forceUpdate();
            },
            enumerable: true,
            configurable: true,
          });
          front[after] = val;
        } else {
          that.$set(front, after, val);
        }
      });
      // this.$forceUpdate();
      isFn(callback) && this.$nextTick(callback);
    },
  },
};
