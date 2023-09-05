import RequestManager from "@utils/RequestManager";
import { GeekResponse } from "response";
import { Channel } from "channel";

export function channelsRequest() {
  return RequestManager.instance.request<GeekResponse<{ channels: Channel[] }>>(
    { url: "/channels" }
  );
}
