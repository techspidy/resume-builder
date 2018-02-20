/* jshint node: true */
'use strict';

const _ = require('lodash');
const safe = require('undefsafe');

const LinkedInService = require('../services/linkedin-service');
const GoogleService = require('../services/google-service');
const FacebookService = require('../services/facebook-service');

const Users = require('../common/models/users');
let debug = require('debug')('apollo-cv:UsersCtrl');
let AuthorizationController = require('./authorization');
let ObjectId = require('mongoose').Types.ObjectId; 
const userRoles = require('../config/config').userRoles;
const userMeta = require('../config/config').userMeta;
const DEFAULT_ADMIN_USER_DATA = require('../config/config').defaultAdminUserData;
const snakeCase = require('snake-case');
const ResumesController = require('./resumes');
const FilesController = require('./files');
const SlackBroadcast = require('../services/slack-service');
let TemplatesController = require('./templates');

class UsersCtrl {

	// we do not use session because 
	// on how Safari handles session withn iFrames
	static authenticate(req, res, next) {
		// linkedin strategy
		if (req.body.strategy === 'linkedin') {
			LinkedInService.getUser(req.body.oauth_token)
			.then((linkedinResult) => {
				if (req.body.userID === linkedinResult.id) {
					return UsersCtrl.createOrUpdateUser({
						email: linkedinResult.emailAddress,
						firstName: linkedinResult.firstName,
						lastName: linkedinResult.lastName,
						linkedinId: linkedinResult.id,
						userPhoto: linkedinResult.pictureUrl
					});					
				} else {
					return Promise.reject(new Error('Unauthorizied'));
				}
			})
			.then((user) => {
				let newToken  = AuthorizationController.generateAccessToken(user);
				res.status(200).json({
					data: {
						token: newToken
					}
				});
			})			
			.catch((err) => {
				res.status(404).json(err);
			});
		} else if (req.body.strategy === 'google') {
			GoogleService.verify(req.body.oauth_token)
			.then((googleResult) => {

				if (req.body.userEmail === googleResult.email && googleResult.email_verified === true) {
					return UsersCtrl.createOrUpdateUser({
						email: googleResult.email,
						firstName: googleResult.given_name || googleResult.name || 'Undefined',
						lastName: googleResult.family_name || '',
						userPhoto: googleResult.picture
					});					
				} else {
					return Promise.reject(new Error('Unauthorizied'));
				}


			})
			.then((user) => {
				let newToken  = AuthorizationController.generateAccessToken(user);
				res.status(200).json({
					data: {
						token: newToken
					}
				});
			})			
			.catch((err) => {
				res.status(404).json(err);
			});

		} else if (req.body.strategy === 'facebook') {
			FacebookService.verify(req.body.oauth_token)
			.then((facebookResult) => {
				if (req.body.userID === facebookResult.id && !_.isNil(facebookResult.email)) {
					var photoUrl = '';
					if (facebookResult.picture && facebookResult.picture.data) {
						photoUrl = facebookResult.picture.data.url;
					}
					return UsersCtrl.createOrUpdateUser({
						email: facebookResult.email,
						firstName: facebookResult.first_name || 'Undefined',
						lastName: facebookResult.last_name || '',
						userPhoto: photoUrl
					});					
				} else {
					return Promise.reject(new Error('Unauthorizied'));
				}
			})
			.then((user) => {
				let newToken  = AuthorizationController.generateAccessToken(user);
				res.status(200).json({
					data: {
						token: newToken
					}
				});
			})				
			.catch((err) => {
				res.status(404).json(err);
			});
		} else {
			res.status(500).json(new Error('No strategy specified'));
		}
	}

	// get context user
	static getContextUser(req, res, next) {
		UsersCtrl.getUser(req.user._id, '_id email firstName lastName userPhoto permalinkSlug options meta')
		.then((user) => {
			res.status(200).json({
				data: {
					id: user._id,
					type: 'Users',
					attributes: user,
				},
				links: {
					_self: '/Users/' + user._id
				},
				meta: {}
			});
		})
		.catch(next)
	}

	// update user options
	static updateOptions(req, res, next) {
		Users.findOneAndUpdate({
			_id: new ObjectId(req.user._id)
		}, {
			options: req.body.options
		}, { new: true }, (err, data) => {
			if (err) {
				return res.status(401).json({
					title: 'Error, Could not update',
					status: 401
				});
			}
			res.status(200).json({status: 'OK'});
		});		
	}	

