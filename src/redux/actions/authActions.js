import Cookies from 'js-cookie';
import { SET_AUTH_TOKEN } from '../actions/types.js';
import axios from 'axios';
import { handleServerError } from '../../lib/utils.js';

export const setAuthToken = () => {
  return {
    type: SET_AUTH_TOKEN,
    payload: {},
  };
};

const API_BASE_URL = 'http://127.0.0.1:8000';

export const loginUser = (username, password) => async (dispatch) => {
  try {
    // Prepare the form data
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('client_id', process.env.PASSWORD_CLIENT_ID || 'client_id1');
    formData.append('client_secret', process.env.PASSWORD_CLIENT_SECRET || 'client_secret');
    formData.append('password', password);

    // Send POST request to authenticate
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok && data.access_token && data.refresh_token) {
      const { access_token, refresh_token, expires_in } = data;
      
      const expiresInDays = expires_in / (60 * 60 * 24);

      Cookies.set(
        'accessToken',
        access_token,
        { expires: expiresInDays, secure: true });
      Cookies.set(
        'refreshToken',
        refresh_token,
        { expires: 30, secure: true });

      // Dispatch actions to update the app state
      dispatch(setAuthToken());
    } else {
      throw new Error('Username or password is incorrect');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = (username, email, password) => async (dispatch) => {
  try {
      await axios.post(
        `${API_BASE_URL}/register/`,
        {
          username,
          email,
          password
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

  } catch (error) {
    handleServerError(error, 'An unknown error occurred');
  }
};

export const googleLogin = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/convert-token`, {
        token: credentials.credential,
        backend: 'google-oauth2',
        grant_type: 'convert_token',
        client_id: "G65xxD5VLC1jJ7RWHbi6lpacV2GimIwNwGIUJMgq",
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
    if (response.ok) {
        const { access_token, refresh_token, expires_in } = response.data;
        
        const expiresInDays = expires_in / (60 * 60 * 24);
        Cookies.set(
          'accessToken',
          access_token,
          { expires: expiresInDays, secure: true });
        Cookies.set(
          'refreshToken',
          refresh_token,
          { expires: 30, secure: true });
        
        // Dispatch actions to update the app state
        dispatch(setAuthToken());
    }
  } catch (error) {
    handleServerError(error, 'Sign In with Google account has failed!');
  }
    
};


export const logoutUser = () => (dispatch) => {
  // Remove tokens and user data from cookies
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');

  dispatch({ type: 'LOGOUT' });
};
