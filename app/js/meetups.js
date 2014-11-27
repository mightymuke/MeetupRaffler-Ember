MeetupRaffler.MeetupsIndexRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin, {
	model: function() {
		return Ember.$
			.getJSON(EmberENV.AppConfig.urls.meetups())
			.then(function(data) {
				return data.results.sort(EmberENV.sorter('name', false, function(a) { return a.toUpperCase(); }));
			});
	}
});

// MeetupRaffler.MeetupsIndexController = Ember.ArrayController.extend({
// 	sortProperties: ['name']
// });