	// update user peralink
	static updateUserPermalink(req, res, next) {
		console.log('permalink', req.body.permalink)
		if (req.body.permalink === 'signin' || req.body.permalink === 'admin' || req.body.permalink === 'news' || req.body.permalink === 'jobs') {
			return res.status(401).json(err);
		}
		UsersCtrl.updatePermalink(req.user._id, req.body.permalink)
		.then((permalinkSlug) => {
			res.status(200).json({status: 'OK'});
		})	
		.catch((err) => {
			return res.status(401).json(err);
		});		
	}

	// remove user and al it's data
	static removeUser(req, res, next) {
		ResumesController.removeAll(req.user._id)
		.then(() => {
			return FilesController.removeAllUserFiles(req.user._id);
		})
		.then(() => {
			Users.remove({ _id: new ObjectId(req.user._id)}, (err) => {
				if (err) {
					return res.status(401).json({
						title: 'Error, Could not update',
						status: 401
					});
				}
				
				// slack service
				let slk = new SlackBroadcast.Manager();
				slk.setEvent(SlackBroadcast.events.NEW_USER).broadcast('User account remove: ' + req.user.email);				
				res.status(200).json({status: 'OK'});				
			});

		})
		.catch((err) => {
			return res.status(401).json(err);
		});
	}

	// get all users (only admin is allowed)
	static getAllUsers(req, res, next) {
		if (req.user.meta.role !== userRoles.ADMIN) {
			return res.status(403).json({
				title: 'Not authorizied to see this',
				status: 403
			});			
		}

		let limit = parseInt(req.query.limit, 10);
		let page = parseInt(req.query.page, 10);

       	Users.find()
       	.sort({ createdAt: -1 })
       	.skip(page * limit)
       	.limit(limit)
      	.exec((err, result) => {
       		if (err || _.isNil(result) || !_.isArray(result)) {
				return res.status(404).json({
					title: 'Could not find any',
					status: 404
				});
       		}
			Users.count({}, (err, count) => {
				if (err) {
					return res.status(404).json({
						title: 'Could not find any',
						status: 404
					});					
				}
				res.status(200).json({
					data: result,
					no: count,
					links: {
						_self: '/Users'
					},
					meta: {}
				});
			});
      	});
	}

	/**
	 * [createOrUpdateUser description]
	 * @param  {[type]} userData [email, firstName, lastName, linkedinId]
	 * @return {[type]}          [description]
	 */
	static createOrUpdateUser(userData) {
		return new Promise((resolve, reject) => {
			Users.findOne({ email: userData.email })
			.then((user) => {
				if (_.isNull(user)) {
					debug('Create user');

					let id = new ObjectId();
					userData._id = id;
					userData.permalinkSlug = id.toString();
					userData.meta = userMeta(userRoles.USER);
					userData.options = {
						newsletter: true,
						phone: '',
						country: '',
						city: '',
						agenciesAllow: false,
						indeedSelectedCountry: 'us'
					}
					Users.create(userData)
					.then((user) => {
						// slack service
						let slk = new SlackBroadcast.Manager();
						slk.setEvent(SlackBroadcast.events.NEW_USER).broadcast('New user: ' + userData.firstName + ' ' + userData.lastName + ' - ' + userData.email);

						if (_.isString(userData.firstName) && _.isString(userData.lastName)) {
							UsersCtrl.updatePermalink(id.toString(), userData.firstName + '-' + userData.lastName)
							.then((permalinkSlug) => {
								resolve(user);
							})	
							.catch((err) => {
								// resolve even if could not update permalink
								resolve(user);
							});
						} else {
							resolve(result);
						}						
					})
					.catch(reject);
				} else {
					if (user.email === userData.email) {
						debug('Update user');
						user.firstName = userData.firstName;
						user.lastName = userData.lastName;
						user.userPhoto = userData.userPhoto;
						user.linkedinId = userData.linkedinId || false;
						user.lastLogin = Date.now();
						user.save((err, result) => {
							if (err) {
								return reject(err);
							}
							resolve(result);
						});
					} else {
						reject(new Error('Unauthorizied'));
					}			
				}
			})
			.catch(reject);
		});
	}

