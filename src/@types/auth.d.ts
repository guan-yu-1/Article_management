declare module "auth" {
  // 登录标识
  export interface Auth {
    // 手机号
    mobile: string;
    // 验证码
    code: string;
  }
  // 登录请求返回值类型
  export interface Credentials {
    // 登录凭据, 有效期2小时
    token: string;
    // token过期后可以使用 refresh_token 获取新的token, 有效期14天
    refresh_token: string;
  }
}
