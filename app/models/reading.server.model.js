'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reading Schema
 */
var ReadingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Reading name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Reading', ReadingSchema);