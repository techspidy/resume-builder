/* jshint node: true */
'use strict';

const _ = require('lodash');
const Resumes = require('../common/models/resumes');
let debug = require('debug')('apollo-cv:ResumesCtrl');
let ObjectId = require('mongoose').Types.ObjectId; 
let TemplatesController = require('./templates');
const snakeCase = require('snake-case');
const userRoles = require('../config/config').userRoles;

class ResumesController {

	// get all resumes
	static index(req, res, next) {
		ResumesController.getAll(req.user._id)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	// create new
	static createNew(req, res, next) {
		ResumesController.getCount(req.user._id)
		.then((count) => {
			if (req.user.meta.max_cvs < count + 1) {
				return Promise.reject({
					title: 'You are only allowed to create ' + ((req.user.meta.max_cvs == 1) ? 'one resume' : req.user.meta.max_cvs + ' resumes') + '.',
					status: 401
				});
			} else {				
				return ResumesController.createNewResume(req.user._id, {
					name: req.body.resumeName,
					defaultTemplate: TemplatesController.getDefaultTemplate(),
					aboutSection: {
						opened: true,
						name: 'About section',
						slug: 'about_yourself'
					}
				});
			}
		})
		.then((resume) => {
			res.status(200).json({
				data: {
					id: resume._id,
					type: 'Resumes',
					attributes: {},
				},
				links: {
					_self: '/Resumes/' + resume._id
				},		
				meta: {}
			});
		})
		.catch((err) => {
			res.status(401).json(err);		
		});
	}

	// clone resume
	static clone(req, res, next) {
		ResumesController.getCount(req.user._id)
		.then((count) => {
			if (req.user.meta.max_cvs < count + 1) {
				return Promise.reject({
					title: 'You are only allowed to create ' + ((req.user.meta.max_cvs == 1) ? 'one resume' : req.user.meta.max_cvs + ' resumes') + '.',
					status: 401
				});
			} else {
				return ResumesController.getDocument(req.body.id, '_id userId meta sections')
				.then((doc) => {
					if (ResumesController.belongsTo(doc, req.user._id)) {
						doc.meta.name = req.body.newName;
						return ResumesController.createNewResume(req.user._id, doc.meta, doc.sections);
					} else {
						return Promise.reject(new Error('Could not remove this document, it does not belong to you.'));
					}					
				});
			}
		})
		.then(() => {
			res.status(200).json({});
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	static remove(req, res, next) {
		ResumesController.getDocument(req.params.id, '_id userId')
		.then((doc) => {
			if (ResumesController.belongsTo(doc, req.user._id)) {
				return ResumesController.removeDocument(doc._id);
			} else {
				return Promise.reject(new Error('Could not remove this document, it does not belong to you.'));
			}
		})
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	// retrive resume
	static getResume(req, res, next) {
		return ResumesController.getDocument(req.params.id, '_id userId permalinkSlug meta sections')
		.then((doc) => {
			if (ResumesController.belongsTo(doc, req.user._id)) {
				res.status(200).json({
					data: {
						id: doc._id,
						type: 'Resume',
						attributes: doc,
					},
					links: {
						_self: '/Resumes/' + req.params.id
					},		
					meta: {}
				});				
				
			} else {
				return Promise.reject(new Error('Could not remove this document, it does not belong to you.'));
			}					
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	// update resume
	static update(req, res, next) {
		ResumesController.getDocument(req.params.id, '_id userId')
		.then((doc) => {
			if (ResumesController.belongsTo(doc, req.user._id)) {
				return new Promise((resolve, reject) => {
					Resumes.findOneAndUpdate({
						_id: new ObjectId(req.params.id)
					}, {
						sections: req.body.resume.sections,
						meta: req.body.resume.meta
					}, { new: true }, (err, data) => {
						if (err) {
							return reject(err);
						}
						resolve({
							status: 'OK',
							id: doc._id
						});
					});
				})
			} else {
				return Promise.reject(new Error('Could not update this document, it does not belong to you.'));
			}
		})
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	static getResumesForUser(req, res, next) {
		if (req.user.meta.role !== userRoles.ADMIN) {
			return res.status(403).json({
				title: 'Not authorizied to see this',
				status: 403
			});			
		}

		ResumesController.getAll(req.params.userId)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	// get count
	static getCount(userId) {
		return new Promise((resolve, reject) => {
	       	Resumes.count({userId: new ObjectId(userId)}, function(err, c) {
	       		if (err) {
	       			return reject(err);
	       		}
	       		resolve(c);
	      	});
		});	
	}

	// create new resume
	static createNewResume(userId, meta, sections) {
		let id = new ObjectId();
		return new Promise((resolve, reject) => {
			Resumes.create({ 
				_id: id,
				permalinkSlug: id.toString(),
				userId: new ObjectId(userId),
				meta: meta,
				sections: sections || []				
			}, (err, resume) => {				
				if (err) {
					return reject(err);
				}

				return ResumesController.updatePermalink(userId, id.toString(), meta.name)
				.then((resumeUpdated) => {
					return resolve(resumeUpdated);
				})
				.catch((err) => {
					resolve(resume);
				});
			});     	
		});		
	}

	// remove document
	static removeDocument(docId) {
		return new Promise((resolve, reject) => {
			Resumes.remove({ _id: new ObjectId(docId)}, function (err) {
				if (err) {
					return reject(err);
				}
				resolve({});
			});			
		});
	}

	// get all
	static getAll(userId) {
		return new Promise((resolve, reject) => {
	       	Resumes.find({userId: new ObjectId(userId)})
	       	.sort({ createdAt: -1 })
	       	.select({ _id: 1, meta: 1, permalinkSlug: 1 })
	      	.exec((err, result) => {
	       		if (err) {
	       			return reject(err);
	       		}
	       		resolve(result);
	      	})
		});	
	}

	// retrieve a document
	static getDocument(id, fields) {
		if (_.isUndefined(fields)) {
			fields = '_id';
		}
		return new Promise((resolve, reject) => {
			Resumes.findOne({ _id: new ObjectId(id) }).select(fields).exec()
			.then((document) => {
				if (_.isNull(document)) {
					reject(new Error('Could not find the user'));
				} else {
					resolve(document);
				}
			})
			.catch(reject);
		});
	}

	// check if resume belongs to a user
	static belongsTo(document, userId) {
		return String(document.userId) === String(userId);
	}

	// check if current permalink exists
	static permalinkExits(userId, permalink) {
		return new Promise((resolve, reject) => {
			if (_.isNil(permalink)) {
				return resolve(true);
			}
	       	Resumes.find({userId: new ObjectId(userId), permalinkSlug: permalink})
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
	static updatePermalink(userId, resumeId, newPermalink) {
		return new Promise((resolve, reject) => {

			ResumesController.permalinkExits(userId, newPermalink)
			.then((permaExists) => {
				if (permaExists) {
					return reject({
						title: 'Permalink already exists.',
						status: 401						
					});
				}
				return ResumesController.getDocument(resumeId, '_id userId');
			})			
			.then((doc) => {
				if (ResumesController.belongsTo(doc, userId)) {

					Resumes.findOneAndUpdate({
						_id: new ObjectId(resumeId)
					}, {
						permalinkSlug: snakeCase(newPermalink)
					}, { new: true }, (err, data) => {
						if (err) {
							return reject(err);
						}
						resolve(data.permalinkSlug);
					});

				} else {
					reject(new Error('Could not update this document, it does not belong to you.'));
				}
			})
			.catch(reject);
		});
	}


	// remove all user resumes
	// used on account desptroy
	static removeAll(userId) {
		return new Promise((resolve, reject) => {
			Resumes.remove({ userId: new ObjectId(userId)}, function (err) {
				if (err) {
					return reject(err);
				}
				resolve({});
			});				
		});
	}

	// retrieve resume by slug
	static getResumeBySlug(permalinkSlug) {
		return new Promise((resolve, reject) => {
			Resumes.findOne({ permalinkSlug: String(permalinkSlug) })
			.then((document) => {
				if (_.isNull(document)) {
					reject(new Error('Could not find this resume'));
				} else {
					resolve(document);
				}
			})
			.catch(reject);
		});
	}

}

module.exports = ResumesController;
