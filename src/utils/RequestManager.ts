import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import store from "@store/index";
import { history } from "@src/AppRouter";

interface requestInstance extends AxiosInstance {
  request<T, D>(config: AxiosRequestConfig<D>): Promise<T>;
}

export default class RequestManager {
  // 单例对象
  private static _singleton_object: undefined | RequestManager;
  // 用于保存 axios 实例对象的属性
  private readonly _axios_instance: requestInstance;
  // 创建私有构造函数防止外部创建类实例
  private constructor() {
    // 创建 axios 实例对象
    this._axios_instance = axios.create({
      // 请求基准地址
      baseURL: process.env.REACT_APP_BASE_URL,
    });
    // 请求拦截器: 身份验证
    this._axios_instance.interceptors.request.use(this._authentication);
    // 响应拦截器: 获取服务端响应状态
    this._axios_instance.interceptors.response.use(
      this._getServerResponse,
      this._unauthorized
    );
  }
  // 用于获取单例对象的静态方法
  public static get instance() {
    // 如果单例对象不存在
    if (typeof RequestManager._singleton_object === "undefined") {
      // 创建单例对象
      RequestManager._singleton_object = new RequestManager();
    }
    // 返回单例对象
    return RequestManager._singleton_object;
  }
  // 身份验证
  private _authentication(config: AxiosRequestConfig) {
    // 获取状态对象
    const state = store.getState();
    // 获取身份验证标识 token 字符串
    const token = state.userReducer.credentials.token;
    // 如果本地存在 token, 将 token 添加至请求头
    if (token && config.headers)
      config.headers.Authorization = `Bearer ${token}`;
    // 返回配置
    return config;
  }
  // 获取服务端响应状态
  private _getServerResponse(response: AxiosResponse) {
    return response.data;
  }
  // 未授权
  private _unauthorized(error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        history.replace("/login");
      }
    }
    // 传递错误状态
    return Promise.reject(error);
  }
  // 外部用于发送请求的方法
  public request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    return this._axios_instance.request<T, D>(config);
  }
}
