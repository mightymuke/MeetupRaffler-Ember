// App.MeetupRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
// 	model: function() {
// 		var model = meetup.results[0];
// 		model.rsvps = meetupRsvps.results.sort(MeetupRaffler.sorter('member.name', false, function(a){return a.toUpperCase()}));
// 		return model; 
// 	}
// })

App.MeetupRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
	model: function(params) {
		var explodeTheGuests = function(rsvps) {
			var guests = rsvps.filter(function(rsvp) {
				return rsvp.guests > 0;
			});

			guests.forEach(function(rsvp) {
				for (var guest = 0; guest < rsvp.guests; guest++) {
					rsvps.push({
						member: {
							name: rsvp.member.name + ' (Guest #' + (guest + 1) + ')',
							member_id: rsvp.member_id
						},
						rsvp_id: rsvp.rsvp_id
					});
				}
			});

			return rsvps;
		}

		var model = {};

		//this.get('session').makeRequest('authenticators:meetup', {});
		var groupId = params.groupId;
		var accessToken = this.session.get('access_token');

		return Ember.$.ajax({
			type: "GET",
			dataType: 'jsonp',
			url: 'https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=' + groupId + '&access_token=' + accessToken
		})
		.then(function(dataData) {
			model = dataData.results[0];
			return Ember.$.ajax({
				type: "GET",
				dataType: 'jsonp',
				url: 'https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=' + model.id + '&access_token=' + accessToken
			});
		})
		.then(function(rsvpData) {
			var rsvps = explodeTheGuests(rsvpData.results);
			model.rsvps = rsvps.sort(MeetupRaffler.sorter('member.name', false, function(a){return a.toUpperCase()}))
			return model;
		});
	}
});
