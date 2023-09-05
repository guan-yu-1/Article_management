import { ChannelActions } from "@actions/channelActions";
import { Status } from "response";
import { ChannelTypes } from "@store/types/channelTypes";
import { Channel } from "channel";

export interface ChannelState {
  channels: {
    result: Channel[];
    status: Status;
    error: string | null;
  };
}

const initialState: ChannelState = {
  channels: {
    result: [],
    status: "idle",
    error: null,
  },
};

export default function channelReducer(
  state: ChannelState = initialState,
  action: ChannelActions.Actions
): ChannelState {
  switch (action.type) {
    // 获取频道列表
    case ChannelTypes.REQUEST_CHANNEL:
      return {
        ...state,
        channels: {
          result: [],
          error: null,
          status: "loading",
        },
      };
    // 获取频道列表成功
    case ChannelTypes.REQUEST_CHANNEL_SUCCESS:
      return {
        ...state,
        channels: {
          result: action.payload.channels,
          status: "success",
          error: null,
        },
      };
    // 获取频道列表失败
    case ChannelTypes.REQUEST_CHANNEL_ERROR:
      return {
        ...state,
        channels: {
          ...state.channels,
          result: [],
          error: action.error,
          status: "error",
        },
      };
    default:
      return state;
  }
}
