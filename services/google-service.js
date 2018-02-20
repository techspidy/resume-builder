/* jshint node: true */
'use strict';

const _ = require('lodash');

const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const CLIENT_ID = '214554584182-un3htpoaquatr62rsv3h3aekkom60ijd.apps.googleusercontent.com';

class GoogleService {

	// retrive user
	static verify(authToken) {
		return new Promise((resolve, reject) => {
		var client = new auth.OAuth2(CLIENT_ID, '', '');
			client.verifyIdToken(
			    authToken,
			    CLIENT_ID,
			    // Or, if multiple clients access the backend:
			    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
			    function(e, login) {
			    	if (e) {
			    		return reject(e);
			    	}
					var payload = login.getPayload();
					resolve(payload);
					// var userid = payload['sub'];
					// console.log('AICI>>> ', payload);
					// If request specified a G Suite domain:
					//var domain = payload['hd'];
			});			
		});
	}

}

module.exports = GoogleService;
