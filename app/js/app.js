MeetupRaffler = {};

MeetupRaffler.templates = [
  'partials/index.html',
  'partials/meetups.html',
  'partials/meetup.html'
];

MeetupRaffler.initialize = function() {
  $.each(this.templates, function() {
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

// primer = parseInt for numbers
//        = function(a){return a.toUpperCase()} for case insensitive search
MeetupRaffler.sorter = function(field, reverse, primer){

  /**
   * Retrieve nested item from object/array
   * @param {Object|Array} obj
   * @param {String} path dot separated
   * @param {*} def default value ( if result undefined )
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

MeetupRaffler.initialize();

/*****************************/
/* Application               */
/*****************************/

App = Ember.Application.create({});

Ember.Application.initializer({
	name: 'meetupRaffler',
	initialize: function(container, application) {
		// customize the session so that it allows access to the account object
		Ember.SimpleAuth.Session.reopen({
			account: function() {
				var accountId = this.get('account_id');
				if (!Ember.isEmpty(accountId)) {
					return container.lookup('store:main').find('account', accountId);
				}
			}.property('accountId')
		});
		// register the meetup authenticator so the session can find it
		container.register('authenticators:meetup', App.MeetupAuthenticator);
		//container.register('location:hash-from-url', App.HashLocationFromUrl);
		Ember.SimpleAuth.setup(container, application);
	}
});

// App.HashLocationFromUrl = Ember.HashLocation.extend({
// 	getHashHash: function() {
// 		var hash = '';
// 		var location = get(this, 'location');
// 		if (location.hash) {
// 			var urlHash = location.hash.substr(1);
// 			console.log('urlHash');
// 			if (urlHash) {
// 				hash = urlHash.substring(urlHash.indexOf('#') + 1);
// 			}
// 		}
// 		return hash;
// 	}
// });
 
// App.Router.reopen({
// 	location: 'hash-from-url'
// });
App.Router.reopen({
	rootURL: '/app/index.html'
});

App.Router.map(function() {
	this.resource('login', { path: ':oauth2Credentials' });
	this.resource('meetups', function() {
		this.resource('meetup', { path: ':groupId' });
	});
});

// the meetup authenticator that handles the authenticated account
App.MeetupAuthenticator = Ember.SimpleAuth.Authenticators.OAuth2.extend({
	authenticate: function(credentials) {
	 	return new Ember.RSVP.Promise(function(resolve, reject) {
			// Redirect to meetup if no credentials supplied
			if ((!credentials) || (jQuery.isEmptyObject(credentials))) {
				window.location.replace("https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8002%2Fapp%2Findex.html%23%2Flogin");
			} else if (credentials.access_token) {
	 			Ember.run(function() {
	 				// resolve (including the account id) as the AJAX request was successful; all properties this promise resolves
	 				// with will be available through the session
	 				resolve(credentials);
	 			});
		 	} else {
				reject(credentials.error);
		 	}
 		});
	}
});

// use the provided mixins in the application route and login controller
App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
	actions: {
		// override authenticateSession to instead of transitioning to a login route start authentication directly
		authenticateSession: function() {
			this.get('session').authenticate('authenticators:meetup', {});
		}
	}
});

// clear a potentially stale error message from previous login attempts
App.authenticationRoute = Ember.Route.extend({
	setupController: function(controller, model) {
		controller.set('errorMessage', null);
	}
});
