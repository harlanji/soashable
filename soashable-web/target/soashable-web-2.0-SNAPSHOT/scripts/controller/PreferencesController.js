dojo.provide("soashable.controller.PreferencesController");

dojo.require("soashable.Application");

/**
 * Holds and manages preferences for use by other controllers.
 */
dojo.declare("soashable.controller.PreferencesController", Xmpp4Js.Event.EventProvider, {
    constructor: function(application) {
        this.application = application;
        this.map = {
          domain: "soashable.com"
        };
    },

    get: function(key) {
        return this.map[key];
    },
    set: function(key, value) {
        this.map[key] = value;
    }
});
