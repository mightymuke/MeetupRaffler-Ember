/*

 This class maintains a list of notifications on the scope, and cleans up notifications
 as they are processed by the directive.  It is important to note the "notifications"
 model added to scope here... this is called out by name in HTML and from the accompanying
 directive.  Changing the name will break notification functionality.

 R.Christian

 */
var NotificationManager = function(application) {

    // notification queue
    application.Notifications = [];  // WARN:  Don't change this variable name, it's coupled to scope and outside of this function.

    // remove processed notifications
    this.sweepNotifications = function () {

        for (var i=0; i < application.Notifications.length; i++) {
            if(application.Notifications[i].processed == true) {
                application.Notifications = application.Notifications.splice(i, 0);
                i = i + 1;
                continue;
            }
        }

    }

    // add notification to model
    this.notify = function(type, text) {

        // convenient place to say "while we're
        // here, clear all processed notifications
        // from the model
        this.sweepNotifications();

        // push notifications onto scope to be observed by directive
        application.Notifications.push({"type": type, "text": text});

        // set notification (noty) defaults on global scope
        var opts = {
            layout: 'center',
            theme: 'defaultTheme',
            dismissQueue: true, // If you want to use queue feature set this true
            template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
            animation: {
                open: {height: 'toggle'},
                close: {height: 'toggle'},
                easing: 'swing',
                speed: 250 // opening & closing animation speed
            },
            timeout: false, // delay for closing event. Set false for sticky notifications
            force: false, // adds notification to the beginning of queue when set to true
            modal: false,
            maxVisible: 5, // you can set max visible notification for dismissQueue true option
            closeWith: ['click'], // ['click', 'button', 'hover']
            callback: {
                onShow: function() {},
                afterShow: function() {},
                onClose: function() {},
                afterClose: function() {}
            },
            buttons: false // an array of buttons
        };

        if (application.Notifications && application.Notifications.length > 0) {
            for (var i = 0; i < application.Notifications.length; i++) {
                var notification = application.Notifications[i];
                if (notification['processed']) {
                    continue;
                }
                var text = notification['text'];
                var type = notification['type'];

                opts.text = text;
                opts.type = type;

                // errors persist on screen longer
                if (type == 'error') {
                    opts.timeout = 55000;
                }

                notification['processed'] = true;

                noty(opts);
            }
        }
    }
}