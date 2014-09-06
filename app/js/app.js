window.EmberENV = {

	ENABLE_ALL_FEATURES: true,

	'simple-auth': {
		authorizer: 'raffler-authorizer:meetup',
		authenticator: 'raffler-authenticator:meetup',
		store: 'simple-auth-session-store:local-storage',
		crossOriginWhitelist: ['https://api.meetup.com']
	},

	AppConfig: {

		useMeetupWebServices: false,     // If false will used cached data files

		userMeetupId: 69467752,          // Users meetup ID

		htmlTemplates: [
			'partials/index.html',
			'partials/meetups.html',
			'partials/meetup.html'
		],

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
		},

		/**
		 * Sorts an array
		 * @param {Array} field (to be sorted)
		 * @param {Boolean} reverse
		 *        - set to true for reverse order
		 * @param {function}
		 *        - parseInt for numbers
		 *        - function(a){return a.toUpperCase()} for case insensitive search
		 */
		sorter: function(field, reverse, primer){

			/**
			 * Retrieve nested item from object/array
			 * @param {Object|Array} obj
			 * @param {String} path dot separated
			 * @param {*} def default value (if result undefined)
			 * @returns {*}
			 */
			var getItem = function(obj, path, def){

				for(var i = 0,path = path.split('.'),len = path.length; i < len; i++){
					if(!obj || typeof obj !== 'object') return def;
					obj = obj[path[i]];
				}

				if(obj === undefined) return def;
				return obj;
			}

			var key = primer ?
				function(x) {return primer(getItem(x, field));} :
				function(x) {return getItem(x, field);};

			reverse = [-1, 1][+!reverse];

			return function (a, b) {
				return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
			}
		}
	}
};

EmberENV.AppConfig.initialize();
window.ENV = window.ENV || EmberENV;

/*****************************/
/* Application               */
/*****************************/

MeetupRaffler = Ember.Application.create({
  LOG_TRANSITIONS: true
});

MeetupRaffler.Helpers = {};

Ember.Application.initializer({
	name: 'meetupRaffler',
	before: 'simple-auth',
	initialize: function(container, application) {
		// Register the meetup authenticator so the session can find it
		container.register(EmberENV['simple-auth'].authenticator, MeetupRaffler.MeetupAuthenticator);
		container.register(EmberENV['simple-auth'].authorizer, MeetupRaffler.MeetupAuthorizer);

		// Create the notification control
		MeetupRaffler.Notifier = new NotificationManager(application);
	}
});

MeetupRaffler.Router.reopen({
	rootURL: '/app/index.html'
});

MeetupRaffler.Router.map(function() {
	this.resource('login', { path: ':oauth2Credentials' });
	this.resource('meetups', function() {
		this.resource('meetup', { path: ':groupId' });
	});
	this.resource('winners');
});

MeetupRaffler.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
	actions: {
		// Override authenticateSession to instead of transitioning to a login route start authentication directly
		authenticateSession: function() {
			this.get('session').authenticate(EmberENV['simple-auth'].authenticator, {});
		},
		sessionAuthenticationSucceeded: function() {
	 		MeetupRaffler.Notifier.notify('information', 'Successfully logged in!');
			this.transitionTo('meetups');
		},
		sessionInvalidationSucceeded: function() {
			MeetupRaffler.Notifier.notify('information', 'Thanks for visiting. You have been signed out.');
			this.transitionTo('index');
		}
	}
});

MeetupRaffler.ApplicationController = Ember.ObjectController.extend({
	useMeetupWebServices: EmberENV.AppConfig.useMeetupWebServices
});

MeetupRaffler.MeetupAuthenticator = SimpleAuth.Authenticators.OAuth2.extend({
	authenticate: function(credentials) {
	 	return new Ember.RSVP.Promise(function(resolve, reject) {
			// Redirect to meetup if no credentials supplied
			if ((!credentials) || (jQuery.isEmptyObject(credentials))) {
				if (EmberENV.AppConfig.useMeetupWebServices) {
					window.location.href = "https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8002%2Fapp%2Findex.html%23%2Flogin";
				} else {
					window.location.href = "/app/index.html#/login#expires_in=3600&token_type=bearer&access_token=offline";
				}
			} else if (credentials.access_token) {
	 			Ember.run(function() {
	 				resolve(credentials);
	 			});
		 	} else {
				reject(credentials.error);
		 	}
 		});
	}
});

MeetupRaffler.MeetupAuthorizer = SimpleAuth.Authorizers.OAuth2.extend({
	authorize: function(jqXHR, requestOptions) {
		var isSecureUrl = function(url) {
			var link  = document.createElement('a');
			link.href = url;
			link.href = link.href;
			return link.protocol == 'https:';
		};

		var accessToken = this.get('session.access_token');

		if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken) && EmberENV.AppConfig.useMeetupWebServices) {
			if (!isSecureUrl(requestOptions.url)) {
				Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
			}
			requestOptions.url += "&access_token=" + accessToken;
		}
	}
});
