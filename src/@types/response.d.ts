declare module "response" {
  // 极客园服务端请求的返回值类型
  export interface GeekResponse<T> {
    // 消息提示
    message: string;
    // 数据
    data: T;
  }
  // 请求状态
  export type Status = "idle" | "loading" | "success" | "error";
  // 分页响应类型
  export interface Pagination<T> {
    page: number;
    per_page: number;
    total_count: number;
    results: T[];
  }
}
