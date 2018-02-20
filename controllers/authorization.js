/* jshint node: true */
'use strict';

const _ = require('lodash');
let debug = require('debug')('apollo-cv:AuthorizationController');
const TokenConfig = require('../config/config').authTokenConfig;
const jwt = require('jsonwebtoken');

const expireTime = (60 * 60) * 10; // ten hour

class AuthorizationController {

	static generateAccessToken(user) {
		let token = jwt.sign({
			userId: user._id
		}, TokenConfig.secret, {
			expiresIn: expireTime
		});
		return token;
	}

	static isValidToken(req) {
		var token = req.body.token || req.params.token || req.headers['x-authorization'];
		if (req.query && req.query.token) {
			token = req.query.token;
		}
		let decoded = false;
		try {
		  decoded = jwt.verify(token, TokenConfig.secret);
		} catch(err) {
		  decoded = false;
		}		
		return decoded;
	}
}

module.exports = AuthorizationController;
