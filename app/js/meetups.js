// App.MeetupsIndexRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
// 	model: function() {
// 		return meetups.results.sort(MeetupRaffler.sorter('name', false, function(a){return a.toUpperCase()}));
// 	}
// })

App.MeetupsIndexRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
	model: function() {
		//this.get('session').makeRequest('authenticators:meetup', {});
		var memberId = '69467752';
		var accessToken = this.session.get('access_token');
		return Ember.$.ajax({
			type: "GET",
			dataType: 'jsonp',
			url: 'https://api.meetup.com/2/groups?member_id=' + memberId + '&access_token=' + accessToken
		})
		.then(function(data) {
			return data.results.sort(MeetupRaffler.sorter('name', false, function(a){return a.toUpperCase()}));
		});
	}
});
