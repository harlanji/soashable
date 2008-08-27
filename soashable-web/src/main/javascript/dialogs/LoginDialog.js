Ext.namespace( "Soashable.Dialog" );


/**
 * @class
 */
Soashable.Dialog.LoginDialog = function(config) {
    this.lang = config.lang;
    
    var superConfig = Ext.apply( config, {
        title: "Login To Soashable",
        width: 545,
        bodyStyle: 'padding: 7px',

        resizable: false,
        closable: false,

        layout: 'table',
        layoutConfig: {
            columns: 2
        },
        defaults: {
            bodyStyle:'margin:3px; padding: 7px'
        },
        items: [
            {
                xtype: "soashable.loginbox.network",
                network: "soashable",
                title: this.lang.netSoashable,
                lang: this.lang,
                listeners: {
                    scope: this,
                    signup: this.onSignup,
                    forgotPassword: this.onForgotPassword
                }
            },
            {
                xtype: "soashable.loginbox.network",
                network: "aim",
                title: this.lang.netAim,
                lang: this.lang,
                listeners: {
                    scope: this,
                    signup: this.onSignup,
                    forgotPassword: this.onForgotPassword
                }
            },
            {
                xtype: "soashable.loginbox.network",
                network: "msn",
                title: this.lang.netMsn,
                lang: this.lang,
                listeners: {
                    scope: this,
                    signup: this.onSignup,
                    forgotPassword: this.onForgotPassword
                }
            },
            {
                xtype: "soashable.loginbox.network",
                network: "yahoo",
                title: this.lang.netYahoo,
                lang: this.lang,
                listeners: {
                    scope: this,
                    signup: this.onSignup,
                    forgotPassword: this.onForgotPassword
                }
            }/*,
            {
                xtype: "soashable.loginbox.network",
                network: "jabber",
                lang: this.lang,
                listeners: {
                    scope: this,
                    signup: this.onSignup,
                    forgotPassword: this.onForgotPassword
                }
            }*/
        ],
        buttons: [{
            id: "secure-login-broken-button",
            text: "Secure Login Broken?",
            template: Soashable.Dialog.LoginDialog.Network.buttonTemplate, //FIXME make a shared text button template
            scope: this,
            handler: this.onSecureLoginBroken
        },
        {
            id: "secure-login-button",
            text: this.lang.secureLoginButton,
            icon: "images/status/log-in.png",
            cls: "x-btn-text-icon",
            scope: this,
            handler: this.onLogin
        },
        {
            id: "login-button",
            text: this.lang.loginButton,
            icon: "images/status/log-in.png",
            cls: "x-btn-text-icon",
            scope: this,
            handler: this.onLogin
        }]
    });

    Soashable.Dialog.LoginDialog.superclass.constructor.call( this, superConfig );

    this.addEvents({
        /**
         * @event submit
         * @param {Array} networks - an array of objects with network, username and password properites. A network will only appear if username is set.
         * @param {boolean} useSecure
         */
        submit : true,
        /**
         * @event signup
         * @param {Soashable.Dialog.LoginDialog.Network} networkBox
         */
        signup : true,
        /**
         * @event forgotPassword
         * @param {Soashable.Dialog.LoginDialog.Network} networkBox
         */
        forgotPassword : true
    });
}

