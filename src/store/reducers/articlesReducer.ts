import { ArticleActions } from "@actions/articleActions";
import { Article } from "article";
import { Pagination, Status } from "response";
import { ArticleTypes } from "@store/types/articleTypes";

// 状态类型
export interface ArticlesState {
  // 文章列表
  articles: {
    result: Partial<Pagination<Article>>;
    status: Status;
    error: string | null;
  };
}

// 初始状态
const initialState: ArticlesState = {
  // 文章列表
  articles: {
    result: {},
    status: "idle",
    error: null,
  },
};

export default function articlesReducer(
  state: ArticlesState = initialState,
  action: ArticleActions.Actions
): ArticlesState {
  switch (action.type) {
    // 获取文章列表
    case ArticleTypes.REQUEST_ARTICLES:
      return {
        ...state,
        articles: {
          ...state.articles,
          result: {},
          status: "loading",
          error: null,
        },
      };
    // 获取文章列表成功
    case ArticleTypes.REQUEST_ARTICLES_SUCCESS:
      return {
        ...state,
        articles: {
          ...state.articles,
          status: "success",
          error: null,
          result: action.payload.result,
        },
      };
    // 获取文章列表失败
    case ArticleTypes.REQUEST_ARTICLES_ERROR:
      return {
        ...state,
        articles: {
          ...state.articles,
          status: "error",
          error: action.error,
          result: {},
        },
      };
    default:
      return state;
  }
}
