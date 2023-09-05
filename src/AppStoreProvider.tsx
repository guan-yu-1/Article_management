import React from "react";
import { Provider } from "react-redux";
import store from "@src/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// 调用该方法即可将 redux store 中的状态同步到目标位置
const persistor = persistStore(store);

interface Props {
  children: React.ReactNode;
}

export default class AppStoreProvider extends React.Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>{this.props.children}</PersistGate>
      </Provider>
    );
  }
}
