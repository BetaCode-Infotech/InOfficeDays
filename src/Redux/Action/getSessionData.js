// actions/authActions.js
import axios from 'axios';
import {SET_AUTH_DATA} from '../actionTypes';
import Axios from '../../utils/Axios';

export const getSessionDataAction = sessionId => async dispatch => {
  try {
    const response = await axios
      .post(`${Axios.axiosUrl}${Axios.getSessionById}`, {
        SESSION_ID: sessionId,
      })
      .then(response => {
        const data = response.data;

        if (data.IS_LOGGED_OUT == false) {
          dispatch({
            type: 'AUTH_DATA_GET',
            payload: data,
          });
        }
        if (data.IS_LOGGED_OUT == true) {
          dispatch({
            type: 'AUTH_LOGOUT',
          });
        }
      })
      .catch(err => {});
  } catch (error) {
    // You can also dispatch an error action here if needed
  }
};
