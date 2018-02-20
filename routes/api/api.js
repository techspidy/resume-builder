/* jshint node: true */
'use strict';

let express = require('express');
let router = express.Router();
const api_meta = require('../../config/config').api_meta;

const UsersController = require('../../controllers/users');
const ResumesController = require('../../controllers/resumes');
let AuthorizationController = require('../../controllers/authorization');
const FilesController = require('../../controllers/files');
const TemplatesController = require('../../controllers/templates');
const JobsController = require('../../controllers/jobs');
const ExportController = require('../../controllers/ExportController');

// info about API
router.use('/info', (req, res, next) => {
	res.status(200).json(api_meta);
});

// start public jobs api
router.get('/Jobs/:provider/:country/:page/:limit/:query', JobsController.getJobsByProvider);
// end public jobs api

// create or update users
router.put('/Users', UsersController.authenticate);

// validate token
router.use('*', (req, res, next) => {
	var decoded = AuthorizationController.isValidToken(req);
	if (!decoded) {
		return res.status(403).json({
			title: 'Invalid token',
			status: 403
		});
	}
	UsersController.getUser(decoded.userId)
	.then((user) => {
		req.user = user;
		next();
	})
	.catch(next);
});

// get users (only admin is allowed)
router.get('/Users', UsersController.getAllUsers);

// get context user
router.get('/Users/:id', UsersController.getContextUser);

// update user options
router.put('/Users/:id/options', UsersController.updateOptions);

// update user permalink
router.put('/Users/:id/permalink', UsersController.updateUserPermalink);

// remove user
router.delete('/Users/:id', UsersController.removeUser);

// create resume
router.post('/Resumes', ResumesController.createNew);

// delete resume
router.delete('/Resumes/:id', ResumesController.remove);

// update resume
router.put('/Resumes/:id', ResumesController.update);

// clone resume
router.post('/Resumes/clone', ResumesController.clone);

// get all resumes
router.get('/Resumes', ResumesController.index);

// get resumes
router.get('/Resumes/:id', ResumesController.getResume);

// get resumes for user ( only if admin )
router.get('/Resumes/resumes-for-user/:userId', ResumesController.getResumesForUser);



// get all files
router.get('/Files', FilesController.index);

// upload file
router.post('/Files', FilesController.create);

// delete file
router.delete('/Files/:id', FilesController.deleteFile);

// get all templates
router.get('/Templates', TemplatesController.index);

// get all templates
router.get('/Exports/:userSlug/:resumeSlug/:formatModel/:format', ExportController.export);


module.exports = router;
