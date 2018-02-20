/* jshint node: true */
'use strict';

// App host
let app_host = 'http://localhost:8080'; 

// Database config
let db_config = {
	dbName: 'apollo_cv',
	models: {
		Users: 'Users',
		Resumes: 'Resumes',
		Files: 'Files'
	}
};

const userRoles = {
	USER: 'USER',
	OPS: 'OPS',
	ADMIN: 'ADMIN'
};

const MAX_UPLOAD = 500000 * 8; // 4MB

const getUserMeta = function(userType) {
	switch(userType) {
	    case userRoles.USER:
	        return {
	        	max_cvs: 5,
	        	role: userType,
	        	max_upload: MAX_UPLOAD //500000 // 500KB
	        }
	        break;
	    case userRoles.OPS:
	        return {
	        	max_cvs: 10,
	        	role: userType,
	        	max_upload: MAX_UPLOAD * 10 // 40MB
	        }
	        break;
	    case userRoles.ADMIN:
	        return {
	        	max_cvs: 20,
	        	role: userType,
	        	max_upload: MAX_UPLOAD * 10 // 40MP
	        }
	        break;
	};
}

// default admin user 
const defaultAdminUserData = {
	email: 'your_email@your_server.com',
	firstName: 'NAME',
	lastName: 'NAME'
};

// Lets encrypt config 
// used to obtain a free SSL certificate
let lets_encrypt_config = {
	email: 'your_email@your_server.com',
	approvedDomains: [ 'your-domain.com' ]// app_host
};

// Meta config
// used within app admin side
let app_meta = {
	appName: 'Apollo',
	appFullName: 'Apollo - Resume builder',
	supportEmail: 'your_email@your_server.com',
	requires: []
};

// api meta
let api_meta = {
	meta: {
		copyright: '-------',
		service: 'Apollo API v2.2',
		authors: [],
	},
	data: {}
};

// session config
// set up session secret
let session_config = {
	sessionSeceret: 'YOUR_SESSION_SECRET'
};

// session config
// set up session secret
let authTokenConfig = {
	secret: 'YOUR_AUTH_TOKEN_SECRET'
};


// // TBD - move apy key and secret as environment vars
// // in order to be able to debug - create new feature two apps needs to be created withn Shopify partner
// let apiKey = (process.env.NODE_ENV === 'production') ? 'd6a5ea10c1310cebca8919686fffb17b' : 'd6a5ea10c1310cebca8919686fffb17b';
// let sharedSecret = (process.env.NODE_ENV === 'production') ? '26e548c5f4c699eefdf5080e90e60689' : '26e548c5f4c699eefdf5080e90e60689';


exports.db_config = db_config;
exports.app_meta = app_meta;
exports.app_host = app_host;
exports.api_meta = api_meta;
exports.authTokenConfig = authTokenConfig;
exports.userRoles = userRoles;
exports.userMeta = getUserMeta;
exports.lets_encrypt_config = lets_encrypt_config;
exports.defaultAdminUserData = defaultAdminUserData;

