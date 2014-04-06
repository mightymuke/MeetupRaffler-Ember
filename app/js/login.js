App.LoginRoute = Ember.Route.extend({
	afterModel: function() {
		if (this.session.get('isAuthenticated')) {
			this.transitionTo('meetups');
		}
	},
	model: function(params) {
		var getAuthDataFromPath = function(path) {
			var hash = '';
			if (path) {
				hash = path.substring(path.indexOf('#') + 1);
			}
			return hash;
		};

		var getAuthStuff = function(queryString) {
			var data = {};
			var dataItems = queryString.split('&');
			for (var i = 0; i < dataItems.length; i++) {
				var dataItem = dataItems[i].split('=');
				if (dataItem.length !== 2) {
					continue;
				}
				data[dataItem[0]] = dataItem[1];
			 }
			 return data;
		}

		var authData = getAuthDataFromPath(params.oauth2Credentials);
		this.get('session').authenticate('authenticators:meetup', getAuthStuff(authData));
	}
});
