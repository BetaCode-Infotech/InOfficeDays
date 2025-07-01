import {combineReducers} from 'redux';
import authData from './authData';
import groupData from './groupData';
import locationData from './locationData';
import trackingData from './trackingData';
import backgroundActivityData from './backgroundActivityData';
export default combineReducers({
  authData: authData,
  groupData: groupData,
  locationData: locationData,
  trackingData: trackingData,
  backgroundActivityData: backgroundActivityData,
});
