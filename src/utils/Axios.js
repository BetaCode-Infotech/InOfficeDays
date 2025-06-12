const axiosUrl = 'http://pdhanewala.com:4000/';
const loginOTPSend = 'inOffice/user/loginOTPSend';
const loginOTPVerify = 'inOffice/user/loginOTPVerify';
const userUpdate = 'inOffice/user/userUpdate';
const getSessionById = 'sessions/getSessionById';
const createGroups = 'inOffice/group/createGroup';
const updateGroup = 'inOffice/group/updateGroup';
const createLocation = 'inOffice/location/createLocation';
const updateLocation = 'inOffice/location/updateLocation';
const getGroupByUser = 'inOffice/group/getGroupByUser';
const getLocationByUser = 'inOffice/location/getLocationByUser';
const getTrackingByUser = 'inOffice/tracking/getTrackingByUser';
const getTrackingHistory = 'inOffice/tracking/getTrackingHistory';
const userLogout = 'user/userLogout';
export default {
  axiosUrl,
  loginOTPSend,
  loginOTPVerify,
  userUpdate,
  createGroups,
  updateGroup,
  getSessionById,
  createLocation,
  updateLocation,
  userLogout,
  getGroupByUser,
  getLocationByUser,
  getTrackingByUser,
  getTrackingHistory,
};
