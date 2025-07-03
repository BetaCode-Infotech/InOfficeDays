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
      data.map(val => {
        val.label = val.GROUP_NAME;
        val.value = val._id;
      });
      dispatch({
        type: 'ALL_GROUP_LIST',
        payload: data,
      });
    })
    .catch(err => {
      console.error('Failed to fetch session data:', err);
    });
};
export const getLocationByUserData = UserId => async dispatch => {
  if (!UserId) return 'No User ID provider';
  await axios
    .post(`${Axios.axiosUrl}${Axios.getLocationByUser}`, {
      USER_ID: UserId,
    })
    .then(response => {
      const data = response.data;
      dispatch({
        type: 'ALL_LOCATION_LIST',
        payload: data,
      });
    })
    .catch(err => {
      console.error('Failed to fetch session data:', err);
    });
};
export const getTrackingByUserData = UserId => async dispatch => {
  if (!UserId) return 'No User ID provider';
  await axios
    .post(`${Axios.axiosUrl}${Axios.getTrackingByUser}`, {
      USER_ID: UserId,
    })
    .then(response => {
      const data = response.data;

      dispatch({
        type: 'ALL_TRACKING_LIST',
        payload: data,
      });
    })
    .catch(err => {
      console.error('Failed to fetch session data:', err);
    });
};
export const getHistoryByTrackingID =
  (TrackingId, UserId) => async dispatch => {
    // if (!TrackingId) return {error: 'No Tracking ID provided'};

    try {
      const response = await axios.post(
        `${Axios.axiosUrl}${Axios.getTrackingHistory}`,
        {
          TRACKING_ID: TrackingId,
          USER_ID: UserId,
        },
      );
      const data = response.data;
      console.log('Tracking History:', data);

      return {data};
    } catch (error) {
      console.error('Failed to fetch tracking history:', error);
      return {error};
    }
  };
export const setBackgroundActivity = payload => ({
  type: 'BACKGROUND_ACTIVITY',
  payload,
});
export const deleteOldBackgroundActivities = () => ({
  type: 'DELETE_OLD_BACKGROUND_ACTIVITIES',
});
