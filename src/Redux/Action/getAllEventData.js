// actions/authActions.js
import axios from 'axios';
import {SET_AUTH_DATA} from '../actionTypes';
import Axios from '../../utils/Axios';

export const getAllEventData =
  (UserId, StartDate, EndDate, location) => async dispatch => {
    try {
      await axios
        .post(`${Axios.axiosUrl}${Axios.getAllEvents}`, {
          USER_ID: UserId,
          START_DATE: StartDate ?? '',
          END_DATE: EndDate ?? '',
          LOCATION: location,
        })
        .then(response => {
          const data = response.data;

          if (data.IS_LOGGED_OUT == false) {
            dispatch({
              type: 'ALL_EVENT_LIST',
              payload: data,
            });
          }
        })
        .catch(err => {});
    } catch (error) {
      console.error('Failed to fetch session data:', error);
      // You can also dispatch an error action here if needed
    }
  };
export const getMyEventData =
  (UserId, StartDate, EndDate, location) => async dispatch => {
    try {
      await axios
        .post(`${Axios.axiosUrl}${Axios.getEnrolledUserById}`, {
          USER_ID: UserId,
        })
        .then(response => {
          const data = response.data;

          if (data.IS_LOGGED_OUT == false) {
            dispatch({
              type: 'UPDATE_MY_EVENT_LIST',
              payload: data,
            });
          }
        })
        .catch(err => {});
    } catch (error) {
      console.error('Failed to fetch session data:', error);
      // You can also dispatch an error action here if needed
    }
  };
