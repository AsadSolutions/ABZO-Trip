import * as actionTypes from '@actions/actionTypes';
const initialState = {
  ride_filter: {},
  stay_filter: {},
  guide_filter: {},
  package_filter: {},
  pilgrimage_filter: {},
  booking_item: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.INFO_FILTER:
      return {
        ...state,
        info_filter: action.payload,
      };
    case actionTypes.RIDE_FILTER:
      return {
        ...state,
        ride_filter: action.payload,
      };
    case actionTypes.STAY_FILTER:
      return {
        ...state,
        stay_filter: action.payload,
      };
    case actionTypes.GUIDE_FILTER:
      return {
        ...state,
        guide_filter: action.payload,
      };
    case actionTypes.PACKAGE_FILTER:
      return {
        ...state,
        package_filter: action.payload,
      };
    case actionTypes.PILGRIMAGE_FILTER:
      return {
        ...state,
        pilgrimage_filter: action.payload,
      };
    case actionTypes.BOOKING_ITEM:
      return {
        ...state,
        booking_item: action.payload,
      };
    default:
      return state;
  }
};
