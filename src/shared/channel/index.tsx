import React from "react";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { ChannelState } from "@reducers/channelReducer";
import { ChannelActions } from "@actions/channelActions";
import { ChannelCreators } from "@store/creators/channelCreators";

interface StateProps {
  channelReducer: ChannelState;
}
interface DispatchProps {
  // 获取频道列表
  requestChannel(): Promise<ChannelActions.Actions>;
}
interface OwnProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

type Props = StateProps & DispatchProps & OwnProps;

class Channel extends React.Component<Props> {
  // 组件挂载完成之后
  async componentDidMount() {
    // 获取频道列表
    await this.props.requestChannel();
  }

  // 渲染频道列表
  channels() {
    // 获取频道状态对象
    const { channelReducer } = this.props;
    // 获取频道列表状态
    const { channels } = channelReducer;
    // 渲染加载等待提示
    if (channels.status === "loading") return <option>loading...</option>;
    // 渲染加载错误信息
    if (channels.status === "error") return <option>{channels.error}</option>;
    // 渲染频道列表
    if (channels.status === "success") {
      return channelReducer.channels.result.map((channel) => (
        <option key={channel.id} value={channel.id}>
          {channel.name}
        </option>
      ));
    }
    return null;
  }

  render() {
    return (
      <div className="select">
        <select
          value={this.props.value}
          onChange={(event) => this.props.onChange(event.target.value)}
        >
          <option>请选择文章频道</option>
          {this.channels()}
        </select>
      </div>
    );
  }
}

const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  channelReducer: state.channelReducer,
});

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  // 获取频道列表
  requestChannel: () => dispatch(ChannelCreators.requestChannel()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
