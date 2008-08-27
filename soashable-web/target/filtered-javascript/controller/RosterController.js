dojo.provide("soashable.controller.RosterController");

dojo.require("soashable.Application");
dojo.require("soashable.controller.AccountController");
dojo.require("soashable.model.RosterModel");
dojo.require("soashable.view.RosterView");

/**
 * Responsible for managing the roster.
 */
dojo.declare("soashable.controller.RosterController", Xmpp4Js.Event.EventProvider, {
    constructor: function(application) {
        this.application = application;
        this.rosterModel = new soashable.model.RosterModel();

        this.rosterView = new soashable.view.RosterView(application, this.rosterModel);

        this.application.on("controller_added", this.controllerAdded, this);
    },

    controllerAdded: function(name, controller) {
        if( controller instanceof soashable.controller.AccountController ) {
            // FIXME tightly coupled
            controller.on( "login_success", this.loginSuccess, this );
            controller.on( "logged_out", this.loggedOut, this );
        }
    },
    
    loginSuccess: function() {
        this.rosterView.render();
    },
    
    loggedOut: function() {
        this.rosterView.destroy();
    }
    
});
