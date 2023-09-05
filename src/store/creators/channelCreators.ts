import { ThunkAction } from "redux-thunk";
import { ChannelActions } from "@actions/channelActions";
import { AppState } from "@src/store";
import { ChannelTypes } from "@store/types/channelTypes";
import { channelsRequest } from "@requests/channel";
import { AxiosError } from "axios";

export namespace ChannelCreators {
  // 获取频道列表
  export const requestChannel =
    (): ThunkAction<
      Promise<ChannelActions.Actions>,
      AppState,
      any,
      ChannelActions.Actions
    > =>
    async (dispatch) => {
      // 更新请求状态
      dispatch({ type: ChannelTypes.REQUEST_CHANNEL });
      // 捕获请求错误
      try {
        // 发送请求获取频道列表
        const response = await channelsRequest();
        // 保存频道列表状态
        return dispatch({
          type: ChannelTypes.REQUEST_CHANNEL_SUCCESS,
          payload: {
            channels: response.data.channels,
          },
        });
      } catch (error) {
        // 响应错误
        if (error instanceof AxiosError) {
          // 保存错误信息
          return Promise.reject(
            dispatch({
              type: ChannelTypes.REQUEST_CHANNEL_ERROR,
              error: error.response?.data.message,
            })
          );
        }
        // 抛出异常
        return Promise.reject(error);
      }
    };
}
