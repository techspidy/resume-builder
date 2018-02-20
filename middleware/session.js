/* jshint node: true */
'use strict';

let session = require('express-session');
let MongoStore = require('connect-mongostore')(session);

class SessionMidleware {

	useSession() {
		return session({
  			secret: 'sess8273482&%&*#(*#&*',
  			resave: false,
  			saveUninitialized: true,
  			cookie: { secure: true },
  			store: new MongoStore({
  				'db': 'apollo-sessions'
  			})
		});
	}
}

module.exports = new SessionMidleware();
