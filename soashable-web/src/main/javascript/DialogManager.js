/**
 * GUI Manager base for providing a common way for events.
 * 
 * The gui manager will notify the layout  
 */
function DialogManager(soashable) {
    this.soashable = soashable;

    this._LOGIN_DIALOG = "loginDialog";
    this._ROSTER_DIALOG = "rosterDialog";
}

Ext.extend( DialogManager, Ext.util.Observable, {
    getLoginDialog : function() {
        return Ext.WindowMgr.get( this._LOGIN_DIALOG );
    },
    
    createLoginDialog : function() {
        // @todo should be redone to classify scope of gui manager?
        var win = this.getLoginDialog();
    
        if( win != undefined ) {
            throw new Error( "Login Dialog already exists." ); 
        }
        
        return new Soashable.Dialog.LoginDialog({
            id: this._LOGIN_DIALOG, 
            lang: this.soashable.getLang()
        });
    },
    
    getRosterDialog : function() {
        return Ext.WindowMgr.get( this._ROSTER_DIALOG );
    },
    
    createRosterDialog : function(roster) {
        var win = this.getRosterDialog();
    
        if( win != undefined ) {
            throw new Error( "Roster Dialog already exists." ); 
        }
    
        win = new Soashable.Dialog.RosterDialog.Default(this._ROSTER_DIALOG, this, roster, this.soashable.getLang());
        
        var left =  Ext.getBody().getSize().width - win.getSize().width - 10;
        win.setPosition( left );
        
        return win;
    },

    createChatDialog : function(chat) {
        var dlg = this.getChatDialog(chat);
    
        if( dlg != undefined ) {
            throw new Error( "Chat Dialog already exists." ); 
        }

        var id = this.generateChatDialogId(chat);
        dlg = new Soashable.Dialog.ChatDialog(chat, id, this, this.soashable.getLang());

        return dlg;
    },
    
    createAddContactDialog: function(config) {
        var roster = Xmpp4Js.Roster.Roster.getInstanceFor( this.soashable.getConnection() );
        var lang = this.soashable.getLang();
        
        var groups = roster.getGroups();
        var groupNames = [];
        for( var i = 0; i < groups.length; i++ ) {
            var group = groups[i];
            if( !(group instanceof Xmpp4Js.Roster.VirtualRosterGroup) ) {
                groupNames.push( groups[i].name );
            }
        }
        
        // define before the closure for addbuddy is created.
        var addContactDlg = null;
        
        config = Ext.apply( config, {
            title: lang.addContactTitle, 
            lang: lang, 
            groups: groupNames,
            listeners: {
                scope: this,
                addbuddy: function(jid, groupName, alias) {
                    var p = new Xmpp4Js.Packet.RosterPacket();
                    p.addItem( jid, alias, [groupName] );
                    
                    roster.getConnection().send( p, function() {
                        addContactDlg.hide();
                    } );
                }
            }
            //initialUsername: "jerk@somewhere-else.com"
        });
        
        addContactDlg = new Soashable.Dialog.AddBuddyDialog(config);
        
        return addContactDlg;
    },
    
    getChatDialog : function(chat) {
        var id = this.generateChatDialogId(chat);
        
        return Ext.WindowMgr.get( id );
    },
    /**
     * @private
     */
    generateChatDialogId : function(chat) {
        return "chat."+chat.getParticipant().withoutResource().toString();
    },
    getSoashable : function() {
        return this.soashable;
    }
});


function ChatDialogManager() {

}

ChatDialogManager.prototype = {
    openChat : function(toJid) {
    
    },
    
    appendMessage : function(toJid, message) {
    
    },
    
    appendNotice : function(chat) {
        
    }
}