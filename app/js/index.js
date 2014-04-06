App.IndexRoute = Ember.Route.extend({
	model: function() {
		return { title: "Dashboard" };
	}
});

App.IndexController = Ember.ObjectController.extend({
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
