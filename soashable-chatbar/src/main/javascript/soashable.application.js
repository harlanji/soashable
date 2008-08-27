function Application() {
    this.con = "";

    
    //this.tabStrip.removeTab( "onlinefriends" );
    
    
}

Application.logger = Xmpp4Js.createLogger( "chatbar.application" );

Application.prototype = {
    getConnection: function() {
        return this.con;
    },
    
    startChat: function( remoteParticipant ) {
        var chatController = new ChatController( this, remoteParticipant );
        
        return chatController;
    },
    
    
    onPageLoad: function() {
;;;     Application.logger.info( "onPageLoad" );

        this.tabStrip = new TabStrip($('#chatbar .tabs'));

        this.tabStrip.addTab( "status", "Status").status();
        this.tabStrip.addTab( "notices", "Notices").notices();
        this.tabStrip.addTab( "onlinefriends", "Online Friends").onlinefriends();
        
        var stanzaProvider = new Xmpp4Js.Packet.StanzaProvider();
        stanzaProvider.registerDefaultProviders();


        this.con = new Xmpp4Js.Connection({
            // FIXME none of this transport stuff should be needed if we plan to resume.
            transport: {
                useKeys: true,
                clazz: Xmpp4Js.Transport.Script,
                endpoint: "http://bosh*.soashable.com:7070/http-bind/" 
            },
            stanzaProvider: stanzaProvider /*,
          listeners: {
              scope : this,
              error : this.onError,
              close : this.onClose
          }*/
        });
        
        this.con.on("connect", function() {
;;;         Application.logger.info( "Connected" );
            // start the login flow
            var loginFlow = new Xmpp4Js.Workflow.Login({
                con: this.con
            });

            loginFlow.on("success", function() {  
;;;             Application.logger.info( "Login Successful" );
                this.con.send( new Xmpp4Js.Packet.Presence() );  
                this.con.send( new Xmpp4Js.Packet.Message("harlan@soashable.com", "normal", "Sup?") );
            }, this);  

            loginFlow.start( "plaintext", "harlan2", "test" ); // anon login
        }, this, {single: true});
        
        var connectAttempts = 0;
        
        this.con.on("error", function(isTerminal, packetNode, title, message) {
            if(isTerminal) {
                
                var condition = packetNode.getAttribute("condition").toString();
                //alert( "terminated: "+condition );
                
                // in general we want to reconnect.
;;;             Application.logger.error( "Disconnected with terminal error." );
                
                if(connectAttempts <= 5) {
;;;                 Application.logger.info( "Reconnecting");
                    this.con.connect("soashable.com");
                    connectAttempts++;
                } else {
;;;                 Application.logger.error( "Too many failed connection attempts. stopped trying.");
                }
            } else {
                alert( "error" );
            }
        }, this);
        
        this.con.on("resume", function() {
;;;         Application.logger.info( "Connection Resumed" );
            this.con.send( new Xmpp4Js.Packet.Message("harlan@soashable.com", "normal", "Back") );
        }, this);
        
        this.con.on("beforepause", function() {
            this.con.send( new Xmpp4Js.Packet.Message("harlan@soashable.com", "normal", "BRB...") );
        }, this);
        
        this.con.on("pause", function() {
            
;;;         Application.logger.info( "Connection Paused" );
        }, this);
 
        // resume if we can, connect otherwise.
        var pauseStruct = getCookie( "pauseStruct" );
        if( pauseStruct ) { 
            pauseStruct = JSON.parse( pauseStruct ); 

            this.con.resume( pauseStruct );
        } else {
            if(connectAttempts <= 5) {
                this.con.connect("soashable.com");
                connectAttempts++;
            } else {
;;;                 Application.logger.error( "Too many failed connection attempts. stopped trying.");
            }
        }
    },

    onPageUnload: function() {
;;;     Application.logger.info( "onPageUnload" );
        if( this.con != null && this.con.isConnected() ) {
            // pause for up to 120 seconds
            var pauseStruct = this.con.pause( 120 );
            setCookie( "pauseStruct", JSON.stringify( pauseStruct ) );
        }
    }
}