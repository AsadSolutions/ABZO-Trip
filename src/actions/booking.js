import * as actionTypes from './actionTypes';
const processINFO_FILTER = payload => {
  return {
    type: actionTypes.INFO_FILTER,
    payload : payload,
  };
};
export const onINFO_FILTER = payload => dispatch => {
  dispatch(processINFO_FILTER(payload));
};

const processRIDE_FILTER = payload => {
  return {
    type: actionTypes.RIDE_FILTER,
    payload : payload,
  };
};
export const onRIDE_FILTER = payload => dispatch => {
  dispatch(processRIDE_FILTER(payload));
};

const processSTAY_FILTER = payload => {
  return {
    type: actionTypes.STAY_FILTER,
    payload : payload,
  };
};
export const onSTAY_FILTER = payload => dispatch => {
  dispatch(processSTAY_FILTER(payload));
};


const processGUIDE_FILTER = payload => {
  return {
    type: actionTypes.GUIDE_FILTER,
    payload : payload,
  };
};
export const onGUIDE_FILTER = payload => dispatch => {
  dispatch(processGUIDE_FILTER(payload));
};



const processPACKAGE_FILTER = payload => {
  return {
    type: actionTypes.PACKAGE_FILTER,
    payload : payload,
  };
};
export const onPACKAGE_FILTER = payload => dispatch => {
  dispatch(processPACKAGE_FILTER(payload));
};


const processPILGRIMAGE_FILTER = payload => {
  return {
    type: actionTypes.PILGRIMAGE_FILTER,
    payload : payload,
  };
};
export const onPILGRIMAGE_FILTER = payload => dispatch => {
  dispatch(processPILGRIMAGE_FILTER(payload));
};

const processBOOKING_ITEM = payload => {
  return {
    type: actionTypes.BOOKING_ITEM,
    payload : payload,
  };
};
export const onBOOKING_ITEM = payload => dispatch => {
  dispatch(processBOOKING_ITEM(payload));
};
