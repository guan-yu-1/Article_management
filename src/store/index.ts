import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "@reducers/rootReducer";
import thunk, { ThunkDispatch } from "redux-thunk";

const middlewares = [thunk];

const enhancers =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(...middlewares)
    : composeWithDevTools(applyMiddleware(...middlewares));

const store = createStore(rootReducer, enhancers);

// Redux 状态对象的类型
export type AppState = ReturnType<typeof store.getState>;
// 用于接收 Action 对象的 dispatch 方法的类型
export type AppDispatch = typeof store.dispatch;
// 用于接收 Action 函数的 dispatch 方法的类型
export type AppThunkDispatch = ThunkDispatch<
  AppState,
  any,
  Parameters<AppDispatch>[0]
>;

export default store;
