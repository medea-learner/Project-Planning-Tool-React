import { SET_AUTH_TOKEN } from '../actions/types.js';
import Cookies from 'js-cookie';

const initialState = {
  isAuthenticated: Cookies.get('accessToken') ? true : false,
};
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_AUTH_TOKEN:
        return {
          ...state,
          isAuthenticated: true,
        };
      case 'LOGOUT':
        return initialState;
      default:
        return state;
    }
  };
  
  export default authReducer;
  