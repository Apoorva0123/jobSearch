import { combineReducers } from "redux";
import { jobReducer } from "./jobReducer";

const reducers = combineReducers({
  allJobs: jobReducer,
});

export default reducers;
