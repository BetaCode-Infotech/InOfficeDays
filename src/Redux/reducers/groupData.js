const initialState = {
  groupList: [],
};

const groupData = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_GROUP_LIST':
      return {...state, groupList: action.payload};
    default:
      return state;
  }
};

export default groupData;
