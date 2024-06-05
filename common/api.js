// 获取菜单
export const fetchMenu = (params, config = {}) =>
  uni.$tn.http.get("/applet/index/getRecommendDocs", params, config);
// 医护登录
export const ApiLogin = async (params, config = {}) =>
  await uni.$tn.http.post("api/user/login", params, config);

// 上传图片
export const ApiUploadImage = async (params, config = {}) =>
  await uni.$tn.http.upload("api/common/upload", params, config);

// 获取转诊列表
export const ApiReferralLis = async (params, config = {}) =>
  await uni.$tn.http.get("api/referral/lis", { params }, config);

// 获取转诊详情
export const ApiReferralDetail = async (params, config = {}) =>
  await uni.$tn.http.get("api/referral/view", { params }, config);

// 获取转诊流程
export const ApiReferralFlow = async (params, config = {}) =>
  await uni.$tn.http.get("api/referral/flow", { params }, config);

// 提交转诊
export const ApiReferralApply = async (params, config = {}) =>
  await uni.$tn.http.post("api/referral/apply", params, config);

// 获取转诊消息
export const ApiReferralNotice = async (params, config = {}) =>
  await uni.$tn.http.get("api/referral/notice", { params }, config);
