import { combineReducers } from "redux";
import userReducer from "@reducers/userReducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import channelReducer from "@reducers/channelReducer";
import articlesReducer from "@reducers/articlesReducer";
import articleReducer from "@reducers/articleReducer";

const rootReducer = combineReducers({
  userReducer: persistReducer({ key: "userReducer", storage }, userReducer),
  channelReducer,
  articlesReducer,
  articleReducer,
});

export default rootReducer;
