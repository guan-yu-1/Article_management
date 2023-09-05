import { PublishArticleParams } from "article";
import { ArticleActions } from "@actions/articleActions";
import { ArticleTypes } from "@store/types/articleTypes";
import { Status } from "response";

// 文章详情状态对象
export interface ArticleState {
  article: {
    result: Partial<PublishArticleParams>;
    status: Status;
    error: string | null;
  };
}

// 初始状态
const initialState: ArticleState = {
  article: {
    result: {},
    status: "idle",
    error: null,
  },
};

export default function articleReducer(
  state: ArticleState = initialState,
  action: ArticleActions.Actions
): ArticleState {
  switch (action.type) {
    // 获取文章详情
    case ArticleTypes.REQUEST_ARTICLE:
      return {
        ...state,
        article: {
          ...state.article,
          result: {},
          status: "loading",
          error: null,
        },
      };
    // 获取文章详情成功
    case ArticleTypes.REQUEST_ARTICLE_SUCCESS:
      return {
        ...state,
        article: {
          ...state.article,
          result: action.payload.article,
          status: "success",
          error: null,
        },
      };
    // 获取文章详情失败
    case ArticleTypes.REQUEST_ARTICLE_ERROR:
      return {
        ...state,
        article: {
          ...state.article,
          result: {},
          status: "error",
          error: action.error,
        },
      };
    default:
      return state;
  }
}
