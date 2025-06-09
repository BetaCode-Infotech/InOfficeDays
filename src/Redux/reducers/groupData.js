const initialState = {
  groupList: [],
  locationList: [],
};

const groupData = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_GROUP_LIST':
      return {...state, groupList: action.payload};
    case 'ALL_LOCATION_LIST':
      return {...state, locationList: action.payload};

    default:
      return state;
  }
};

export default groupData;
