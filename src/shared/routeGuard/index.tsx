import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  guards: Array<() => Promise<boolean>>;
  onRejected: () => ReactNode;
}

interface States {
  status: "idle" | "loading" | "success" | "error";
}

export default class RouteGuard extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    // 组件状态
    this.state = {
      // 验证请求状态
      status: "idle",
    };
  }
  // 组件挂载完成之后
  async componentDidMount() {
    // 获取验证函数数组
    const { guards } = this.props;
    // 更新状态
    this.setState({ status: "loading" });
    // 执行异步验证
    const isPassArray = await Promise.all(guards.map((guard) => guard()));
    // 获取异步验证结果
    const isPass = isPassArray.every((item) => item);
    // 执行验证失败后要做的事情
    this.setState({ status: isPass ? "success" : "error" });
  }

  // 正在验证时渲染
  loading() {
    // 渲染加载等待提示效果
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i className="fas fa-spinner fa-pulse is-size-1"></i>
      </div>
    );
  }

  // 验证成功时渲染
  success() {
    // 验证通过渲染路由组件
    return this.props.children;
  }

  // 验证失败时渲染
  error() {
    // 获取验证失败后执行的方法
    const { onRejected } = this.props;
    // 判断 onRejected 是否存在
    return onRejected();
  }

  render() {
    // 获取加载状态
    const { status } = this.state;
    if (status === "loading") {
      return this.loading();
    } else if (status === "error") {
      return this.error();
    } else if (status === "success") {
      return this.success();
    } else {
      return null;
    }
  }
}
