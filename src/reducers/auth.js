import * as actionTypes from "@actions/actionTypes";
const initialState = {
  login: {
    success: false
  }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data.success,
        data: action.data.data
      };
    default:
      return state;
  }
};
