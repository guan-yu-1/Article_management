declare module "user" {
  export interface User {
    id: string;
    // 头像
    photo: string;
    // 姓名
    name: "string";
    // 手机号
    mobile: string;
    // 性别: 0: 男 1: 女
    gender: 0 | 1;
    // 出生日期
    birthday: string;
  }
}
