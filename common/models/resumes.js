/* jshint node: true */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const db_config = require('../../config/config').db_config;


// shop schema
let ResumesSchema  = new Schema({
	//id: { type: Number, required: true, index: { unique: true }},
	userId: { type: ObjectId, required: true },	
	sections: { type: Array, default: [] },
	meta: { type: Object, default: {} },	
	createdAt: { type: Date, default: Date.now },
	permalinkSlug: { type: String, required: true, index: true }
});

module.exports = mongoose.model(db_config.models.Resumes, ResumesSchema);
