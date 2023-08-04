import {combineReducers} from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import BookingReducer from './booking';

const rootReducer = combineReducers({
  auth: AuthReducer,
  booking: BookingReducer,
  application: ApplicationReducer,
});

export default rootReducer;