Soashable.Dialog.LoginDialog.prototype = {
    onSignup: function(networkBox) {
        this.fireEvent( "signup", networkBox );
    },
    onForgotPassword: function(networkBox) {
        this.fireEvent( "forgotPassword", networkBox );
    },
    onLogin: function(button, e) {
        var networks = [];

        this.items.each( function(item) {
            if( item instanceof Soashable.Dialog.LoginDialog.Network && item.getUsername() ) {
                networks.push({
                    network: item.getNetwork(),
                    username: item.getUsername(),
                    password: item.getPassword()
                });
            }
        }, this );

        var useSecure = button.getId() == "secure-login-button";
        
        this.fireEvent( "submit", networks, useSecure );
    },
    onSecureLoginBroken: function(button) {
        Ext.MessageBox.show({
          title: "Fixing Secure Login",
          msg: "Safari Windows, IE, Opera users: Our certificate from the Jabber"
              +" Foundation is not currently trusted by your browsers. Click"
              +" OK for more info, otherwise use non-secure login.",
          buttons: Ext.Msg.OKCANCEL,
          icon: Ext.MessageBox.INFO,
          animEl: button.getEl(),
          fn: function(btn, text) {
              if( btn == 'ok' ) {
                document.location.href = "http://blog.soashable.com/2008/07/new-ssl-certificate.html"
              }
          }
        })
    }
}

Ext.extend( Soashable.Dialog.LoginDialog, Ext.Window, Soashable.Dialog.LoginDialog.prototype );


Soashable.Dialog.LoginDialog.Network = function(config) {

    this.title = config.title;
    this.lang = config.lang;
    this.network = config.network;
    // TODO these should be unique per dialog
    this.usernameId = this.network+"-username";
    this.passwordId = this.network+"-password";

    var superConfig = Ext.apply( config, {
        layout: 'form',
        title: null, // cancels out the title we passed in, because that makes it ugly using ext panel title.
        defaultType: 'textfield',
        defaults: {
            // applied to each contained item
            width: 130,
            msgTarget: 'side'
        },

        items: [
        {
            xtype: 'panel',
            fieldLabel: false,
            border: false,
            html: '<h1><img src="images/protocols/'+this.network+'.png" alt="'+this.title+' Logo"/> ' + this.title + '</h1>'
        },
        {
            fieldLabel: this.lang.username,
            name: 'username',
            allowBlank: true,

            id: this.usernameId
        },{
            fieldLabel: this.lang.password,
            name: 'password',
            allowBlank: true,
                        inputType: "password",

            id: this.passwordId
        }
        
        ],

        buttons: [{
            id: this.network+"-forgotpass-button",
            text: this.lang.forgotPasswordButton,
            scope: this,
            handler: this.onForgotPassword,
            template: Soashable.Dialog.LoginDialog.Network.buttonTemplate
        },
        {
            id: this.network+"-signup-button",
            text: this.lang.signupButton,
            scope: this,
            handler: this.onSignUp,
            template: Soashable.Dialog.LoginDialog.Network.buttonTemplate
        }]
    });

    Soashable.Dialog.LoginDialog.Network.superclass.constructor.call( this, superConfig );

    this.addEvents({
        /**
         * @event signup
         * @param {Soashable.Dialog.LoginDialog.Network} networkBox
         */
        signup : true,
        /**
         * @event forgotPassword
         * @param {Soashable.Dialog.LoginDialog.Network} networkBox
         */
        forgotPassword : true
    });
}

Soashable.Dialog.LoginDialog.Network.buttonTemplate = new Ext.Template('<div class="x-btn-wrap"><em unselectable="on"><button class="x-btn-text x-btn-textonly" type="{1}">{0}</button></em></div>');

Soashable.Dialog.LoginDialog.Network.prototype = {
    getUsername: function() {
        var c = Ext.ComponentMgr.get( this.usernameId );
        return c.getValue();
    },

    getPassword: function() {
        var c = Ext.ComponentMgr.get( this.passwordId );
        return c.getValue();
    },

    getNetwork: function() {
        return this.network
    },

    onForgotPassword: function() {
        this.fireEvent( "forgotPassword", this );
    },

    onSignUp: function() {
        this.fireEvent( "signup", this );
    }

}

Ext.extend( Soashable.Dialog.LoginDialog.Network, Ext.Panel, Soashable.Dialog.LoginDialog.Network.prototype );

Ext.ComponentMgr.registerType( "soashable.loginbox.network", Soashable.Dialog.LoginDialog.Network );