	// check if current permalink exists
	static permalinkExits(permalink) {
		return new Promise((resolve, reject) => {
			if (_.isNil(permalink)) {
				return resolve(true);
			}
	       	Users.find({permalinkSlug: permalink})
	       	.select({ _id: 1 })
	      	.exec((err, result) => {
	       		if (err) {
	       			return reject(err);
	       		}
	       		if (_.isArray(result) && result.length === 0) {
	       			resolve(false);
	       		} else {
	       			resolve(true);
	       		}
	      	})			
		});
	}

	// update permalink
	// only use authenticated userID
	static updatePermalink(userId, newPermalink) {
		return new Promise((resolve, reject) => {
			if (_.isNil(newPermalink) || newPermalink === '') {
				return reject({
					title: 'Permalink bad format.',
					status: 401						
				});
			}
			UsersCtrl.permalinkExits(snakeCase(newPermalink))
			.then((permaExists) => {
				if (permaExists) {
					return reject({
						title: 'Permalink already exists. Please try onother one.',
						status: 401						
					});
				} else {
					Users.findOneAndUpdate({
						_id: new ObjectId(userId)
					}, {
						permalinkSlug: snakeCase(newPermalink)
					}, { new: true }, (err, data) => {
						if (err) {
							return reject(err);
						}
						resolve(data.permalinkSlug);
					});			
				}				
			})
		});
	}	

	// retrieve a user
	static getUser(id, fields) {
		if (_.isUndefined(fields)) {
			fields = '_id email firstName lastName meta permalinkSlug';
		}
		return new Promise((resolve, reject) => {
			Users.findOne({ _id: new ObjectId(id) }).select(fields).exec()
			.then((user) => {
				if (_.isNull(user)) {
					reject(new Error('Could not find the user'));
				} else {
					resolve(user);
				}
			})
			.catch(reject);
		});
	}

	// retrive user by permalink slug
	static getUserBySlug(permalinkSlug) {
		return new Promise((resolve, reject) => {
			Users.findOne({ permalinkSlug: String(permalinkSlug) })
			.then((user) => {
				if (_.isNull(user)) {
					reject(new Error('Could not find the user'));
				} else {
					resolve(user);
				}
			})
			.catch(reject);
		});		
	}

	// check if user is pro
	static isUserPro(user) {
		return false;
	}

	// check if user can access template
	static canUserAccessTemplate(user, templateSlug) {
		let canAccess = true;
		let isTemplatePro = TemplatesController.isTemplatePro(templateSlug);
		if (isTemplatePro && !UsersCtrl.isUserPro(user)) {
			canAccess = false;
		}
		return canAccess;
	}

	// update user export date
	static updateExportDate(userId) {
		return Users.findOneAndUpdate({
			_id: new ObjectId(userId)
		}, {
			lastExport: Date.now()
		});	
	}

	// create or update admin user
	static createAdminUser() {
		Users.findOne({ email: DEFAULT_ADMIN_USER_DATA.email })
		.then(user => {
			if (_.isNil(user)) {
				// create admin user
				console.log('create admin user');
				let userData = {
					email: DEFAULT_ADMIN_USER_DATA.email,
					firstName: DEFAULT_ADMIN_USER_DATA.firstName,
					lastName: DEFAULT_ADMIN_USER_DATA.lastName
				};
				
				let id = new ObjectId();
				userData._id = id;
				userData.permalinkSlug = id.toString();
				userData.meta = userMeta(userRoles.USER);
				userData.options = {
					newsletter: true,
					phone: '',
					country: '',
					city: '',
					agenciesAllow: false,
					indeedSelectedCountry: 'us'
				}
				Users.create(userData)
				.then(user => {
					console.log(`ADMIN USER ${userData.email} CREATED ...`);					
					if (_.isString(userData.firstName) && _.isString(userData.lastName)) {
						UsersCtrl.updatePermalink(id.toString(), userData.firstName + '-' + userData.lastName);
					} 
				})				
			} else {
				// update admin user				
				if (!_.isNil(safe(user, 'meta.role')) && user.meta.role !== userRoles.ADMIN) {
					Users.findOneAndUpdate({
						_id: new ObjectId(user._id)
					}, {
						meta: userMeta(userRoles.ADMIN)
					}, { new: true }, (err, data) => {
						if (err) {
							console.log('ERROR Could not update admin user ...');
						}
						console.log('DEFAULT ADMIN USER UPDATED ...');
					});						
				} else {
					console.log(`Admin user ${user.email} exists ...`);
				}
			}
		})
		.catch(err => {
			console.log('ERROR CREATING ADMIN USER', err);
		});	
	}

}

module.exports = UsersCtrl;
