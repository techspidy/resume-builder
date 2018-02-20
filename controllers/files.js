/* jshint node: true */
'use strict';

const _ = require('lodash');
const safe = require('undefsafe');

const Files = require('../common/models/files');
let debug = require('debug')('apollo-cv:FilesController');
let ObjectId = require('mongoose').Types.ObjectId; 
const Utils = require('../utils/utils');
let sharp = require('sharp');
const fs = require('fs');
let path = require('path');

const CDN_FOLDER = 'static-files/cdn/';
const sizesSlugs = ['_Xthumb', '_Xsmall', '_Xmedium', '_Xlarge'];

class FilesController {

	// retrive all files
	static index(req, res, next) {
       	Files.find({userId: new ObjectId(req.user._id)})
       	.sort({ createdAt: -1 })
       	.select({ _id: 1, imageId: 1, size: 1 })
      	.exec((err, result) => {
       		if (err) {
       			return res.status(401).json({
					title: 'Something went wrong.',
					status: 401       				
       			});
       		}
       		res.status(200).json(FilesController.createOutput(result));
      	});
	}

	// create file
	static create(req, res, next) {

		if (!req.files) {
			return res.status(400).json(new Error('No files were uploaded'));
		} 

		if (_.isNil(safe(req, 'files.image_file.data'))) {
			return res.status(400).json(new Error('No files were uploaded'));
		}

		const uid = Utils.guid();

		FilesController.getExistingFilesSizes(req.user._id)
		.then((totalFileSize) => {
			console.log('TOTAL>>>> ' + totalFileSize);
			if (FilesController.isAllowedToUpload(req.user, totalFileSize)) {
				return FilesController.createSizes(req.files.image_file.data, uid);
			} else {
				return Promise.reject({
					title: 'You have reached maximum upload limit. To get more space, upgrade your account.',
					status: 401
				});
			}
			return;
		})		
		.then((result) => {		
			FilesController.createNew(uid, req.user._id, result.totalSize)
			.then((data) => {
				result.image._id = data._id;
				res.status(200).json(result.image);
			});
		})
		.catch((err) => {
			debug(err);
			res.status(401).json(err);
		});
	}

	// remove file
	static deleteFile(req, res, next) {
		FilesController.removeFile(req.params.id, req.user._id)
		.then(() => {
			res.status(200).json({status: 'ok'});
		})
		.catch((err) => {
			res.status(401).json(err);
		});
	}

	// remove document
	static removeFile(_id, userId) {
		return new Promise((resolve, reject) => {
			FilesController.getDocument(_id, '_id userId imageId')
			.then((doc) => {
				// console.log('Retrived', doc)
				if (_.isNil(doc)) {
					return reject({
						title: 'Could not find the document.',
						status: 404	
					});
				}
				Files.remove({ _id: new ObjectId(doc._id), userId: new ObjectId(doc.userId)}, (err) => {
					if (err) {
						return reject(err);
					}
					resolve({});
					FilesController.removeFileFromFileSystem(doc.imageId);					
				});
			})
			.catch(reject);			
		});
	}

	// async
	static removeFileFromFileSystem(imageId) {
		return new Promise((resolve, reject) => {
			for (var i = 0; i < sizesSlugs.length; i++) {
				// sizesSlugs[i]
				fs.unlink(CDN_FOLDER + imageId + sizesSlugs[i] + '.jpg', (err) => {
					if (err) {
						// go silent
					}
				});				
			}
		});
	}

	// remove possible PDF file from filesystem
	static removePDFFromFileSystem(fileName) {
		let pdfFile = path.join(__dirname, '../static-files/cdn/' + fileName);
		fs.exists(pdfFile, (pdfExists) => {
			if (pdfExists) {
				fs.unlink(pdfFile, (err) => {
					if (err) {
						// go silent
					}
				});
			}
		});
	}	

