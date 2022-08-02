import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/rootReducer";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// 배포 레벨에서는 리덕스 발동시 찍히는 logger를 사용하지 않습니다.
const enhancer =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware())
    : composeWithDevTools(applyMiddleware(logger));
        
const store = createStore(rootReducer, enhancer);
export default store;