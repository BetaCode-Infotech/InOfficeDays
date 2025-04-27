const initialState = {
  authDataList: {},
};

const authData = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_DATA_GET':
      return {...state, authDataList: action.payload};
    case 'AUTH_LOGOUT':
      return initialState; 
    default:
      return state;
  }
};

export default authData;
