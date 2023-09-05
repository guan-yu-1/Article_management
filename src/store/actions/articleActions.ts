import { ArticleTypes } from "@store/types/articleTypes";
import { Article, PublishArticleParams } from "article";
import { Pagination } from "response";

export namespace ArticleActions {
  // 获取文章列表
  export interface RequestArticles {
    type: ArticleTypes.REQUEST_ARTICLES;
  }
  // 获取文章列表成功
  export interface RequestArticlesSuccess {
    type: ArticleTypes.REQUEST_ARTICLES_SUCCESS;
    payload: { result: Pagination<Article> };
  }
  // 获取文章列表失败
  export interface RequestArticlesError {
    type: ArticleTypes.REQUEST_ARTICLES_ERROR;
    error: string | null;
  }
  // 获取文章详情
  export interface RequestArticle {
    type: ArticleTypes.REQUEST_ARTICLE;
  }
  // 获取文章详情成功
  export interface RequestArticleSuccess {
    type: ArticleTypes.REQUEST_ARTICLE_SUCCESS;
    payload: { article: PublishArticleParams };
  }
  // 获取文章详情失败
  export interface RequestArticleError {
    type: ArticleTypes.REQUEST_ARTICLE_ERROR;
    error: string | null;
  }

  export type Actions =
    | RequestArticles
    | RequestArticlesSuccess
    | RequestArticlesError
    | RequestArticle
    | RequestArticleSuccess
    | RequestArticleError;
}
