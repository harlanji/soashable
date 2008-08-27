dojo.provide("soashable.controller.AccountController");

dojo.require("soashable.Application");
dojo.require("soashable.controller.PreferencesController");
dojo.require("soashable.model.AccountModel");
dojo.require("soashable.view.LoginView");
dojo.require("soashable.view.RegistrationView");

/**
 * Manages account registration and login; handles interaction with server.
 */
dojo.declare("soashable.controller.AccountController", Xmpp4Js.Event.EventProvider, {
    constructor: function(application) {
        this.application = application;

        this.accountModel = new soashable.model.AccountModel();

        // create views
        this.loginView = new soashable.view.LoginView(application, this.accountModel);
        this.registrationView = new soashable.view.RegistrationView(application, this.accountModel);


        this.addEvents({
          login_success: true,
          login_failure: true,
          registration_success: true,
          registration_failure: true,
          logged_out: true
        })


        // setup event listeners
        application.on( "controller_added", this.controllerAdded, this);

        this.loginView.on( "login_clicked", this.loginClicked, this );
        this.loginView.on( "register_clicked", this.loginRegisterClicked, this );
        this.registrationView.on( "register_clicked", this.registerClicked, this );
    }, 
    
    showLoginScreen: function() {
        this.loginView.render();
    },

    
    
    
    controllerAdded: function(name, controller) {
        if( controller instanceof soashable.controller.PreferencesController ) {
            this.accountModel.domain = controller.get( "domain" );
        }
    },
    
    loginClicked: function() {
        this.stanzaProvider = new Xmpp4Js.Packet.StanzaProvider();
        this.stanzaProvider.registerDefaultProviders();
        
        this.extensionProvider = new Xmpp4Js.Ext.PacketExtensionProvider();
        this.extensionProvider.register( Xmpp4Js.Ext.MessageEvent.XMLNS, Xmpp4Js.Ext.MessageEvent );
        this.extensionProvider.register( Xmpp4Js.Ext.ChatStates.XMLNS, Xmpp4Js.Ext.ChatStates );

        this.con = new Xmpp4Js.Connection({
            transport: {
                clazz: Xmpp4Js.Transport.Script,
                endpoint: "http://bosh*.soashable.com:7070/http-bind/",
                useKeys: true
            },
            stanzaProvider: this.stanzaProvider,
            listeners: {
                scope : this,
                error : this.connectionError,
                close : this.connectionClosed
            }
        });
        
        this.con.on("connect", this.connectedForLogin, this, {single: true});

        this.con.connect( this.accountModel.domain );
        
        alert("connecting");
        
    },
    
    connectedForLogin: function() {
        var loginFlow = new Xmpp4Js.Workflow.Login({
            con: this.con,
            listeners: {
                scope: this,
                success: this.loginSuccess,
                failure: this.loginError
            }
        });
        
        var type = this.accountModel.node ? "plaintext" : "anon";
        loginFlow.start( type, this.accountModel.node, this.accountModel.password );

    },
    
    connectionError: function() {
        this.connectionClosed();
    },
    
    connectionClosed: function() {
        this.loginView.render();
        this.fireEvent("logged_out");
    },
    
    loginSuccess: function() {
        this.loginView.destroy();
        this.fireEvent("login_success");
    },
    
    loginError: function() {
        this.fireEvent("login_error");
    },
    
    loggedOut: function() {
        this.loginView.render();
        this.fireEvent("logged_out");
    },
    
    loginRegisterClicked: function() {
        this.registrationView.render();
        //this.loginView.destroy();
    },
    
    registerClicked: function() {
        alert("Going to register account: "+this.accountModel.node+", password="+this.accountModel.password);
    }
});