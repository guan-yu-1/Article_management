import RequestManager from "@utils/RequestManager";
import { Auth, Credentials } from "auth";
import { GeekResponse } from "response";

// 用于实现登录功能
export function loginRequest(auth: Auth) {
  return RequestManager.instance.request<GeekResponse<Credentials>, Auth>({
    url: "/authorizations",
    method: "post",
    data: auth,
  });
}
