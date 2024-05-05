import { ActionTypes } from "../constants/action-types";

const initialState = {
  jobs: [],
};

export const jobReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_JOBS:
      return { ...state, jobs: payload };
    default:
      return state;
  }
};
