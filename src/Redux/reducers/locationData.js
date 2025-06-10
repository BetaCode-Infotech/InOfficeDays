const initialState = {
  locationList: [],
};

const locationData = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_LOCATION_LIST':
      return {...state, locationList: action.payload};

    default:
      return state;
  }
};

export default locationData;
