import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getSessionDataAction} from '../Redux/Action/getSessionData';
import {
  getGroupByUserData,
  getLocationByUserData,
} from '../Redux/Action/getAllGroupData';

export const RenderDataOnLoad = () => {
  const dispatch = useDispatch();
  // const AUTH_DATA = useSelector(state => state.authData.authDataList);

  // useEffect(() => {
  //   if (AUTH_DATA?.SESSION_ID) {
  //     // dispatch(getSessionDataAction(AUTH_DATA?.SESSION_ID));
  //     dispatch(getGroupByUserData(AUTH_DATA?.USER_ID));
  //     dispatch(getLocationByUserData(AUTH_DATA?.USER_ID));
  //   }
  // }, [AUTH_DATA, dispatch]);
};
