export const INIT_LIST = "CHAT/INIT_LIST";

export const SET_GROUP = "CHAT/SET_GROUP";
export const SET_ROOM = "CHAT/SET_ROOM";

export const OPEN_GROUP = "CHAT/OPEN_GROUP";
export const SELECT_ROOM = "CHAT/SELECT_ROOM";
export const PUSH_MESSAGE = "CHAT/UNREAD_MESSAGES";

const initialState = {
    Data : {
      groupData : [],
      roomData : [],
    },
    ListState : {
      groupStates : [],
      groupOpenStates : [],
      roomSelectedStates : [],
      unreadMesssageStates : [], // {room id , message count}
    }
};

const talkListUpdater = (state = initialState, action) => {
    switch (action.type) {
      case INIT_LIST:
        return {
          ...state,
          ListState : {
            ...state.ListState,
            groupStates : action.payload.group,
            groupOpenStates : action.payload.open,
            roomSelectedStates : action.payload.selected,
            unreadMesssageStates : action.payload.unread,
          }
        }
      case SET_GROUP:
        return {
          ...state,
          Data : {
            ...state.Data,
            groupData : action.payload
          }
        }
      case SET_ROOM:
        return {
          ...state,
          Data : {
            ...state.Data,
            roomData : action.payload
          }
        }
      case OPEN_GROUP:
        return {
          ...state,
          ListState : {
            ...state.ListState,
            groupOpenStates: action.payload
          }
        };
      case SELECT_ROOM:
        return {
            ...state,
            ListState : {
              ...state.ListState,
              roomSelectedStates: action.payload
            }
        };
      case PUSH_MESSAGE:
        return {
            ...state,
            ListState : {
              ...state.ListState,
              unreadMesssageStates: action.payload
            }
        };
      default:
        return state;
    }
  };
export default talkListUpdater;