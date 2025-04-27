const initialState = {
  eventAllList: [],
  eventMyList: [],
};

const eventData = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_EVENT_LIST':
      return {...state, eventAllList: action.payload};
    case 'UPDATE_MY_EVENT_LIST':
      return {...state, eventMyList: action.payload};

    default:
      return state;
  }
};

export default eventData;
