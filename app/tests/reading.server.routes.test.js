'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reading = mongoose.model('Reading'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reading;

/**
 * Reading routes tests
 */
describe('Reading CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Reading
		user.save(function() {
			reading = {
				name: 'Reading Name'
			};

			done();
		});
	});

	it('should be able to save Reading instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reading
				agent.post('/readings')
					.send(reading)
					.expect(200)
					.end(function(readingSaveErr, readingSaveRes) {
						// Handle Reading save error
						if (readingSaveErr) done(readingSaveErr);

						// Get a list of Readings
						agent.get('/readings')
							.end(function(readingsGetErr, readingsGetRes) {
								// Handle Reading save error
								if (readingsGetErr) done(readingsGetErr);

								// Get Readings list
								var readings = readingsGetRes.body;

								// Set assertions
								(readings[0].user._id).should.equal(userId);
								(readings[0].name).should.match('Reading Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reading instance if not logged in', function(done) {
		agent.post('/readings')
			.send(reading)
			.expect(401)
			.end(function(readingSaveErr, readingSaveRes) {
				// Call the assertion callback
				done(readingSaveErr);
			});
	});

	it('should not be able to save Reading instance if no name is provided', function(done) {
		// Invalidate name field
		reading.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reading
				agent.post('/readings')
					.send(reading)
					.expect(400)
					.end(function(readingSaveErr, readingSaveRes) {
						// Set message assertion
						(readingSaveRes.body.message).should.match('Please fill Reading name');
						
						// Handle Reading save error
						done(readingSaveErr);
					});
			});
	});

	it('should be able to update Reading instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reading
				agent.post('/readings')
					.send(reading)
					.expect(200)
					.end(function(readingSaveErr, readingSaveRes) {
						// Handle Reading save error
						if (readingSaveErr) done(readingSaveErr);

						// Update Reading name
						reading.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reading
						agent.put('/readings/' + readingSaveRes.body._id)
							.send(reading)
							.expect(200)
							.end(function(readingUpdateErr, readingUpdateRes) {
								// Handle Reading update error
								if (readingUpdateErr) done(readingUpdateErr);

								// Set assertions
								(readingUpdateRes.body._id).should.equal(readingSaveRes.body._id);
								(readingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Readings if not signed in', function(done) {
		// Create new Reading model instance
		var readingObj = new Reading(reading);

		// Save the Reading
		readingObj.save(function() {
			// Request Readings
			request(app).get('/readings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reading if not signed in', function(done) {
		// Create new Reading model instance
		var readingObj = new Reading(reading);

		// Save the Reading
		readingObj.save(function() {
			request(app).get('/readings/' + readingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reading.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reading instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reading
				agent.post('/readings')
					.send(reading)
					.expect(200)
					.end(function(readingSaveErr, readingSaveRes) {
						// Handle Reading save error
						if (readingSaveErr) done(readingSaveErr);

						// Delete existing Reading
						agent.delete('/readings/' + readingSaveRes.body._id)
							.send(reading)
							.expect(200)
							.end(function(readingDeleteErr, readingDeleteRes) {
								// Handle Reading error error
								if (readingDeleteErr) done(readingDeleteErr);

								// Set assertions
								(readingDeleteRes.body._id).should.equal(readingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reading instance if not signed in', function(done) {
		// Set Reading user 
		reading.user = user;

		// Create new Reading model instance
		var readingObj = new Reading(reading);

		// Save the Reading
		readingObj.save(function() {
			// Try deleting Reading
			request(app).delete('/readings/' + readingObj._id)
			.expect(401)
			.end(function(readingDeleteErr, readingDeleteRes) {
				// Set message assertion
				(readingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reading error error
				done(readingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reading.remove().exec();
		done();
	});
});