	// retrieve a document
	static getDocument(id, fields) {
		if (_.isUndefined(fields)) {
			fields = '_id';
		}
		return new Promise((resolve, reject) => {
			Files.findOne({ _id: new ObjectId(id) }).select(fields).exec()
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

	static createSizes(buffer, uid) {
		return new Promise((resolve, reject) => {
			let totalSize = 0;
			let _Xthumb, _Xsmall, _Xmedium, _Xlarge;
			FilesController.resize(buffer, uid, '_Xthumb', 200, 100)
			.then((info) => {
				totalSize+= parseFloat(info.size);
				_Xthumb = info.filePath;
				return FilesController.resize(buffer, uid, '_Xsmall', 400, 100);
			})
			.then((info) => {
				totalSize+= parseFloat(info.size);
				_Xsmall = info.filePath;
				return FilesController.resize(buffer, uid, '_Xmedium', 600, 100);
			})
			.then((info) => {
				totalSize+= parseFloat(info.size);
				_Xmedium = info.filePath;
				return FilesController.resize(buffer, uid, '_Xlarge', 900, 100);
			})
			.then((info) => {
				totalSize+= parseFloat(info.size);
				if (!_.isNumber(totalSize)) {
					totalSize = 1;
				}
				_Xlarge = info.filePath;
				resolve({
					totalSize: totalSize,
					image: {
						_Xthumb: _Xthumb,
						_Xsmall: _Xsmall,
						_Xmedium: _Xmedium,
						_Xlarge: _Xlarge
					}
				});
			})		
			.catch(reject);
		})		
	}

	static resize(inputBuffer, uid, slug, sizeW, quality) {
		return new Promise((resolve, reject) => {
			const filePath = uid + slug + '.jpg';
			sharp(inputBuffer)
  			.resize(sizeW)
  			.quality(quality || 90)
  			.toFormat('jpeg')
  			.toFile(CDN_FOLDER + filePath, (err, info) => {
  				if (err) {
  					return reject(err);
  				}
  				info.filePath = filePath;
  				resolve(info);
  			});			
		})
	}

	// create new file
	static createNew(uid, userId, size) {
		return new Promise((resolve, reject) => {
			Files.create({ 
				userId: userId,
				imageId: uid,
				size: size || 100,
			}, (err, doc) => {
				if (err) return reject(err);
				resolve(doc);
			});     	
		});		
	}	

	// return existing filesizes for user
	static getExistingFilesSizes(userId) {
		return new Promise((resolve, reject) => {
			Files.aggregate(
				[
					{
						$match: { userId: new ObjectId(userId) }
					},				
					{
						$group: { _id : null, sum : { $sum: "$size" } }
					}
				]
			, (err, doc) => {
				if (err) {
					return reject(err);
				}

				let sum = 0;
				if (_.isArray(doc) && doc.length > 0) {
					if (_.isNumber(doc[0].sum)) {
						sum = doc[0].sum;
					}					
				}
				resolve(sum);
			});			
		});
	}

	static isAllowedToUpload(user, totalFileSize) {
		let max = safe(user, 'meta.max_upload');
		return parseFloat(max) > parseFloat(totalFileSize);
	}

	static createOutput(data) {
		let out = [];
		if (_.isArray(data)) {
			for (var i = 0; i < data.length; i++) {
				out.push({
					_Xthumb: data[i].imageId + '_Xthumb' + '.jpg',
					_Xsmall: data[i].imageId + '_Xsmall' + '.jpg',
					_Xmedium: data[i].imageId + '_Xmedium' + '.jpg',
					_Xlarge: data[i].imageId + '_Xlarge' + '.jpg',
					_id: data[i]._id
				});
			}
		}
		return out;
	}

	// ehen remove account 
	static removeAllUserFiles(userId) {
		return new Promise((resolve, reject) => {
	       	Files.find({userId: new ObjectId(userId)})
	       	.select({ _id: 1, imageId: 1 })
	      	.exec((err, result) => {
	       		if (err) {
	       			return resolve({status: 'OK'});
	       		}
	       		if (_.isArray(result)) {
	       			for (var i = 0; i < result.length; i++) {
	       				FilesController.removeFile(result[i]._id, userId);       				
	       			}
	       		}
	       		FilesController.removePDFFromFileSystem(userId + '-export.pdf');
	       		return resolve({status: 'OK'});
	      	});
		});
	}

}

module.exports = FilesController;
