import {combineReducers} from 'redux';
import authData from './authData';
import eventData from './eventData';
export default combineReducers({
  authData: authData,
  eventData: eventData,
});
