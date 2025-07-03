const initialState = {
  backgroundActivityList: [],
};

const backgroundActivityData = (state = initialState, action) => {
  switch (action.type) {
    case 'BACKGROUND_ACTIVITY':
      return {
        ...state,
        backgroundActivityList: [
          ...state.backgroundActivityList,
          ...action.payload,
        ],
      };
    case 'DELETE_OLD_BACKGROUND_ACTIVITIES':
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 12:00 AM today
      const deletedAt = new Date();

      const updatedList = state.backgroundActivityList.filter(item => {
        const itemDate = new Date(item.DATE);
        itemDate.setHours(0, 0, 0, 0); // Ignore time part
        return itemDate >= today; // Keep only today's and future
      });

      // Check if LAST_DELETED_AT record exists
      const existingIndex = updatedList.findIndex(
        item => item.LAST_DELETED_AT !== undefined,
      );

      if (existingIndex !== -1) {
        // If exists, update the value
        updatedList[existingIndex].LAST_DELETED_AT = deletedAt;
      } else {
        // Else, push a new record
        updatedList.push({LAST_DELETED_AT: deletedAt});
      }

      return {
        ...state,
        backgroundActivityList: updatedList,
      };

    default:
      return state;
  }
};

export default backgroundActivityData;
