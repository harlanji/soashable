Ext.onReady(function() {
    // for html editor
    Ext.QuickTips.init()
});



function Soashable(lang) {
    this.presenceMode = "auto";
    this.lang = lang;

    this.addEvents({
        auth: true
    });


    this.dialogManager = new DialogManager(this);

    this.titleManager = new Soashable.TitleManager();
    
    this.taskRunner = new Ext.util.TaskRunner();
    this.titleNotifyTask = new Soashable.TitleNotifyTask( this );
}

Soashable.logger = Xmpp4Js.createLogger( "soashable" );

Ext.extend( Soashable, Ext.util.Observable, {
    CHAT_OPTIONS : {
        ignoreResource: true,
        ignoreThread: true
    },

    setupConnection : function(useSecure) {
        
      this._setupStanzaProvider();
      this.con = new Xmpp4Js.Connection({
          transport: {
              clazz: BOSH_TRANSPORT,
              endpoint: useSecure ? BOSH_ENDPOINT_SECURE : BOSH_ENDPOINT,
              useKeys: true
          },
          stanzaProvider: this.stanzaProvider,
          listeners: {
              scope : this,
              error : this.onError,
              close : this.onClose
          }
      });

      this._setupExtensionProvider(this.con);
      this.initDisco();
      this.initChatManager();

      this.con.addPacketListener( this._onPresence.bind(this), new Xmpp4Js.PacketFilter.PacketClassFilter( Xmpp4Js.Packet.Presence ) );
      this.con.addPacketListener( function(msg){
          var network = msg.getFrom();
          var msg = "There was an error logging into "+network+": "+msg.getBody();
          
          Ext.MessageBox.show({
            title: "Login Error",
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
          });
          
;;;       Soashable.logger.error(msg );
        }.bind(this), 
        new Xmpp4Js.PacketFilter.AndFilter(
          new Xmpp4Js.PacketFilter.PacketClassFilter( Xmpp4Js.Packet.Message ),
          new Xmpp4Js.PacketFilter.PacketTypeFilter( "error" )
        )
      );

      this.roster = Xmpp4Js.Roster.Roster.getInstanceFor( this.con );
        
    },
    
    start : function() {
        // setup and show login dialog
        var loginDlg = this.dialogManager.createLoginDialog();
        loginDlg.on({
            scope : this,
            signup : this.onSignupClicked,
            forgotPassword : this.onForgotPassClicked,
            submit : this.onLoginClicked
        
        });
        loginDlg.show();
        

        
        
        // setup and show pissing{me}off dialog
        //var pmoDlg = new Soashable.Dialog.PissingMeOffDialog.Default( function(pmoDlg) { pmoDlg.show() } );
        
        
        // focus the login dialog.
        loginDlg.toFront(); 
    },
    
    register : function() {
        // close the connection if it's already open.'
        if( this.con.isConnected() ) {
            this.con.close();
        }
        
        // show form before the response comes to look fast. odds are it will be
        // back before submission.
        var regDlg = new Soashable.Dialog.RegistrationDialog.Default({
            id: "reg-dlg", 
            con: this.con,
            lang: this.lang,
            listeners: {
                scope: this,
                regsuccess: function(iq) {
                    Ext.MessageBox.show({
                      msg: "You have registered successfully.",
                      buttons: Ext.MessageBox.OK
                    });
                    regDlg.hide();
                },
                regerror: function(iq) {
                    Ext.MessageBox.show({
                        msg: "There was an error registering. TODO more specific information.",
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.MessageBox.OK
                    });
                },
                /**
                 * this is triggered by either the doalog closing or a
                 * successful registration.
                 */
                hide: function(){
                    this.con.close();
                }
            }
        });   
        regDlg.show();
        
        this.setupConnection();
        
        this.con.connect( SOASHABLE_DOMAIN );
    },
    
    getConnection : function() {
        return this.con;
    },
    
    getLang: function() {
        return this.lang;
    },
    
    /**
     * Adds necessary packet types to the stanza provider.
     */
    _setupStanzaProvider : function(con) {
        // Stanza provider for soashable client
        //var stanzaProvider = con.getStream().getReader().getStanzaProvider();
        
    this.stanzaProvider = new Xmpp4Js.Packet.StanzaProvider();
    this.stanzaProvider.registerDefaultProviders();
        
        // roster packets
        this.stanzaProvider.register(
            RosterPacketProvider,
            Xmpp4Js.Packet.RosterPacket,
            10
        );
    },
    
    _setupExtensionProvider : function(con) {
        this.extProvider = new Xmpp4Js.Ext.PacketExtensionProvider()
        
        this.extProvider.register( Xmpp4Js.Ext.MessageEvent.XMLNS, Xmpp4Js.Ext.MessageEvent );
        this.extProvider.register( Xmpp4Js.Ext.ChatStates.XMLNS, Xmpp4Js.Ext.ChatStates );
        this.extProvider.register( Soashable.Ext.TokBox.XMLNS, Soashable.Ext.TokBox );
        
        //this.extProvider.register( XHTMLExtension.XMLNS, XHTMLExtension );
    },

    onSignupClicked : function( networkBox ) {
        if( networkBox.getNetwork() == "soashable" ) {
            this.register();
        } else {
            Ext.MessageBox.alert( "Sign Up", "Sign up for "+networkBox.getNetwork() );
        }
    },
    onForgotPassClicked : function( networkBox ) {
        Ext.MessageBox.alert( "Forgot Password", "Forgot password for "+networkBox.getNetwork() );
    },
    onLoginClicked : function( networks, useSecure ) {
        
        this.setupConnection( useSecure );
        
        this.con.on("connect", function() { 
            this.onConnectForLogin(networks);  
        }, this, {single: true} );
           
           // set a wait message that will be cleared when the connection closes.
        this.waitMessage = Ext.MessageBox.show({
            closable: false,
            modal: true,
            msg: this.lang.signingOnMessage
        });

        
        this.con.connect( SOASHABLE_DOMAIN );
    },
    
    /**
     * Start a login flow upon connection.
     * @private
     */
    onConnectForLogin: function(networks) {
        
        var username = null, password = null;
        
        for( var i = 0; i < networks.length; i++ ) {
            var network = networks[i];
            if( network.network == "soashable" ) {
                username = network.username;
                password = network.password;
            } else {
                // it's a transport, so login upon auth.
                this.on( "auth", function() {
                  var serviceJid = network.network + "." + this.con.domain /* getDomain() */;

                  this.transportLogin( serviceJid, network.username, network.password );
                }, this, {single:true} );
            }
        }
        
        // start the login flow
        var loginFlow = new Xmpp4Js.Workflow.Login({
            con: this.con,
            listeners: {
                scope: this,
                success: this.onLoginCompleted,
                failure: this.onAuthError
            }
        });
           
        var type = username ? "plaintext" : "anon";
        loginFlow.start( type, username, password );
    },
    
    transportLogin: function( serviceJid, username, password ) {
;;;        Soashable.logger.info( "transportLogin: " + serviceJid + " " + username );

        var regFlow = new Xmpp4Js.Workflow.Registration({
        	con: this.con,
        	toJid: serviceJid /* TODO make getJid() */,
        	listeners: {
        		scope: this,
        		success: function() {
;;;                            Soashable.logger.info( "logged into " + serviceJid + " as " + username );
                        },
        		failure: function() {
                            Ext.MessageBox.alert( "Login Failed", "Failed to log into " + serviceJid + " as " + username );
                            // TODO show reg dialog to retry
                        }
        	}
       	});
       	
       	regFlow.start({
            username: username,
            password: password
        });
        
    },
    
    /**
     * Called when the login has completed successfully
     */
    onLoginCompleted : function() {
        
        this.waitMessage.hide();
        
        this.fireEvent( "auth", this );
        
        this.con.send(this.con.getPacketHelper().createPresence());

        var loginDlg = this.dialogManager.getLoginDialog();
        loginDlg.hide();
        
        var rosterDlg = this.dialogManager.createRosterDialog(this.roster);
        this._setupRosterDialog( rosterDlg );
        rosterDlg.show();
        


    },
    
    onAuthError: function() {
        this.waitMessage.hide();
        
        Ext.MessageBox.alert( "Error Logging In",  "There was an error authenticating." );
        this.con.close();
    },
    
    _setupRosterDialog : function(rosterDlg) {
        rosterDlg.on({
            scope : this,
            itemDblClick : this.onRosterItemDblClick
        });
    },

    onChatStarted : function(chat) {
        var chatDlg = this.dialogManager.createChatDialog( chat );
        
        // show window and "flash" title
        chat.on({
          scope: this,
          messageSent: function(chat, message) {
            this.stopTitleNotify();
          },
          messageReceived: function(chat, message) {
            if( message.hasContent() ) {
                chatDlg.show();
                this.startTitleNotify();
            }
          }
        });

        chatDlg.on({
          scope: this,
          activate: function() {
            // FIXME this is commented out because it stops the initial
            //       message when the window is not focused from doing 
            //       the notification.
            //this.stopTitleNotify();
          },
          deactivate: function() {
            this.stopTitleNotify();
          }
        });

        
        // render the first message but keep it hidden until the first
        // actual message comes in.
        chatDlg.render(Ext.getBody());
    },
    
    onChatMessageReceived : function(chat, messagePacket) {
    },
    
    startTitleNotify: function() {
        this.titleNotifyTask.incrementMessageCount();
        if( !this.titleNotifyTask.isRunning() ) {
          this.taskRunner.start( this.titleNotifyTask );
        }
    },
    
    stopTitleNotify: function() {
        this.taskRunner.stop( this.titleNotifyTask );
        this.titleNotifyTask.reset();
    },
 
    onRosterItemDblClick : function(jid) {
        var chatManager = this.chatManager;

        var chat = null;
        try {
            chat = chatManager.findBestChat( jid, null );
        } catch(e) {
            chat = chatManager.createChat( jid, null );
        }
 
        // chatStarted happens when createChat is called, and the 
        // dialog is created there.
        var chatDlg = this.dialogManager.getChatDialog( chat );

        chatDlg.show();
    },
    
    onError : function( isTerminal, packetNode, title, message ) {
        // HACK write code to properly clean up.
        //document.location.reload();
        //alert( "onError ("+(isTerminal?"terminal":"normal")+"): "+message );
;;;     Soashable.logger.error( "onError ("+(isTerminal?"terminal":"normal")+"): "+title );
    },
    
    onClose : function( con ) {
        // HACK write code to properly clean up.
        //document.location.reload();
        //alert( "onClose" );
;;;     Soashable.logger.debug( "onClose" );
    },
    
    showConnectionError : function() {
        
        
    },
    /**
     * @private
     */
    initDisco: function() {
        this.disco = ServiceDiscoManager.getInstanceFor( this.con );

        // =====================================================================
        // Say that we support file transfer request
        //
        this.disco.addFeature( "http://jabber.org/protocol/si" );
        this.disco.addFeature( "http://jabber.org/protocol/si/profile/file-transfer" );
        // =====================================================================
    },
    
    /**
     * @private
     */
    initChatManager: function() {

        this.chatManager = Xmpp4Js.Chat.ChatManager.getInstanceFor( this.con );

        this.chatManager.setOptions(this.CHAT_OPTIONS);

        this.chatManager.on({
            scope : this,
            chatStarted : this.onChatStarted,
            messageReceived : this.onChatMessageReceived
        });
    },
    
    _onPresence : function(packet) {
        var jid = packet.getFrom();
        var type = packet.getType();
        var status = packet.getStatus();
        var show = packet.getShow();
        
        var jidObj = new Xmpp4Js.Jid( jid );
        // ignore subscription requests from aim transport.
        if( type == "subscribe" && jidObj.getDomain() == "aim." + this.con.getDomain()  && jidObj.getNode() != "" ) {
            return;
        }
                
        if( this.presenceMode == "auto" ) {
            this._onPresenceAuto( jid, type, status, show );
        } else {
            this._onPresenceManual( jid, type, status, show );
        }
        
    },
    
    _onPresenceManual : function(jid, type, status, show ) {
        // handles presence subscription
        if( type == 'subscribe' ) {
            Ext.MessageBox.show({
                title: "Subscription Request",
                msg: jid + " has requested to receive your presence information. allow?",
                buttons: {
                    yes: "Yes",
                    no: "No",
                    cancel: "Ask Later"
                },
                scope: this,
                fn: function(btn, text){
                    if( btn == "cancel" ) { return; } // do nothing
                    
                    var allow = (btn == "yes");
                    var returnType = allow ? 'subscribed' : 'unsubscribed';
                    
                    //  to, type, show, status, priortiy
                    this.con.send( new Xmpp4Js.Packet.Presence( returnType, jid ) );
                    
                    if( btn == "yes" ) {
                        Ext.MessageBox.confirm( "Return the favor?", 
                            "Do you want to add "+jid+" to your contact list as well?", 
                            function(btn) {
                                if( btn != "yes" ) { return; }
                                this.con.send( new Xmpp4Js.Packet.Presence( "subscribe", jid ) );
                            }, 
                            this 
                        );
                    }
                    
                }
            });
        } else if( type == 'unsubscribe' ) {
            // TODO add 'remove from my list', 're-subscribe' options
            Ext.MessageBox.alert( "Unsubscribed", jid + " has elected to unsubscribe from your presence information." );
            // do we need to send "unsubscribed"?
        } else if( type == 'subscribed' ) {
            Ext.MessageBox.alert( "Subscription Accepted", jid + " has allowed your subscription request." );
        } else if( type == 'unsubscribed' ) {
            // TODO add 'remove from my list', 're-subscribe' options
            Ext.MessageBox.alert( "Subscription Denied", jid + " has denied your subscription request." );
        }
    },
    
    /**
     * Accepts and subscribes to any requests. Only alerts upon unsubscription denied.
     */
    _onPresenceAuto : function(jid, type, status, show ) {
        // handles presence subscription
        if( type == 'subscribe' ) {
;;;            Soashable.logger.info( "Accepting and returning subscription for " + jid );
            
            this.con.send( new Xmpp4Js.Packet.Presence( "subscribed", jid ) );
            this.con.send( new Xmpp4Js.Packet.Presence( "subscribe", jid ) );
        } else if( type == 'unsubscribed' ) {
            // TODO add 'remove from my list', 're-subscribe' options
            Ext.MessageBox.alert( "Subscription Denied", jid + " has denied your subscription request." );
        }
    },
    
    getExtensionProvider : function() {
        return this.extProvider;
    }
});


