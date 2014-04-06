App.MeetupRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
	model: function() {
		return {
			event_url: "http://meetup.com",
			group: {
				name: 'Meetup Name',
				who: "Cool Peoples"
			},
			name: "Meetup Event Name",
			yes_rsvp_count: 55,
			rsvps: meetupRsvps.results.sort(MeetupRaffler.sorter('member.name', false, function(a){return a.toUpperCase()}))
		};
	}
})
