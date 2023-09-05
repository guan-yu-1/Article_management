import React from "react";
import Breadcrumb from "@pages/articlePage/breadcrumb";
import FilterForm from "@pages/articlePage/filterForm";
import Articles from "@pages/articlePage/articles/list";
import Pagination from "@pages/articlePage/pagination";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { articlesRequestParams } from "article";
import { ArticlesState } from "@reducers/articlesReducer";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleActions } from "@actions/articleActions";
import { ArticleCreators } from "@store/creators/articleCreators";

interface StateProps {
  articleReducer: ArticlesState;
}
interface DispatchProps {
  // 获取文章列表
  requestArticles(
    reqParams: articlesRequestParams
  ): Promise<ArticleActions.Actions>;
}
interface OwnProps {}

type Props = OwnProps & StateProps & DispatchProps;

interface States {
  reqParams: articlesRequestParams;
}

class ArticlePage extends React.Component<Props, States> {
  // 构造函数
  constructor(props: Readonly<Props>) {
    super(props);
    // 组件状态
    this.state = {
      // 文章列表请求的参数
      reqParams: {
        // 开始日期
        begin_pubdate: null,
        // 结束日期
        end_pubdate: null,
        // 当前页
        page: 1,
        // 每页显示数据条数
        per_page: 10,
        // 文章状态
        status: undefined,
        // 频道列表
        channel_id: undefined,
      },
    };
    // 使以下方法中的 this 关键字指向当前类的实例
    this.updateReqParams = this.updateReqParams.bind(this);
  }
  // 用于更新文章列表请求参数状态
  updateReqParams(reqParams: articlesRequestParams) {
    this.setState({
      reqParams: { ...this.state.reqParams, ...reqParams },
    });
  }
  // 组件更新后执行
  async componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<States>,
    snapshot?: any
  ) {
    // 监听页码是否发生变化
    if (
      prevState.reqParams.page !== this.state.reqParams.page ||
      prevState.reqParams.per_page !== this.state.reqParams.per_page
    ) {
      // 请求文章列表
      await this.props.requestArticles(this.state.reqParams);
    }
  }

  // 渲染视图
  render() {
    const { reqParams } = this.state;
    const { articleReducer } = this.props;
    return (
      <>
        <div className="has-background-white mb-5">
          <Breadcrumb />
          <FilterForm
            reqParams={this.state.reqParams}
            updateReqParams={this.updateReqParams}
          />
        </div>
        <div className="has-background-white">
          <Articles />
          <Pagination
            page={reqParams.page || 1}
            per_page={reqParams.per_page || 10}
            total_count={articleReducer.articles.result.total_count || 0}
            maxPageNum={5}
            updateReqParams={this.updateReqParams}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  articleReducer: state.articlesReducer,
});

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  requestArticles: (reqParams) =>
    dispatch(ArticleCreators.requestArticles(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
