export const OPEN_GROUP = "CHAT/OPEN_GROUP";
export const SELECT_ROOM = "CHAT/SELECT_ROOM";

const initialState = {
    groupOpenStates : [],
    roomSelectedStates : [],
};

const talkListUpdater = (state = initialState, action) => {
    switch (action.type) {
      case OPEN_GROUP:
        return {
          ...state,
          groupOpenStates: action.payload
        };
      case SELECT_ROOM:
        return {
            ...state,
            roomSelectedStates: action.payload
        };
      default:
        return state;
    }
  };
export default talkListUpdater;