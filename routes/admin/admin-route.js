/* jshint node: true */
'use strict';

let express = require('express');
let router = express.Router();
const appHost = require('../../config/config').app_host;


router.use('*', function(req, res, next) {
  res.render('admin/index', { 
  	title: 'Admin - Apollo Resume',
  	appHost: appHost,
  	host: req.protocol + '://' + req.headers.host,
  });
});

module.exports = router;
