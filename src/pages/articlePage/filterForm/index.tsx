import React, { ChangeEvent, FormEvent } from "react";
import styles from "./index.module.css";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { AppThunkDispatch } from "@src/store";
import DatePicker from "react-datepicker";
import { articlesRequestParams, Status } from "article";
import { ArticleActions } from "@actions/articleActions";
import { ArticleCreators } from "@store/creators/articleCreators";
import Channel from "@shared/channel";

interface DispatchProps {
  // 获取文章列表
  requestArticles(
    reqParams: articlesRequestParams
  ): Promise<ArticleActions.Actions>;
}
interface OwnProps {
  // 文章列表请求的参数
  reqParams: articlesRequestParams;
  // 修改文章列表请求参数的方法
  updateReqParams: (reqParams: articlesRequestParams) => void;
}

type Props = OwnProps & DispatchProps;

class FilterForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    // 使以下方法中的 this 关键字指向当前类的实例对象
    this.onDateChanged = this.onDateChanged.bind(this);
    this.onStatusChanged = this.onStatusChanged.bind(this);
    this.onChannelChanged = this.onChannelChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // 当日期发生变化时执行
  onDateChanged(dates: (Date | null)[]) {
    this.props.updateReqParams({
      begin_pubdate: dates[0],
      end_pubdate: dates[1],
    });
  }

  // 当文章状态发生变化时执行
  onStatusChanged(event: ChangeEvent<HTMLInputElement>) {
    // 获取状态值并转换为数值
    const value = parseInt(event.currentTarget.value) as Status;
    // 更新文章状态类型
    this.props.updateReqParams({
      status: value === -1 ? undefined : value,
    });
  }

  // 当频道发生变化时执行过
  onChannelChanged(value: string) {
    this.props.updateReqParams({
      channel_id: value === "请选择文章频道" ? undefined : value,
    });
  }

  // 表单提交
  async onSubmit(event: FormEvent<HTMLFormElement>) {
    // 阻止表单提交时跳转的默认行为
    event.preventDefault();
    // 获取文章列表
    await this.props.requestArticles(this.props.reqParams);
  }
  // 渲染视图
  render() {
    const { reqParams } = this.props;
    return (
      <form className={styles.filterForm} onSubmit={this.onSubmit}>
        <div className="field is-horizontal mb-5">
          <div className="field-label">
            <label className="label">状态：</label>
          </div>
          <div className="field-body">
            <label className="radio mr-3">
              <input
                checked={reqParams.status === undefined}
                type="radio"
                name="status"
                className="mr-1"
                value={-1}
                onChange={this.onStatusChanged}
              />
              全部
            </label>
            <label className="radio mr-3">
              <input
                checked={reqParams.status === 0}
                value={0}
                type="radio"
                name="status"
                className="mr-1"
                onChange={this.onStatusChanged}
              />
              草稿
            </label>
            <label className="radio mr-3">
              <input
                checked={reqParams.status === 1}
                value={1}
                type="radio"
                name="status"
                className="mr-1"
                onChange={this.onStatusChanged}
              />
              待审核
            </label>
            <label className="radio mr-3">
              <input
                checked={reqParams.status === 2}
                value={2}
                type="radio"
                name="status"
                className="mr-1"
                onChange={this.onStatusChanged}
              />
              审核通过
            </label>
            <label className="radio mr-3">
              <input
                checked={reqParams.status === 3}
                value={3}
                type="radio"
                name="status"
                className="mr-1"
                onChange={this.onStatusChanged}
              />
              审核失败
            </label>
          </div>
        </div>
        <div className="field is-horizontal mb-5">
          <div className="field-label is-normal">
            <label className="label">频道：</label>
          </div>
          <div className="field-body">
            <Channel
              value={reqParams.channel_id}
              onChange={this.onChannelChanged}
            />
          </div>
        </div>
        <div className="field is-horizontal mb-5">
          <div className="field-label is-normal">
            <label className="label">日期：</label>
          </div>
          <div className="field-body">
            <DatePicker
              className="input"
              onChange={this.onDateChanged}
              startDate={reqParams.begin_pubdate}
              endDate={reqParams.end_pubdate}
              placeholderText={"请选择日期"}
              dateFormat={"yyyy-MM-dd"}
              selectsRange
              isClearable
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <button className="button is-link">筛选</button>
          </div>
          <div className="field-body"></div>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  // 获取文章列表
  requestArticles: (reqParams: articlesRequestParams) =>
    dispatch(ArticleCreators.requestArticles(reqParams)),
});

export default connect(null, mapDispatchToProps)(FilterForm);
