/* jshint node: true */
'use strict';

const _ = require('lodash');
let debug = require('debug')('apollo-cv:SessionController');

class SessionController {

	static authenticate(req, user) {		
		if (req.session) {
			var session = req.session;
			session.hello = 'test';
			session.user = {
				_id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			}
			debug('Authenticated');
		} else {
			debug('Coule not Authenticated - No session');
		}		
	}

	static isAuthenticated(req) {
		debug('Check authenticated', req.session);
		return req.session && req.session.user;
	}

	static destroy(req) {
		if (req.session && req.session.user) {
			delete req.session.user;
		}
		debug('Unauthenticated');
	}
}

module.exports = SessionController;
