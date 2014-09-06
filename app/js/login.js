MeetupRaffler.LoginRoute = Ember.Route.extend({
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
		this.get('session').authenticate(EmberENV['simple-auth'].authenticator, getAuthStuff(authData));
	}
});
