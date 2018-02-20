/* jshint node: true */
'use strict';

let express = require('express');
let router = express.Router();
let TemplatesRenderController = require('../controllers/tpl-render');


/* render template. */
router.get('/:userSlug/:resumeSlug', TemplatesRenderController.render);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Home' });
});

// render signin
router.get('/signin', function(req, res, next) {
	res.render('signin', { title: 'Sign in' });
});

module.exports = router;
