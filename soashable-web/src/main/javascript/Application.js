dojo.provide("soashable.Application");

dojo.require("soashable.controller.AccountController");
dojo.require("soashable.controller.PreferencesController");
dojo.require("soashable.controller.RosterController");


/**
 * The main class for the Soashable application. Holds and manages controllers.
 */
dojo.declare("soashable.Application", Xmpp4Js.Event.EventProvider, {
    constructor: function() {
        this.controllers = {};

        this.addEvents({
          /**
           * @event controller_added
           * @param name {String} the name of the controller
           * @param controller {Object} the controller
           */
          controller_added: true,

          /**
           * @event controller_removed
           * @param name {String} the name of the controller
           * @param controller {Object} the controller
           */
          controller_removed: true
        });
    },
    createControllers: function() {
        this.controllers = {
            //chat: new soashable.controller.ChatController(this),
            roster: new soashable.controller.RosterController(this),
            account: new soashable.controller.AccountController(this),
            prefernces: new soashable.controller.PreferencesController(this)
            //gateway: new soashable.controller.GatewayController(this)
            //presence: new soashable.controller.PresenceController(this)
        }
        
        // run events after all controllers are added so that they can all
        // have a chance to know when the others have been added.
        // - how can new controllers be informed when an existing one is added?
        //   fire events for all current ones when it is added?
        for( var k in this.controllers ) {
            this.fireEvent( "controller_added", k, this.controllers[k] );
        }
        
    },
    
    start: function() {
        this.createControllers();
        
        // TODO should there be a start event that controllers listen for?
        this.getController("account").showLoginScreen();
    },
    
    getController: function(name) {
        return this.controllers[name];
    }
});