/**
 * @class "flashes" the title bar with new messages. To be used with Ext's TaskRunner.
 */
Soashable.TitleNotifyTask = function(soashable) {
    this.scope = this;
    this.soashable = soashable;
}

Soashable.TitleNotifyTask.prototype = {
        isDefault : true,
        messageCount : 0,
        _isRunning : false,
        interval: 1200,
        
        run: function() {
            this._isRunning = true;

            if( this.isDefault ) {
              this.soashable.titleManager.set( this.messageCount+" New Message(s)" );
            } else {
              this.soashable.titleManager.setDefault();
            }

            // toggle
            this.isDefault = !this.isDefault;
        },

        reset: function() {
            this.soashable.titleManager.setDefault();

            this.isDefault = true;
            this._isRunning = false;
            this.messageCount = 0;
        },
        isRunning: function() {
            return this._isRunning;
        },
        incrementMessageCount: function() {
            this.messageCount++;
        }

  }

/**
 * @class Manages the title and soon the FavIco of the window. Might be
 *        renamed to WindowUtil or similar. Default title is derived from the
 *        textContent of the title element.
 */
Soashable.TitleManager = function() {
    if( Ext.isIE ) {
      this.baseTitle = document.getElementsByTagName("title")[0].innerText;
    } else {
      this.baseTitle = document.getElementsByTagName("title")[0].textContent;
    }
};

Soashable.TitleManager.prototype = {
  setDefault: function() {
      document.title = this.baseTitle;
  },
  set: function(title) {
      document.title = title + " - " + this.baseTitle;
  },
  get: function() {
      return document.title;
  }
}