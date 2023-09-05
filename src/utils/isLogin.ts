import store from "@src/store";

export default async function isLogin(): Promise<boolean> {
  // 获取用户登录凭证
  const token = store.getState().userReducer.credentials.token;
  // 测试
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // 根据凭证是否存在返回布尔值
  return typeof token !== "undefined";
}
