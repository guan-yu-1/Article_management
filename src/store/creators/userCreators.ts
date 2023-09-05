import { UserTypes } from "@store/types/userTypes";
import { Credentials } from "auth";
import { UserActions } from "@actions/userActions";
import { ThunkAction } from "redux-thunk";
import { AppState } from "@src/store";
import { userInfoRequest } from "@requests/user";
import { AxiosError } from "axios";

export namespace UserCreators {
  // 保存用户登录凭据
  export const saveCredentials = (
    credentials: Credentials
  ): UserActions.SaveCredentials => ({
    type: UserTypes.SAVE_CREDENTIALS,
    payload: { credentials },
  });

  // 请求用户信息
  export const requestUserInfo =
    (): ThunkAction<
      Promise<UserActions.Actions>,
      AppState,
      any,
      UserActions.Actions
    > =>
    async (dispatch) => {
      // 更新请求状态
      dispatch({ type: UserTypes.REQUEST_USER_INFO });
      // 捕获请求错误
      try {
        // 获取用户信息
        const response = await userInfoRequest();
        // 保存用户信息
        return dispatch({
          type: UserTypes.REQUEST_USER_INFO_SUCCESS,
          payload: { user: response.data },
        });
      } catch (error) {
        // 保存请求失败信息
        if (error instanceof AxiosError) {
          return Promise.reject(
            dispatch({
              type: UserTypes.REQUEST_USER_INFO_ERROR,
              error: error.response?.data.message,
            })
          );
        }
        // 抛出异常
        return Promise.reject(error);
      }
    };

  // 清空用户信息
  export const clearUser = (): UserActions.ClearUser => ({
    type: UserTypes.CLEAR_USER,
  });
}
