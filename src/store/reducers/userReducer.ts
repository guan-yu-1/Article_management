import { Credentials } from "auth";
import { UserTypes } from "@action_types/userTypes";
import { UserActions } from "@actions/userActions";
import { User } from "user";
import { Status } from "response";

// 用户状态
export interface UserState {
  // 用户登录凭据
  credentials: Partial<Credentials>;
  // 用户信息
  user: {
    result: Partial<User>;
    status: Status;
    error: string | null;
  };
}

// 状态初始值
const initialState: UserState = {
  // 用户登录凭据
  credentials: {},
  // 用户信息
  user: {
    result: {},
    status: "idle",
    error: null,
  },
};

export default function userReducer(
  state: UserState = initialState,
  action: UserActions.Actions
): UserState {
  switch (action.type) {
    // 保存用户登录凭据
    case UserTypes.SAVE_CREDENTIALS:
      return {
        ...state,
        credentials: action.payload.credentials,
      };
    // 请求用户信息
    case UserTypes.REQUEST_USER_INFO:
      return {
        ...state,
        user: {
          ...state.user,
          result: {},
          status: "loading",
          error: null,
        },
      };
    // 请求用户信息成功
    case UserTypes.REQUEST_USER_INFO_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          result: action.payload.user,
          status: "success",
          error: null,
        },
      };
    // 请求用户信息失败
    case UserTypes.REQUEST_USER_INFO_ERROR:
      return {
        ...state,
        user: {
          ...state.user,
          result: {},
          status: "error",
          error: action.error,
        },
      };
    // 清空用户信息
    case UserTypes.CLEAR_USER:
      return {
        ...state,
        credentials: {},
        user: {
          ...state.user,
          status: "idle",
          error: null,
          result: {},
        },
      };
    default:
      return state;
  }
}
