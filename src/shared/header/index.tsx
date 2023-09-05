import React from "react";
import styles from "./index.module.css";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { UserCreators } from "@store/creators/userCreators";
import { UserActions } from "@actions/userActions";
import { UserState } from "@reducers/userReducer";
import Confirm from "@shared/confirm";
import { history } from "@src/AppRouter";

interface StateProps {
  userReducer: UserState;
}
interface DispatchProps {
  // 获取用户信息
  requestUserInfo: () => Promise<UserActions.Actions>;
  // 清空用户信息
  clearUser: () => UserActions.ClearUser;
}
interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

interface States {
  // 控制退出登录弹窗是否渲染
  isOpen: boolean;
}

class Header extends React.Component<Props, States> {
  // 构造函数
  constructor(props: Props) {
    super(props);
    // 组件状态
    this.state = {
      // 控制退出登录弹窗是否渲染
      isOpen: false,
    };
  }
  // 组件挂载完成以后
  async componentDidMount() {
    // 获取用户信息
    await this.props.requestUserInfo();
  }

  // 渲染用户信息
  userInfo() {
    // 获取用户状态
    const { userReducer, clearUser } = this.props;
    // 检测用户信息是否获取成功
    if (userReducer.user.status !== "success") return;
    // 渲染用户信息
    return (
      <div className={styles.user}>
        <span>{userReducer.user.result.name}</span>
        <button
          onClick={() => this.setState({ isOpen: true })}
          className="button is-ghost has-text-white"
        >
          退出
        </button>
        <Confirm
          isOpen={this.state.isOpen}
          close={() => this.setState({ isOpen: false })}
          onSureButtonClicked={() => {
            // 清空用户信息
            clearUser();
            // 跳转到登录页
            history.replace("/login");
          }}
        >
          您确定要退出登录吗?
        </Confirm>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={require("@image/logo.png")} alt="极客园" />
        </div>
        {this.userInfo()}
      </div>
    );
  }
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  userReducer: state.userReducer,
});

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  requestUserInfo: () => dispatch(UserCreators.requestUserInfo()),
  clearUser: () => dispatch(UserCreators.clearUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
