import React from "react";
import styles from "./index.module.css";
import Item from "@pages/articlePage/articles/item";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { ArticleActions } from "@actions/articleActions";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleCreators } from "@store/creators/articleCreators";
import { articlesRequestParams } from "article";
import { ArticlesState } from "@reducers/articlesReducer";
import Confirm from "@shared/confirm";
import { articleRemoveRequest } from "@requests/article";
import { Status } from "response";
import { AxiosError } from "axios";

interface StateProps {
  // 获取文章列表 Reducer
  articlesReducer: ArticlesState;
}
interface DispatchProps {
  // 获取文章列表
  requestArticles(
    reqParams?: articlesRequestParams
  ): Promise<ArticleActions.Actions>;
}
interface OwnProps {}

interface States {
  isOpen: boolean;
  id: string | null;
  removeRequestStatus: Status;
  removeRequestError: string | null;
}

type Props = OwnProps & StateProps & DispatchProps;

class List extends React.Component<Props, States> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      // 用于控制删除文章确认框是否渲染
      isOpen: false,
      // 用于存储要删除的文章 id
      id: null,
      // 记录删除文章请求的请求状态
      removeRequestStatus: "idle",
      // 记录删除文章请求的错误信息
      removeRequestError: null,
    };
    // 使以下方法中的 this 关键字指向当前类的实例
    this.open = this.open.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
  }

  // 渲染删除确认框并接收要删除的文章的 id
  open(id: string) {
    this.setState({
      isOpen: true,
      id,
    });
  }

  // 删除文章
  async removeArticle() {
    // 捕获请求错误
    try {
      // 判断要删除的文章 id 是否存在
      if (this.state.id === null) return;
      // 防止同一个请求被多次发送
      if (this.state.removeRequestStatus === "loading") return;
      // 更新请求状态
      this.setState({
        removeRequestStatus: "loading",
        removeRequestError: null,
      });
      // 执行删除请求
      await articleRemoveRequest(this.state.id);
      // 更新请求状态
      this.setState({
        removeRequestStatus: "success",
        removeRequestError: null,
      });
      // 重新获取文章列表
      await this.props.requestArticles();
    } catch (error) {
      if (error instanceof AxiosError) {
        // 更新请求状态
        this.setState({
          removeRequestStatus: "error",
          removeRequestError: error.response?.data.message,
        });
      }
      throw error;
    }
  }

  // 组件挂载完成之后
  async componentDidMount() {
    // 获取文章列表
    await this.props.requestArticles();
  }
  // 渲染文章列表
  renderArticles() {
    const { articlesReducer } = this.props;
    const { articles } = articlesReducer;
    switch (articles.status) {
      case "loading":
        return (
          <tr>
            <td colSpan={8}>
              <div className="is-flex is-justify-content-center is-size-4 p-6">
                <i className="fas fa-spinner fa-pulse"></i>
              </div>
            </td>
          </tr>
        );
      case "error":
        return (
          <tr>
            <td>
              <div className="is-flex is-justify-content-center is-size-4 p-6">
                {articles.error}
              </div>
            </td>
          </tr>
        );
      case "success":
        return articles.result.results?.map((article) => (
          <Item key={article.id} article={article} open={this.open} />
        ));
      default:
        return null;
    }
  }
  // 渲染视图
  render() {
    return (
      <>
        <div className={styles.articles}>
          <div
            className={`p-5 is-size-5 has-text-weight-medium ${styles.total}`}
          >
            根据筛选条件共查询到{" "}
            {this.props.articlesReducer.articles.result.total_count} 条结果：
          </div>
          <div className="pl-5 pr-5 mt-5">
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>封面</th>
                  <th>标题</th>
                  <th>状态</th>
                  <th>发布时间</th>
                  <th>阅读数</th>
                  <th>评论数</th>
                  <th>点赞数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>{this.renderArticles()}</tbody>
            </table>
          </div>
        </div>
        <Confirm
          isOpen={this.state.isOpen}
          close={() => this.setState({ isOpen: false })}
          onSureButtonClicked={this.removeArticle}
        >
          您确定要删除该文章吗?
        </Confirm>
      </>
    );
  }
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  // 获取文章列表 Reducer
  articlesReducer: state.articlesReducer,
});

const mapDispatchProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  // 获取文章列表
  requestArticles: (reqParams) =>
    dispatch(ArticleCreators.requestArticles(reqParams)),
});

export default connect(mapStateToProps, mapDispatchProps)(List);
