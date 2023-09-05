import { UserTypes } from "@action_types/userTypes";
import { Credentials } from "auth";
import { User } from "user";

export namespace UserActions {
  // 保存用户登录凭据
  export interface SaveCredentials {
    type: UserTypes.SAVE_CREDENTIALS;
    payload: {
      credentials: Credentials;
    };
  }
  // 获取用户信息
  export interface RequestUserInfo {
    type: UserTypes.REQUEST_USER_INFO;
  }
  // 获取用户信息成功
  export interface RequestUserInfoSuccess {
    type: UserTypes.REQUEST_USER_INFO_SUCCESS;
    payload: { user: User };
  }
  // 获取用户信息失败
  export interface RequestUserInfoError {
    type: UserTypes.REQUEST_USER_INFO_ERROR;
    error: string | null;
  }

  // 清空用户信息
  export interface ClearUser {
    type: UserTypes.CLEAR_USER;
  }

  // User Actions
  export type Actions =
    | SaveCredentials
    | RequestUserInfo
    | RequestUserInfoSuccess
    | RequestUserInfoError
    | ClearUser;
}
