export const INIT_LIST = "CHAT/INIT_LIST"; //대화 목록 초기화

export const SET_GROUP = "CHAT/SET_GROUP"; //대화 그룹 데이터 셋팅
export const SET_ROOM = "CHAT/SET_ROOM"; //대화 방 데이터 세팅
export const LEAVE_ROOM = "CHAT/LEAVE_ROOM"; //방 나가기 했을 경우 마지막 접속 정보

export const OPEN_GROUP = "CHAT/OPEN_GROUP"; //그룹 Expander Open 정보
export const SELECT_ROOM = "CHAT/SELECT_ROOM"; //선택된 방 정보
export const PUSH_MESSAGE = "CHAT/PUSH_MESSAGE"; // 읽지 않은 대화 정보
export const READ_MESSAGE = "CHAT/READ_MESSAGE"; // 읽은 대화 정보

const initialState = {
    Data : {
      groupData : [],
      roomData : [],
      connectInfoData : [], // {room id, user id, leave time, connecting}
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
      case LEAVE_ROOM:
        return {
          ...state,
          Data : {
            ...state.Data,
            connectInfoData: action.payload
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
      case READ_MESSAGE:
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