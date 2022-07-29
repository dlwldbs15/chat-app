export const LOGIN = "USER/LOGIN";
export const LOGOUT = "USER/LOGOUT";

const initialState = {
    user : '',
};

const userChecker = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          user: action.payload
        };
      case LOGOUT:
        return {
            ...state,
            user: ''
        };
      default:
        return state;
    }
  };
export default userChecker;