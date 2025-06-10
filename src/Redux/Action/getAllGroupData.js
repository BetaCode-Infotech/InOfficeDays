import axios from 'axios';
import Axios from '../../utils/Axios';

export const getGroupByUserData = UserId => async dispatch => {
  if (!UserId) return 'No User ID provider';
  await axios
    .post(`${Axios.axiosUrl}${Axios.getGroupByUser}`, {
      USER_ID: UserId,
    })
    .then(response => {
      const data = response.data;
      console.log('Group Data:', data);
      data.map(val => {
        val.label = val.GROUP_NAME;
        val.value = val._id;
      });
      // if (data.IS_LOGGED_OUT == false) {
      dispatch({
        type: 'ALL_GROUP_LIST',
        payload: data,
      });
      // }
    })
    .catch(err => {
      console.error('Failed to fetch session data:', err);
    });
};
export const getLocationByUserData = UserId => async dispatch => {
  if (!UserId) return 'No User ID provider';
  console.log('Asdjasdjasdas', `${Axios.axiosUrl}${Axios.getLocationByUser}`, {
    USER_ID: UserId,
  });
  
  await axios
    .post(`${Axios.axiosUrl}${Axios.getLocationByUser}`, {
      USER_ID: UserId,
    })
    .then(response => {
      const data = response.data;
      console.log('jhkjnjkhkjh', data);
      
      dispatch({
        type: 'ALL_LOCATION_LIST',
        payload: data,
      });
    })
    .catch(err => {
      console.error('Failed to fetch session data:', err);
    });
};
