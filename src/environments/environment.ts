// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { User } from 'app/shared/interface/user';

export const environment = {
	production: false,
	loginUser: <User>{},

	BASEAPI: 'http://192.168.0.35:1337',
	PROFILE_IMAGE_PATH: "http://192.168.0.35:1337/upload/profiles/",

	REGISTER_USER: '/auth/register',
	LOGIN_USER: '/auth/login',
	ACTIVATE_USER: '/auth/useractivation/',
	FORGOT_PASSWORD: '/auth/forgotpassword',
	RESET_PASSWORD: '/auth/resetpassword',
	LOGIN_FB_USER: '/auth/fblogin',
	GET_ALL_SPORTS_CENTERS: '/sportcenter',
	GET_ALL_SPORTS_CENTERS_USER: '/sportcenter/user/',
	GET_SPORTS_CENTERS: '/sportcenter/',
	ADD_SPORTS_CENTER: '/sportcenter',
	DELETE_SPORTS_CENTER: '/sportcenter/',
	GET_FEILDS: '/field/sportcenter/',
	ADD_FEILDS: '/field',
	AUTOCOMPLETE_SPORTSCENTRE: '/sportcenter/autocomplete/',
	GET_ALL_CURRENCY: '/currency',
	GET_CURRENCY: '/currency/',
	GET_ALL_MAIN_SPORTS: 'sport/all',
	GET_ALL_SPORTS: '/sport',
	GET_ALL_SPORTS_WITH_SUB: '/subsport',
	GET_SPORT: '/sport/',
	PROFILE_UPDATE: '/profile',
	PROFILE_IMAGE_UPDATE: '/profile/image/',
	CREATE_MATCH: '/match',
	GET_MATCH: '/match/',
	NEARBY_MATCH: '/match/nearby',
	GET_BENCH_PLAYERS: '/sportplayer/',
	GET_SUB_SPORTS: '/subsport/list',
	UPDATE_PASSWORD: '/auth/updatepassword',
	CHANGE_EMAIL: '/changeemail',
	INVITATION_SEARCH_PLAYER: '/invitation/usersearch/',
	INVITATION_SEARCH_USER: '/invitation/search/',
	SEND_INVITATIONS: '/invitation',
	GET_MATCH_USER: '/match/user/',
	INVITATION_ACCEPT: '/invitation/accept/',
	INITATION_DELETE: '/invitation/',
	JOIN_MATCH:'/match/join',
	DELETE_MATCH:'/match/',
	GET_LAST_MATCH:'/match/last/user/',
	GoogleKey: "&key=AIzaSyDD7oo0yCjyp2pIBLbRr_h3b0_NiMXXu3g"
};
