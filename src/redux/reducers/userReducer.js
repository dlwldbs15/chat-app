export const LOGIN = "USER/LOGIN";
export const LOGOUT = "USER/LOGOUT";

const initialState = {
  User : {
    id : '',
    nickname : '',
  }
};

const userChecker = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          User : {
            ...state.User,
            id : action.payload.id,
            nickname : action.payload.nickname,
          }
        };
      case LOGOUT:
        return {
            ...state,
            User : {
              id: '',
              nickname: '',  
            }
        };
      default:
        return state;
    }
  };
export default userChecker;