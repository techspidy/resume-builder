/* jshint node: true */
'use strict';

let express = require('express');
let router = express.Router();

const AuthController = require('../../controllers/auth-controller');

router.post('/', AuthController.authenticate);

module.exports = router;
