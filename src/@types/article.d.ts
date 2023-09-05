declare module "article" {
  // 获取文章列表-请求参数
  export interface articlesRequestParams {
    // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，不传为全部 -1 全部
    status?: Status;
    // 频道 id
    channel_id?: string;
    // 起始时间
    begin_pubdate?: Date | null;
    // 截止时间
    end_pubdate?: Date | null;
    // 页码
    page?: number;
    // 每页数量
    per_page?: number;
  }
  // 文章状态
  export type Status = 0 | 1 | 2 | 3 | -1;
  // 获取文章列表-响应对象
  export interface Article {
    id: string;
    // 文章标题
    title: string;
    // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败
    status: Status;
    // 评论数量
    comment_count: number;
    // 发布时间
    pubdate: string;
    // 文章封面
    cover: Cover;
    // 点赞数
    like_count: number;
    // 阅读数
    read_count: number;
    // 文章内容
    content: string;
    // 文章频道id
    channel_id: string;
  }
  // 文章封面类型
  export interface Cover {
    //  封面类型: 0: 无封面 1: 1张封面图片 3: 3张封面
    type: 0 | 1 | 3;
    // 封面列表
    images: string[];
  }
  // 发布文章时请求参数的类型
  export type PublishArticleParams = Pick<
    Article,
    "title" | "cover" | "content" | "channel_id"
  >;
}
