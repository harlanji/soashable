
function SoashableClient() {
}

SoashableClient.Default = function() {
    this.addEvents({
        /**
         * @event loginCompleted
         * Fires when login has successfully completed
         * @param {Xmpp4Js.JabberConnection} jabberConnection The jabber connection
         */
        "loginCompleted" : true,
        
        /**
         * @event messageReceived
         * Fires when a message is received.
         * @param {Xmpp4Js.Packet.Message} messagePacket The message packet
         */
        "messageReceived" : true,
        
        /**
         * @event rosterUpdated
         * Fires the roster has been updated.
         */
        "rosterUpdated" : true,
    });

    // crete a new jabber connection that will connect to soashable.com, using
    // http binding at the url /http-bind/ of current domain.
	this._jabberConnection = new Xmpp4Js.JabberConnection( "soashable.com", "/http-bind/" );

	this._setupStanzaProvider();

	// Register handlers
	this._registerHandlers();
}

SoashableClient.logger = Xmpp4js.createLogger( "soashableclient" );

Ext.extend(SoashableClient.Default, Ext.util.Observable, {

    onLoad : function() {

        // HACK using a global... but we need it somehow        
        
        // setup and show login dialog
        var loginDlg = guiManager._loadLoginDialog();
        loginDlg.getLoginBox().on({
            scope : this,
            signup : this._onSignup,
            forgotPassword : this._onForgotPass,
            submit : this._onLogin
        
        });
        loginDlg.show();
        
        // setup and show pissing{me}off dialog
        var pmoDlg = new Soashable.Dialog.PissingMeOffDialog.Default( function(pmoDlg) { pmoDlg.show() } );
        
        
        // focus the login dialog.
        loginDlg.toFront(); 
    },
    
    
    onUnload : function() {
    	this.close();
    },
    
    onLoginCompleted : function (con) {
    	// Send presence
    	this._jabberConnection.send(this._jabberConnection.getPacketHelper().createPresence());
    	
    	// Login was completed from onauth from jabber connection
    	// Propagate to listeners of loginCompleted event
    	this.fireEvent("loginCompleted", con);
    },
    
    /**
     * Adds necessary packet types to the stanza provider.
     */
    _setupStanzaProvider : function() {
        // Stanza provider for soashable client
        var stanzaProvider = this._jabberConnection.getStream().getReader().getStanzaProvider();
        
        // roster packets
        stanzaProvider.register(
            RosterPacketProvider,
            Xmpp4Js.Packet.RosterPacket,
            10
        );
    },
    
    /**
     * Register handlers for the client with the Xmpp4Js.JabberConnection.
     */
    _registerHandlers : function() {
    
        this.on( "loginCompleted", this._onLoginComplete, this );
    
    	// Hack to create chat manager before packets are received
    	this._jabberConnection.getChatManager();
    
    	this._jabberConnection.addListener("onauth", this.onLoginCompleted.bind(this));
    	
    	// Handle roster here to raise rosterUpdated event
    	this._jabberConnection.getRoster().addRosterListener(this._handleRoster.bind(this));
    	
    	this._jabberConnection.addPacketListener( this._corePacketListener.bind(this) );
    },
    
    /**
     * Handles core packets; Presence, Message, Disco, Roster
     */
    _corePacketListener : function(stanza) {
        //console.dirxml( stanza.getNode() );
        if (stanza instanceof Xmpp4Js.Packet.IQ) {
;;;            SoashableClient.logger.log("IQ stanza received: " + stanza.toString());
            this._handleDiscoRequest( stanza );
        }
        else if (stanza instanceof Xmpp4Js.Packet.Presence) {
;;;            SoashableClient.logger.log("Presence stanza received: " + stanza.toString());
            this._handlePresence( stanza );
        }
        else if (stanza instanceof Xmpp4Js.Packet.RosterPacket) {
;;;            SoashableClient.logger.log("Roster stanza received: " + stanza.toString());
            this._handleRoster( stanza );
        }
        else if (stanza instanceof Xmpp4Js.Packet.Message) {
;;;            SoashableClient.logger.log("Message stanza received: " + stanza.toString());
            this._handleMessage( stanza );
        }
        else {
;;;            SoashableClient.logger.log("Undefined stanza received: " + stanza.toString());
        }
    },
    
    /**
     * Begin a session and login to the default soashable server.
     */
    login : function (login, password) {
    	// @todo Need to redo to place login logic in 
    	this._jabberConnection.beginSession();
    	this._jabberConnection.authenticatePlaintext( login, password, "Soashable" );
    },
    
    register : function() {
        this._jabberConnection.beginSession();
        var regProc = new RegistrationProcess( this._jabberConnection, SOASHABLE_URL + "views/default/registration-1.xml" );
        regProc.on({
            scope : this,
            success: function() {
                this.close();
            },
            cancel: function() {
                this.close();
            }
        });
        
        regProc.start();
        
        
    /*
        var ph = this._jabberConnection.getPacketHelper();
    
    	var iq = ph.createIQ(null, "get", "jabber:iq:register");
    
    	this._jabberConnection.send(iq, function(packet) {
    		var df = new DataForm();
    		df.read( packet.getQuery().getElementsByTagName("x")[0] );
    		
    		var dfv = new DataFormView( df, "register" );
    		dfv.on( "submit", function(dfv) {
                var registerIQ = ph.createIQ(null, "set", "jabber:iq:register");
                
                dfv.getDataForm().write( registerIQ.getQuery() );
                
                this._jabberConnection.send( registerIQ, function(packet) {
                    console.info( "Registration response received!" );
                }.bind(this));
    		}, this );
    		
    		dfv.render( document.body );
    	}.bind(this));
    
       */
       
            
    
    },

    _onSignup : function( loginBox, net ) {
        if( net == "soashable" ) {
            this.register();
        } else {
            Ext.MessageBox.alert( "Sign Up", "Sign up for "+net );
        }
    },
    _onForgotPass : function( loginBox, net ) {
        Ext.MessageBox.alert( "Forgot Password", "Forgot password for "+net );
    },
    _onLogin : function( loginBox ) {
        var login = loginBox.getLogin( "soashable" );
        var password = loginBox.getPassword( "soashable" );
        
        this.login( login, password);
    },
    
    /**
     * Called when the login has completed successfully
     */
    _onLoginComplete : function( soashableClient ) {
        // HACK using a global... but we need it somehow
        var loginDlg = guiManager.getLoginDialog();
        loginDlg.hide();
        
        var rosterDlg = guiManager.getLoginDialog();
    },
    
    send_im : function () {
    	this._jabberConnection.send( this._jabberConnection.getPacketHelper().createMessage(this._jabberConnection.jid, "normal", "testing...") );
    },
    
    close : function() {
    	this._jabberConnection.endSession();
    },
    
    
    getConnection : function() {
    	return this._jabberConnection;
    },
    
    
    _handleDiscoRequest : function(iq) {
    
    	var response;
    	if( iq.getQueryXMLNS() == "http://jabber.org/protocol/disco#items" ) {
    		response = this._jabberConnection.getPacketHelper().createIQ( iq.getFrom(), "result", "http://jabber.org/protocol/disco#items" );
    	} else if( iq.getQueryXMLNS() == "http://jabber.org/protocol/disco#info" ) {
    		response = this._jabberConnection.getPacketHelper().createIQ( iq.getFrom(), "result", "http://jabber.org/protocol/disco#info" );
    	}
    
    	if( response ) {
    		response.setId( iq.getId() );
    		this._jabberConnection.send( response );
    	}
    },
    
    _handlePresence : function(packet) {
    	var jid = packet.getFrom();
    	var type = packet.getType();
    	var status = packet.getStatus();
    	var show = packet.getShow();
    	
    	// @todo Redo type to an object so we can do isSubscribe, is...etc
    	
    	/*
    	// Subscribe request
    	if (type == "subscribe") {
    		// @todo Need to get answer from event and then send a reply
    		this.fireEvent("subscribe");
    	}
    	// Unsubscribe event from other 
    	else if (type == "unsubscribe") {
    		this.fireEvent("unsubscribe");
    	}
    	// Approval of subscription request
    	else if (type == "subscribed") {
    		this.fireEvent("subscribed");
    	}
    	else if (type == "unsubscribed") {
    		this.fireEvent("unsubscribed");
    	}
    	*/
    	
    	/*// handles presence subscription
    	if( type == 'subscribe' ) {
    		var allow = confirm( jid + " has requested to receive your presence information. allow?" );
    		var returnType = allow ? 'subscribed' : 'unsubscribed';
    		
    		//  to, type, show, status, priortiy
    		this.sendPresence( jid, returnType );
    	} else if( type == 'unsubscribe' ) {
    		alert( from + " has elected to unsubscribe from your presence information." );
    		// do we need to send "unsubscribed"?
    	} else if( type == 'subscribed' ) {
    		alert( from + " has allowed your subscription request." );
    	} else if( type == 'unsubscribed' ) {
    		alert( from + " has denied your subscription request or unsubscribed from your presence information." );
    	} else {
    		// TODO This will normally be handled by Roster events
    		this.layoutManager.updateBuddyList( this );
    	}*/
    },
    
    /**
     * @param {Xmpp4Js.Packet.Message} messagePacket The message packet
     */
    _handleMessage : function(messagePacket) {
    	var messageBody = messagePacket.getBody();
    	// @todo Should only fire one event for a message received, is being fired from Chat too
    	// Only fire message received event if we had a body
    	if (messageBody !== undefined && messageBody != "") {
    		var chat = this._jabberConnection.getChatManager().getOrCreateChat(messagePacket.getFromJid().withoutResource(), messagePacket.getThread());
    		this.fireEvent("messageReceived", messagePacket, chat);
    	}
    },
    
    _handleRoster : function(packet) {
    	this.fireEvent("rosterUpdated");
    }

});