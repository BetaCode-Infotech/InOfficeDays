import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getSessionDataAction} from '../Redux/Action/getSessionData';
import {
  getGroupByUserData,
  getLocationByUserData,
  getTrackingByUserData,
} from '../Redux/Action/getAllGroupData';

export const RenderDataOnLoad = () => {
  const dispatch = useDispatch();
  const AUTH_DATA = useSelector(state => state.authData.authDataList);

  useEffect(() => {
    if (AUTH_DATA?.SESSION_ID) {
      dispatch(getSessionDataAction(AUTH_DATA?.SESSION_ID));
    }
  }, []);
  useEffect(() => {
    if (AUTH_DATA?._id) {
      dispatch(getGroupByUserData(AUTH_DATA?._id));
      dispatch(getLocationByUserData(AUTH_DATA?._id));
      dispatch(getTrackingByUserData(AUTH_DATA?._id));
    }
  }, [AUTH_DATA]);
};
