dojo.provide("soashable.model.AccountModel");

/**
 * The model for registration and login information.
 */
dojo.declare( "soashable.model.AccountModel", Xmpp4Js.Event.EventProvider, { 
    constructor: function() {
      this.domain = "";
      this.node = "";
      this.resource = "";
      this.password = "";
      this.priority = 5;
      this.email = "";

      this.addEvents({
        update: true
      });
  }
});
