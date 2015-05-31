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
	odoreading: {
		type: Number,
		default: 0,
		required: 'Please fill odometer reading',
		trim: true,
        min:1,
        max: 999999
	},
    distanceunit: {
        type: String,
        enum: ['mil', 'kms']
    },
    fuelreading: {
        type: Number,
        default: 0,
        required: 'Please fill the gas pump reading',
        trim: true,
        min:1,
        max: 999
    },
    fuelunit: {
        type: String,
        enum: ['galn', 'litr']
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    car: {
        type: Schema.ObjectId,
        ref: 'Car'
    }
});

mongoose.model('Reading', ReadingSchema);
