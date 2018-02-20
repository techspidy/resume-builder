'use strict';

var LE = require('greenlock-express');
var LEConfig = require('../config/config').lets_encrypt_config;

module.exports = function(app) {
	
	return LE.create({
		server: 'https://acme-v01.api.letsencrypt.org/directory', //'staging',
		email: LEConfig.email,
		agreeTos: true,
		approvedDomains: LEConfig.approvedDomains,
		app: app
	});
};