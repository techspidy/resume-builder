/* jshint node: true */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const db_config = require('../../config/config').db_config;


// files schema
let FilesSchema  = new Schema({
	userId: { type: ObjectId, required: true },
	imageId: { type: String },
	size: { type: Number, default: 0 },
	meta: { type: Object, default: {} },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(db_config.models.Files, FilesSchema);
