dojo.provide("soashable.view.RegistrationView");

dojo.require("soashable.Application");
dojo.require("soashable.model.AccountModel");
/**
 * Responsible for rendering a registration screen. Updates AccountModel.
 */
dojo.declare( "soashable.view.RegistrationView", Xmpp4Js.Event.EventProvider,{

    constructor: function(application, accountModel) {
        this.application = application;
        this.accountModel = accountModel;

        this.addEvents({
          register_clicked: true
        });

        this.accountModel.on("update", this.accountModelUpdated, this );
    },

    render: function() {
        jQuery("<div id=\"registration\"><dl>"
            + "<dt>username</dt><dd><input type=\"text\" id=\"register-node\"/></dd>" 
            + "<dt>password</dt><dd><input type=\"text\" id=\"register-password\"/></dd>" 
            + "<dt></dt><dd><button id=\"register-button\">Register</button></dd>"
            + "</dl></div>").appendTo(jQuery("body"));
        
        this.mainEl = document.getElementById("registration");
        this.nodeEl = document.getElementById("register-node");
        this.passwordEl = document.getElementById("register-password");
        this.buttonEl = document.getElementById("register-button");
        
        var self = this;
        this.buttonEl.addEventListener("click", function() { self.registerClicked(); }, false);
    },
    destroy: function() {
        jQuery(this.mainEl).remove();
        this.mainEl = null;
    },
    
    
    
    registerClicked: function() {

        this.accountModel.node = this.nodeEl.value;
        this.accountModel.password = this.passwordEl.value;

        this.accountModel.fireEvent("update");

        this.fireEvent("register_clicked");
    },
    
    accountModelUpdated: function() {
        this.nodeEl.value = this.accountModel.node;
        this.passwordEl.value = this.accountModel.password;
    }
});