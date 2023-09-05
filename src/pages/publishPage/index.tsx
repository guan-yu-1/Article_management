import React, { ChangeEvent, FormEvent } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import styles from "./index.module.css";
import { PublishArticleParams } from "article";
import { Status } from "response";
import Channel from "@shared/channel";
import {
  publishArticleRequest,
  updateArticleRequest,
  uploadRequest,
} from "@requests/article";
import { AxiosError, AxiosProgressEvent } from "axios";
import classNames from "classnames";
import { toast } from "react-toastify";
import { history } from "@src/AppRouter";
import { ArticleState } from "@reducers/articleReducer";
import { ArticleActions } from "@actions/articleActions";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleCreators } from "@store/creators/articleCreators";
import ReactQuill from "react-quill";

interface OwnProps {}
interface StateProps {
  articleReducer: ArticleState;
}
interface DispatchProps {
  requestArticle: (id: string) => Promise<ArticleActions.Actions>;
}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  RouteComponentProps<{ id: string }>;

interface States {
  // 表单状态
  formState: PublishArticleParams;
  // 文件上传
  fileUpload: {
    // 文件上传进度
    percentage: number;
    // 上传失败信息
    error: string | null;
  };
  // 是否存为草稿
  draft: boolean;
  // 发布文章请求状态
  publishRequestStatus: Status;
  // 发布文章请求错误信息
  publishRequestError: string | null;
}

class PublishPage extends React.Component<Props, States> {
  // 构造函数
  constructor(props: Readonly<Props>) {
    super(props);
    // 组件状态
    this.state = {
      // 表单状态
      formState: {
        title: "",
        content: "",
        cover: {
          type: 0,
          images: [],
        },
        channel_id: "",
      },
      // 文件上传
      fileUpload: {
        // 文件上传进度
        percentage: 0,
        // 上传失败信息
        error: null,
      },
      // 是否存储为草稿
      draft: true,
      // 发布文章请求状态
      publishRequestStatus: "idle",
      // 发布文章请求错误信息
      publishRequestError: null,
    };
    // 使以下方法中的 this 关键字指向当前类的实例
    this.upload = this.upload.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.requestAndRenderArticle = this.requestAndRenderArticle.bind(this);
  }

  // 组件挂载完成之后
  async componentDidMount() {
    // 获取文章详情
    await this.requestAndRenderArticle();
  }

  // 获取并渲染文章详情
  async requestAndRenderArticle() {
    // 获取文章 id
    const id = this.props.match.params.id;
    // 判断 id 是否存在
    if (typeof id !== "undefined") {
      // 根据 id 获取文章详情
      await this.props.requestArticle(id);
      // 获取渲染文章详情
      const article = this.props.articleReducer.article.result;
      // 设置表单状态
      this.setState({
        formState: {
          ...this.state.formState,
          title: article.title!,
          content: article.content!,
          channel_id: article.channel_id!,
          cover: {
            type: 0,
            images: article.cover?.images!,
          },
        },
      });
    }
  }

  // 更新表单状态
  updateFormState(
    name: keyof PublishArticleParams,
    value: PublishArticleParams[keyof PublishArticleParams]
  ) {
    this.setState({ formState: { ...this.state.formState, [name]: value } });
  }

