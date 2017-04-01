
import { User } from 'app/shared/interface/user';

export const environment = {
  production: true,
  loginUser: <User>{},

  BASEAPI: 'http://174.138.82.155:1337',

  REGISTER_USER: '/auth/register',
  LOGIN_USER: '/auth/login',
  ACTIVATE_USER: '/auth/useractivation/',
  FORGOT_PASSWORD: '/auth/forgotpassword',
  RESET_PASSWORD: '/auth/resetpassword',
  LOGIN_FB_USER: '/auth/fblogin',
  GET_ALL_SPORTS_CENTERS: '/sportcenter',
  GET_SPORTS_CENTERS: '/sportcenter/',
  ADD_SPORTS_CENTER: '/sportcenter',
  DELETE_SPORTS_CENTER: '/sportcenter/',
  GET_FEILDS:'/field',
  ADD_FEILDS:'/field'
};
