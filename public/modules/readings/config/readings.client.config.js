'use strict';

// Configuring the Articles module
angular.module('readings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Readings', 'readings', 'dropdown', '/readings(/create)?');
		Menus.addSubMenuItem('topbar', 'readings', 'List Readings', 'readings');
		Menus.addSubMenuItem('topbar', 'readings', 'New Reading', 'readings/create');
	}
]);