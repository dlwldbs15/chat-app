import {LOGIN, LOGOUT} from "./reducers/userReducer";
import {INIT_LIST, SET_GROUP, SET_ROOM, OPEN_GROUP, SELECT_ROOM, PUSH_MESSAGE} from "./reducers/chatReducer";

export const login = user => ({ type: LOGIN, payload: user });
export const logout = user => ({ type: LOGOUT, payload: user });

export const initList = states => ({type: INIT_LIST, payload : states});
export const setGroup = groupData => ({type: SET_GROUP, payload: groupData});
export const setRoom = roomData => ({type: SET_ROOM, payload: roomData});

export const openGroup = openStates => ({type: OPEN_GROUP, payload: openStates});
export const selectRoom = selectedStates => ({type: SELECT_ROOM, payload: selectedStates});
export const pushMessage = unreadStates => ({type: PUSH_MESSAGE, payload: unreadStates});

