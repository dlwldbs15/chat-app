import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import chatReducer from "./chatReducer";

const rootReducer = combineReducers({
    usersReducer, chatReducer
  });
  
export default rootReducer;