'use strict';

const _ = require('lodash');
const safe = require('undefsafe');
let ResumesController = require('./resumes');
let UsersCtrl = require('./users');
let sanitizer = require('sanitizer');
const Utils = require('../utils/utils');
const ExportUtil = require('../utils/export-util');
const ejs = require('ejs');


const fs = require('fs');
let path = require('path');
const pdf = require('html-pdf');
const EXPORT_RESTRICT_TIME = 30; // seconds
const phantomjs = require('phantomjs');
const binPath = phantomjs.path;
let childProcess = require('child_process');


class ExportController {

	static export(req, res, next) {		

		ResumesController.getResumeBySlug(req.params.resumeSlug)
		.then((resume) => {

			return new Promise((resolve, reject) => {
				UsersCtrl.getUserBySlug(req.params.userSlug)
				.then((user) => {

					if (user.lastExport) {
						if (!_.isDate(user.lastExport)) {
							return reject(new Error('Last export is not a date'));
						}
						var seconds =  (Date.now() - user.lastExport)/1000;
						if (seconds > EXPORT_RESTRICT_TIME) {
							user.canExport = true;
						} else {
							user.canExport = false;
						}
						return UsersCtrl.updateExportDate(user._id)
						.then(() => {
							resolve({
								user: user,
								resume: resume
							});							
						})
						.catch(reject);						
					} else {
						return UsersCtrl.updateExportDate(user._id)
						.then(() => {
							user.canExport = true;
							resolve({
								user: user,
								resume: resume
							});							
						})
						.catch(reject)						
					}
				})
				.catch(reject);	
			});
		})
		.then((data) => {
			if (!data.user.canExport || data.user.canExport === false) {
				return res.send('<p>Export feature is restricted based on last export date, please wait ' + EXPORT_RESTRICT_TIME + ' seconds and try again.</p>');
			}
			
			if (_.isNil(safe(data.resume, 'meta.defaultTemplate.slug'))) {
				res.render('templates/template-404');
			} else if (String(data.resume.userId) != String(data.user._id)) {
				res.render('templates/template-404');
			} else if (!UsersCtrl.canUserAccessTemplate(data.user, data.resume.meta.defaultTemplate.slug)) {
				res.render('templates/payment-required');
			} else {



				let pdfExportScript = path.join(__dirname, '../services/phantom-pdf-export-script.js');
				let cvUrl = req.protocol + '://' + req.headers.host + '/' + data.user.permalinkSlug + '/' + data.resume.permalinkSlug + '?title=Resume&printable=yes&export=' + data.resume.meta.defaultTemplate.slug + '&exportsize=' + req.params.formatModel;
				let exportPdfPath = path.join(__dirname, '../static-files/cdn/' + data.user.id + '-pdf.js');
				let fileName = data.user._id + '-export.pdf';

				let childArgs = [
					pdfExportScript,
					cvUrl,
					'./static-files/cdn/' + fileName
				];

				if (req.params.formatModel != 'no-format') {
					let size = 'A4';
					if (req.params.formatModel == 'a4') {
						size = 'A4';
					}
					if (req.params.formatModel == 'letter') {
						size = 'Letter';
					}
					childArgs.push(size);
				}

				childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {

					if (err) {
						return res.render('templates/template-404');
					}

					let pdfFile = path.join(__dirname, '../static-files/cdn/' + fileName);
					fs.exists(pdfFile, (pdfExists) => {
						if (pdfExists) {
							res.setHeader('Content-disposition', 'attachment; filename=resume.pdf');
							res.setHeader('Content-type', 'application/pdf');	
							let stream = fs.createReadStream(pdfFile);	
							stream.pipe(res);
						} else {
							return res.render('templates/template-404');
						}
					});	
				})

				// DEPRECHATED
				// return;

				// let isUserPro = UsersCtrl.isUserPro(data.user);

				// ExportController.readTemplate('templates/' + data.resume.meta.defaultTemplate.slug + '/index.ejs')
				// .then((htmlData) => {
				// 	console.log('HELLO>>>> ', ExportUtil.getCustomCSS(data.resume.meta.defaultTemplate.slug));
				// 	let html = ejs.render(htmlData, { 
				// 		resume: data.resume, 
				// 		s: sanitizer, 
				// 		isUserPro: isUserPro,
				// 		moment: Utils.DateFormater,
				// 		host: req.protocol + '://' + req.headers.host,
				// 		exportCustomCSS: ExportUtil.getCustomCSS(data.resume.meta.defaultTemplate.slug) || ''
				// 	});

				// 	res.setHeader('Content-disposition', 'attachment; filename=resume.pdf');
				// 	res.setHeader('Content-type', 'application/pdf');

				// 	pdf.create(html, {
				// 		format: 'A3',
				// 		border: { // only on certain templates
				// 			top: '20px',            // default is 0, units: mm, cm, in, px
				// 			bottom: '20px',
				// 			left: '20px',
				// 			right: '20px'
				// 		},						
				// 	}).toStream(function(err, stream) {
				// 		if (err) {
				// 			return res.render('templates/template-404');
				// 		}
						
				// 		stream.pipe(res);

				// 		// or use event handlers
				// 		stream.on('data', function(data) {
				// 			res.write(data);
				// 		});

				// 		stream.on('end', function() {
				// 			res.end();
				// 		});
				// 	});
				// 	//res.send(html);
				// })
				// .catch((err) => {
				// 	console.log(err);
				// 	res.render('templates/template-404');
				// });
				// // console.log(html);
				// // res.send(html);
			}			
		})
		.catch((err) => {
			console.log(err);
			res.render('templates/template-404');
		});
	}

	// read template content
	static readTemplate(fPath) {
		return new Promise((resolve, reject) => {
			let filePath = path.join(__dirname, '../views/' + fPath);
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return reject(err);
				}
				resolve(data);
			});
		});
	}
}

module.exports = ExportController;