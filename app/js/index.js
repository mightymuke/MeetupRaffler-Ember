MeetupRaffler.IndexRoute = Ember.Route.extend({
	model: function() {
		return { title: "Dashboard" };
	}
});

MeetupRaffler.IndexController = Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		edit: function() {
			this.set('isEditing', true);
		},
		doneEditing: function() {
			this.set('isEditing', false);
		}
	}
});
