/* jshint node: true */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const db_config = require('../../config/config').db_config;

// shop schema
let UserSchema  = new Schema({
	//id: { type: Number, required: true, index: { unique: true }},
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	email: { type: String, required: true, index: { unique: true }},	
	userPhoto: { type: String },			
	subdomainSlug: { type: String },
	payment: { type: Object, default: {}},
	createdAt: { type: Date, default: Date.now },
	lastLogin: { type: Date, default: Date.now },
	linkedinId: { type: String, required: false },
	options: { type: Object},
	meta: { type: Object, default: {}},
	permalinkSlug: { type: String, required: true, index: true },
	lastExport: { type: Date }
});

module.exports = mongoose.model(db_config.models.Users, UserSchema);