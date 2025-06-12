const initialState = {
  trackingList: [],
};

const trackingData = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_TRACKING_LIST':
      return {...state, trackingList: action.payload};
    default:
      return state;
  }
};

export default trackingData;
