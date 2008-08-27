dojo.provide("soashable.view.GatewayRegistrationView");


dojo.declare("soashable.view.GatewayRegistrationView", Xmpp4Js.Event.EventProvider, {
    constructor: function(application, gatewayModel) {
        this.application = application;
        this.gatewayModel = gatewayModel;
        

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
    
});