  // 上传图片
  async upload(event: ChangeEvent<HTMLInputElement>) {
    // 限制用户传递图片的数量
    if (this.state.formState.cover.images.length === 3) {
      return this.setState({
        fileUpload: {
          ...this.state.fileUpload,
          error: "同一篇文章最多只能传递三张封面图片",
        },
      });
    }
    // 获取文件列表
    const files = event.target.files;
    // 如果用户选择了文件
    if (files !== null && files.length > 0) {
      // 重置文件上传状态
      this.setState({ fileUpload: { percentage: 0, error: null } });
      // 捕获请求错误
      try {
        // 发送请求上传文件
        const response = await uploadRequest(files[0], this.onUploadProgress);
        // 存储上传图片的地址
        this.setState({
          formState: {
            ...this.state.formState,
            cover: {
              ...this.state.formState.cover,
              images: [...this.state.formState.cover.images, response.data.url],
            },
          },
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          // 上传失败 更新失败信息
          return this.setState({
            fileUpload: {
              ...this.state.fileUpload,
              error: error.response?.data.message,
            },
          });
        }
        throw error;
      }
    }
  }

  // 更新上传进度
  onUploadProgress(progressEvent: AxiosProgressEvent) {
    // loaded: 已上传大小
    // total: 总大小
    const { loaded, total } = progressEvent;
    // 如果总大小存在
    if (typeof total !== "undefined") {
      // 计算上传进度
      let percentage = Math.floor((loaded * 100) / total);
      // 如果没有上传完成
      if (percentage < 100)
        // 不断更新上传进度
        return this.setState({
          fileUpload: { ...this.state.fileUpload, percentage },
        });
      // 上传完成重置上传进度
      this.setState({
        fileUpload: { ...this.state.fileUpload, percentage: 0 },
      });
    }
  }

  // 发布文章
  async onSubmit(event: FormEvent<HTMLFormElement>) {
    // 阻止表单提交后默认跳转的行为
    event.preventDefault();
    // 更新请求状态
    this.setState({
      publishRequestStatus: "loading",
      publishRequestError: null,
    });
    // 获取请求参数
    const { draft, formState } = this.state;
    // 捕获请求错误
    try {
      // 获取文章id
      const id = this.props.match.params.id;
      // 根据 id 判断当前是修改还是添加
      if (typeof id !== "undefined") {
        // 修改
        await updateArticleRequest(id, formState, draft);
      } else {
        // 添加
        // 发送发布文章请求
        await publishArticleRequest(draft, formState);
      }

      // 更新状态
      this.setState({
        publishRequestStatus: "success",
        publishRequestError: null,
      });
      // 消息提示
      toast.success(`文章${id ? "编辑" : "发布"}成功`);
      // 跳转到内容管理页面
      history.push("/admin/article");
    } catch (error) {
      // 如果服务端返回了错误的状态码
      if (error instanceof AxiosError) {
        // 更新状态
        this.setState({
          publishRequestStatus: "error",
          publishRequestError: error.response?.data.message,
        });
        return toast.success(`发布失败: ${error.response?.data.message}`);
      }
      throw error;
    }
  }

  // 渲染视图
  render() {
    // 获取表单状态
    const { formState, fileUpload } = this.state;
    return (
      <div className={`has-background-white ${styles.publishPage}`}>
        <nav className="breadcrumb p-4">
          <ul>
            <li>
              <Link to="/">首页</Link>
            </li>
            <li>
              <Link to="/admin/publish">发布文章</Link>
            </li>
          </ul>
        </nav>
        <form onSubmit={this.onSubmit}>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">
                标题 <span className="has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <input
                className="input"
                type="text"
                placeholder="请输入文章标题"
                value={formState.title}
                onChange={(event) => {
                  this.updateFormState("title", event.currentTarget.value);
                }}
              />
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">
                频道 <span className="has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <Channel
                value={formState.channel_id}
                onChange={(value) => this.updateFormState("channel_id", value)}
              />
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label">
              <label className="label">封面</label>
            </div>
            <div className="field-body">
              {formState.cover.images.map((item) => (
                <figure key={item} className="image is-128x128 mr-2">
                  <img src={item} alt="" />
                </figure>
              ))}
              <div className="file is-medium is-boxed">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    onChange={this.upload}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">上传图片</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div
            className={classNames("field is-horizontal", {
              "mb-0": fileUpload.percentage === 0 && fileUpload.error == null,
            })}
          >
            <div className="field-label"></div>
            <div className="field-body">
              {fileUpload.percentage > 0 && (
                <progress
                  className="progress is-danger is-small"
                  value={fileUpload.percentage}
                  max="100"
                ></progress>
              )}
              {fileUpload.error && (
                <p className="has-text-danger">
                  文件上传失败, 失败原因: {fileUpload.error}
                </p>
              )}
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">
                内容 <span className="has-text-danger">*</span>
              </label>
            </div>
            <div className="field-body">
              <ReactQuill
                theme="snow"
                value={formState.content}
                onChange={(value) => {
                  this.updateFormState("content", value);
                }}
              />
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label"></div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <button
                    onClick={() => this.setState({ draft: false })}
                    className="button is-primary mr-3"
                  >
                    {this.props.match.params.id ? "编辑文章" : "发布文章"}
                  </button>
                  <button
                    onClick={() => this.setState({ draft: true })}
                    className="button is-info"
                  >
                    存入草稿
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  articleReducer: state.articleReducer,
});

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  requestArticle: (id) => dispatch(ArticleCreators.requestArticle(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishPage);
