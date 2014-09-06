MeetupRaffler.MeetupsIndexRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin, {
	model: function() {
		var url = 'https://api.meetup.com/2/groups?member_id=' + EmberENV.AppConfig.userMeetupId;
		if (!EmberENV.AppConfig.useMeetupWebServices) {
			url = '/app/data/meetups.json';
		}
		return Ember.$
			.getJSON(url)
			.then(function(data) {
				return data.results.sort(EmberENV.AppConfig.sorter('name', false, function(a) { return a.toUpperCase(); }));
			});
	}
});

// MeetupRaffler.MeetupsIndexController = Ember.ArrayController.extend({
// 	sortProperties: ['name']
// });
