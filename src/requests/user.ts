import RequestManager from "@utils/RequestManager";
import { GeekResponse } from "response";
import { User } from "user";

// 获取用户信息
export function userInfoRequest() {
  return RequestManager.instance.request<GeekResponse<User>>({
    url: "/user/profile",
  });
}
