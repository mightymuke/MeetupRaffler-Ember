App.MeetupsIndexRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  model: function() {
  	return $.getJSON('https://api.meetup.com/2/groups?member_id=:memberId&access_token=:access_token')
  		.then(function(data) {
  			console.log(data);
  		});
    //return meetups.results.sort(MeetupRaffler.sorter('name', false, function(a){return a.toUpperCase()}));
  }
});
