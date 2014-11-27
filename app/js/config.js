window.EmberENV = {
	AppConfig: {

		useMeetupWebServices: true,      // If false will used cached data files

		userMeetupId: 69467752,          // Users meetup ID

		htmlTemplates: [
			'partials/index.html',
			'partials/meetups.html',
			'partials/meetup.html'
		],

		urls: {
			meetups: function() {
				var url = '/app/data/meetups.json';
				if (EmberENV.AppConfig.useMeetupWebServices) {
					url = 'https://api.meetup.com/2/groups?member_id=' + EmberENV.AppConfig.userMeetupId;
				}
				return url;
			}
		},

		initialize: function() {
			// Load up all the HTML templates
			$.each(this.htmlTemplates, function() {
				$.ajax({
					async: false,
					type: 'GET',
					url: this,
					success: function(resp) {
						$('body').append(resp);
					}
				});
			});
		}
	}
};
