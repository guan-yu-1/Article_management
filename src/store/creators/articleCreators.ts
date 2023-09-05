import { articlesRequestParams } from "article";
import { ThunkAction } from "redux-thunk";
import { ArticleActions } from "@actions/articleActions";
import { AppState } from "@src/store";
import { ArticleTypes } from "@store/types/articleTypes";
import { articleRequest, articlesRequest } from "@requests/article";
import { AxiosError } from "axios";

export namespace ArticleCreators {
  // 获取文章列表
  export const requestArticles =
    (
      reqParams?: articlesRequestParams
    ): ThunkAction<
      Promise<ArticleActions.Actions>,
      AppState,
      any,
      ArticleActions.Actions
    > =>
    async (dispatch) => {
      // 更新请求状态
      dispatch({ type: ArticleTypes.REQUEST_ARTICLES });
      // 捕获请求错误
      try {
        // 发送请求获取文章列表
        const response = await articlesRequest(reqParams);
        // 更新请求状态 保存文章列表状态
        return dispatch({
          type: ArticleTypes.REQUEST_ARTICLES_SUCCESS,
          payload: { result: response.data },
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          // 更新请求状态 保存错误信息
          return Promise.reject(
            dispatch({ type: ArticleTypes.REQUEST_ARTICLES_ERROR, error: "" })
          );
        }
        return Promise.reject(error);
      }
    };

  // 获取文章详情
  export const requestArticle =
    (
      id: string
    ): ThunkAction<
      Promise<ArticleActions.Actions>,
      AppState,
      any,
      ArticleActions.Actions
    > =>
    async (dispatch) => {
      // 更新请求状态
      dispatch({ type: ArticleTypes.REQUEST_ARTICLE });
      // 捕获请求错误
      try {
        // 发送请求获取文章详情
        const response = await articleRequest(id);
        // 更新请求状态保存文章详情
        return dispatch({
          type: ArticleTypes.REQUEST_ARTICLE_SUCCESS,
          payload: { article: response.data },
        });
      } catch (error) {
        // 判断错误对象类型
        if (error instanceof AxiosError) {
          // 更新请求状态保存错误信息
          return Promise.reject(
            dispatch({
              type: ArticleTypes.REQUEST_ARTICLE_ERROR,
              error: error.response?.data.message,
            })
          );
        }
        return Promise.reject(error);
      }
    };
}
