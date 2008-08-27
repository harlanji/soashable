dojo.provide("soashable.view.LoginView");

dojo.require("soashable.Application");
dojo.require("soashable.model.AccountModel");
/**
 * Responsible for rendering a login screen. Updates AccountModel.
 */
dojo.declare( "soashable.view.LoginView", Xmpp4Js.Event.EventProvider,{
    constructor: function(application, accountModel) {
        this.application = application;
        this.accountModel = accountModel;

        this.addEvents({
          login_clicked: true,
          register_clicked: true
        });

        this.accountModel.on("update", this.accountModelUpdated, this );
    },

    render: function() {
        jQuery("<div id=\"login\"><dl>"
            + "<dt>username</dt><dd><input type=\"text\" id=\"login-node\"/></dd>" 
            + "<dt>password</dt><dd><input type=\"text\" id=\"login-password\"/></dd>" 
            + "<dt></dt><dd><button id=\"login-button\">Login</button></dd>"
            + "<dt></dt><dd><button id=\"login-register-button\">Registration Form</button></dd>"
            + "</dl></div>").appendTo(jQuery("body"));
        
        this.mainEl = document.getElementById("login");
        this.nodeEl = document.getElementById("login-node");
        this.passwordEl = document.getElementById("login-password");
        this.buttonEl = document.getElementById("login-button");
        this.registerButtonEl = document.getElementById("login-register-button");
        
        var self = this;
        this.buttonEl.addEventListener("click", function() { self.loginClicked(); }, false);
        this.registerButtonEl.addEventListener("click", function() { self.registerClicked(); }, false);
    },
    destroy: function() {
        jQuery(this.mainEl).remove();
        this.mainEl = null;
    },
    
    
    
    
    loginClicked: function() {
        this.accountModel.node = this.nodeEl.value;
        this.accountModel.password = this.passwordEl.value;
        this.accountModel.resource = "xmpp4js";
        this.accountModel.priority = 5;
        
        // TODO should this happen in account model
        this.accountModel.fireEvent("update");
        
        this.fireEvent("login_clicked");
    },
    registerClicked: function() {
        this.fireEvent("register_clicked");
    },
    accountModelUpdated: function() {
        this.nodeEl.value = this.accountModel.node;
        this.passwordEl.value = this.accountModel.password;
    }
});

