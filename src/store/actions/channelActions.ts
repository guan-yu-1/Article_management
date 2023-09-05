import { ChannelTypes } from "@store/types/channelTypes";
import { Channel } from "channel";

export namespace ChannelActions {
  // 获取频道列表
  export interface RequestChannel {
    type: ChannelTypes.REQUEST_CHANNEL;
  }
  // 获取频道列表成功
  export interface RequestChannelSuccess {
    type: ChannelTypes.REQUEST_CHANNEL_SUCCESS;
    payload: { channels: Channel[] };
  }
  // 获取频道列表失败
  export interface RequestChannelError {
    type: ChannelTypes.REQUEST_CHANNEL_ERROR;
    error: string | null;
  }

  export type Actions =
    | RequestChannel
    | RequestChannelSuccess
    | RequestChannelError;
}
