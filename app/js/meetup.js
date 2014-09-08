MeetupRaffler.MeetupRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin, {
	model: function(params) {

		var model = {};

		var meetupUrl = 'https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=' + params.groupId;
		if (!EmberENV.AppConfig.useMeetupWebServices) {
			meetupUrl = '/app/data/meetup.json';
		}

		return Ember.$
			.getJSON(meetupUrl)
			.then(function(meetupData) {
				model = meetupData.results[0];
				var rsvpUrl = 'https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=' + model.id;
				if (!EmberENV.AppConfig.useMeetupWebServices) {
					rsvpUrl = '/app/data/rsvps.json';
				}
				return Ember.$.getJSON(rsvpUrl);
			})
			.then(function(rsvpData) {
				var rsvps = MeetupRaffler.Helpers.explodeTheGuests(rsvpData.results);
				model.rsvps = rsvps.sort(EmberENV.AppConfig.sorter('member.name', false, function(a) { return a.toUpperCase(); }));
				var winnersUrl = '/app/data/winners.json';
				return Ember.$.getJSON(winnersUrl);
			})
			.then(function(winnersData) {
				model.winners = winnersData;
				return model;
			});
	}
});

MeetupRaffler.MeetupController = Ember.ObjectController.extend({
	isSelectingPrizeWinner: false,

	actions: {
		getRandomMember: function() {
			MeetupRaffler.Helpers.getRandomMember(this, this.get('model.winners'));
		},

		resetMemberTiles: function() {
			MeetupRaffler.Helpers.clearWinner();
			this.set('isSelectingPrizeWinner', false);
		}
	}
});
