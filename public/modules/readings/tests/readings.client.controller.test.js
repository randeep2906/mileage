'use strict';

(function() {
	// Readings Controller Spec
	describe('Readings Controller Tests', function() {
		// Initialize global variables
		var ReadingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Readings controller.
			ReadingsController = $controller('ReadingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reading object fetched from XHR', inject(function(Readings) {
			// Create sample Reading using the Readings service
			var sampleReading = new Readings({
				name: 'New Reading'
			});

			// Create a sample Readings array that includes the new Reading
			var sampleReadings = [sampleReading];

			// Set GET response
			$httpBackend.expectGET('readings').respond(sampleReadings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.readings).toEqualData(sampleReadings);
		}));

		it('$scope.findOne() should create an array with one Reading object fetched from XHR using a readingId URL parameter', inject(function(Readings) {
			// Define a sample Reading object
			var sampleReading = new Readings({
				name: 'New Reading'
			});

			// Set the URL parameter
			$stateParams.readingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/readings\/([0-9a-fA-F]{24})$/).respond(sampleReading);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reading).toEqualData(sampleReading);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Readings) {
			// Create a sample Reading object
			var sampleReadingPostData = new Readings({
				name: 'New Reading'
			});

			// Create a sample Reading response
			var sampleReadingResponse = new Readings({
				_id: '525cf20451979dea2c000001',
				name: 'New Reading'
			});

			// Fixture mock form input values
			scope.name = 'New Reading';

			// Set POST response
			$httpBackend.expectPOST('readings', sampleReadingPostData).respond(sampleReadingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reading was created
			expect($location.path()).toBe('/readings/' + sampleReadingResponse._id);
		}));

		it('$scope.update() should update a valid Reading', inject(function(Readings) {
			// Define a sample Reading put data
			var sampleReadingPutData = new Readings({
				_id: '525cf20451979dea2c000001',
				name: 'New Reading'
			});

			// Mock Reading in scope
			scope.reading = sampleReadingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/readings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/readings/' + sampleReadingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid readingId and remove the Reading from the scope', inject(function(Readings) {
			// Create new Reading object
			var sampleReading = new Readings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Readings array and include the Reading
			scope.readings = [sampleReading];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/readings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReading);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.readings.length).toBe(0);
		}));
	});
}());