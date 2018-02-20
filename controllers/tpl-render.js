'use strict';

const _ = require('lodash');
const safe = require('undefsafe');
let ResumesController = require('./resumes');
let UsersCtrl = require('./users');
let sanitizer = require('sanitizer');
const Utils = require('../utils/utils');

class TemplatesRenderController {
	static render(req, res, next) {	
		ResumesController.getResumeBySlug(req.params.resumeSlug)
		.then((resume) => {

			return new Promise((resolve, reject) => {
				UsersCtrl.getUserBySlug(req.params.userSlug)
				.then((user) => {
					resolve({
						user: user,
						resume: resume
					});
				})
				.catch(reject);	
			});
		})
		.then((data) => {
			if (_.isNil(safe(data.resume, 'meta.defaultTemplate.slug'))) {
				res.render('templates/template-404');
			} else if (String(data.resume.userId) != String(data.user._id)) {
				res.render('templates/template-404');
			} else if (!UsersCtrl.canUserAccessTemplate(data.user, data.resume.meta.defaultTemplate.slug)) {
				res.render('templates/payment-required');
			} else {
				let isUserPro = UsersCtrl.isUserPro(data.user);
				
				res.render('templates/' + data.resume.meta.defaultTemplate.slug + '/index', { 
					resume: data.resume, 
					s: sanitizer, 
					isUserPro: isUserPro,
					moment: Utils.DateFormater,
					host: req.protocol + '://' + req.headers.host,
					exportCustomCSS: ''
				});
			}			
		})
		.catch((err) => {
			console.log(err);
			res.render('templates/template-404');
		});
	}
}

module.exports = TemplatesRenderController;
