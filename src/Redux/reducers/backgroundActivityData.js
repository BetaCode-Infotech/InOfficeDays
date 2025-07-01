const initialState = {
  backgroundActivityList: [],
};

const backgroundActivityData = (state = initialState, action) => {
  switch (action.type) {
    case 'BACKGROUND_ACTIVITY':
      return {...state, backgroundActivityList: action.payload};
    default:
      return state;
  }
};

export default backgroundActivityData;
