// Copyright (C) 2007  Harlan Iverson <h.iverson at gmail.com>
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Ext.namespace( "Soashable.Dialog" );

/**
 * Create a Chat dialog that is tabbed. 
 *
 * @param chat {Xmpp4Js.Chat.Chat} Optional. The initial chat object to bind with.
 * @param id {String} The ID of the chat window.
 * @param dialogManager {DialogManager} blah.
 * @constructor
 */
Soashable.Dialog.ChatDialog = function(chat, id, dialogManager, lang) {
    this.dialogManager = dialogManager;
    this.lang = lang;
    
    this.tabPanelId = Ext.id();
    
    var config = {
        closeAction: 'hide', 
        title: this.lang.chatTitle,
        id : id,
        width: 400,
        height: 425,
        layout: 'fit',
        items: {
            id: this.tabPanelId,
            xtype: 'tabpanel',
            activeTab:0,
            border:false,
            defaults:{closable: true},
            enableTabScroll: true,
            resizeTabs: true,
            layoutOnTabChange:true
        },
        buttons: [{
            text: "Pop out",
            handler: function() {
                this.popout();
            },
            scope: this
        },{
            text: "Pop in",
            handler: function() {
                this.popin();
            },
            scope: this
        }]
    };

    Soashable.Dialog.ChatDialog.superclass.constructor.call( this, config );
    
    if( chat ) {
        this.addTab( chat );
    }
    
    var tabPanel = Ext.ComponentMgr.get( this.tabPanelId );
    tabPanel.on({
        scope: this,
        remove: this.onTabRemoved
    });
}

Soashable.Dialog.ChatDialog.prototype = {
    /**
     * Add a conversation tab to the window.
     *
     * @param chat {Xmpp4Js.Chat.Chat} The chat object to bind with.
     */
    addTab : function(chat) {
        var tabPanel = Ext.ComponentMgr.get( this.tabPanelId );
        var added = tabPanel.add(new Soashable.Dialog.ChatDialog.Tab(chat, this.dialogManager, this, this.lang));
            
            //this.recv = added.items[0];
            //this.send = added.items[1];
            //this.sendButton = added.items[2].buttons[1];
    },
    
    onTabRemoved : function( tabPanel, tab ) {
        if( tabPanel.items.getCount() == 0 ) {
            this.close();
        }
    }
};
    
Ext.extend( Soashable.Dialog.ChatDialog, PopoutWindow, Soashable.Dialog.ChatDialog.prototype);


/**
 * @constructor
 */
Soashable.Dialog.ChatDialog.Tab = function(chat, dialogManager, parentWin, lang) {
    this.lang = lang;

    this.chatRendererId = Ext.id();
    this.editorId = Ext.id();
    this.avContainerId = Ext.id();
    
    this.chat = chat;
    this.dialogManager = dialogManager;
    this.parentWin = parentWin;

    var to = chat.getParticipant();

    chat.on({
        scope: this,
        "messageReceived": this.onMessageReceived,
        "messageSent": this.onMessageSent,
        "close" : this.onChatClosed
    });

    var superConfig = {
        title: to, 
        closable: true,
        layout: 'border',
        tbar: [{ 
            text: this.lang.addContactButton, 
            cls: 'x-btn-text-icon add-contact',
            handler: this.onAddContact,
            scope: this
        }],
        items: [{
            region: 'center',
            layout: 'border',
            
            items: [{
                region: 'north',
                collapsible: false,
                split: true,

                height: 200,
                autoScroll: true,

                items: [{
                    xtype: "xmpp4js.chatrenderer",
                    id: this.chatRendererId
                }]
            },
            {
                region: 'center',
                collapsible: false,
                id: this.editorId,
                xtype: 'textarea',
                listeners: {
                    scope: this,
                    render: function(comp, e) {
                        var nav = new Ext.KeyNav(this.editorId, {
                            scope: this,
                            "enter": this.onSendClicked
                        });

                    }
                }

                /*
                xtype:'htmleditor',

                hideLabel: true,
                stateEvents: {
                    keyup: function() { alert("omfg"); }
                },
                enableSourceEdit: false,
                enableLists: false,
                enableAlignments: false
                */



            },
            {
                region: 'south',

                buttons: [
                /*{
                    scope: this,
                    handler: function() {
                        var cr = Ext.ComponentMgr.get( this.chatRendererId );
                        for(var i = 0; i < 10; i++ ) {
                            cr.appendMessage( "somebody@somewhere.com", "Lorem ipsum.", "red" );
                        }
                        cr.scrollToBottom();
                    },
                    text: "Send Fake"
                },*/
                {
                    scope: this,
                    handler: this.onAVChatClicked,
                    text: this.lang.avChatButton
                },
                {
                    scope: this,
                    handler: this.onSendClicked,
                    text: this.lang.sendButton
                }]
            }]
        },
        {
            region: 'east',
            
            id: this.avContainerId,
            width: 0
        }]

    };
    
    Soashable.Dialog.ChatDialog.Tab.superclass.constructor.call( this, superConfig );
}

Soashable.Dialog.ChatDialog.Tab.prototype = {
    
        onSendClicked : function() {
            var editor = Ext.ComponentMgr.get( this.editorId );
            
            // TODO xhtml extension
            var msg = this.chat.createMessage( editor.getValue() );
            this.chat.sendMessage( msg );

            editor.setValue("");
        },
        
        onAVChatClicked: function() {
            Ext.Ajax.request({
                url: "/app/tokbox", 
                method: "GET",
                params:{
                    op: "getInfo", 
                    email: "testing1@soashable.com"
                },
                scope: this,
                callback: this.onTokBoxServletResponse_Host
            });
        },
        
        onTokBoxServletResponse_Host: function(options, success, response) {
            if( success ) {
                var retObj = Ext.util.JSON.decode(response.responseText);

                var avContainer = Ext.ComponentMgr.get( this.avContainerId );

                var comp = avContainer.add({                            
                    xtype: "soashable.tokbox",
                    widget: retObj.widget_id, // use our own widget ID
                    userId: retObj.user_id,
                    password: retObj.password
                });
                
                var msg = this.chat.createMessage("Join me in this audio/video chat.");
                
                var extProvider = this.dialogManager.getSoashable().getExtensionProvider();
                extProvider.create( Soashable.Ext.TokBox.XMLNS, msg, retObj.widget_id );
                
                this.chat.sendMessage( msg );
                
                // HACK this is freaking stupid, but I'm tired of spending
                //      time dealing with it right now
                avContainer.setSize( 540, 260 );
                
                this.doLayout();
                var parentSize = this.parentWin.getSize();
                this.parentWin.setWidth( parentSize.width + 540);
            } else {
                alert( "wtf? failed!" );
            }
        },
        
        onTokBoxServletResponse_Join: function(options, success, response) {
            if( success ) {
                var retObj = Ext.util.JSON.decode(response.responseText);

                var avContainer = Ext.ComponentMgr.get( this.avContainerId );

                var comp = avContainer.add({                            
                    xtype: "soashable.tokbox",
                    widget: options.options.remoteWidget, // use the widget ID that was setn
                    userId: retObj.user_id,
                    password: retObj.password
                });
                
                // HACK this is freaking stupid, but I'm tired of spending
                //      time dealing with it right now
                avContainer.setSize( 540, 260 );
                
                this.doLayout();
                var parentSize = this.parentWin.getSize();
                this.parentWin.setWidth( parentSize.width + 540);
            } else {
                alert( "wtf? failed!" );
            }
        },
        
        /**
         * Fires when a chat message was received (including first).
         * It is safe to assume that chatStarted will be invoked before this.
         * 
         * @param chat {Xmpp4Js.Chat.Chat} The chat the message is related to
         * @param message {Xmpp4Js.Packet.Message} The incoming message
         * @private
         */
        onMessageReceived : function( chat, message ) {
            var cr = Ext.ComponentMgr.get( this.chatRendererId );
            var editor = Ext.ComponentMgr.get( this.editorId );
            
            this.handleExtensions( message );

            if( message.hasContent() ) {
                cr.appendMessage( message.getFrom(), message.getBody(), "red" );
                cr.scrollToBottom();
            }
        },
        
        handleExtensions : function( message ) {
            var cr = Ext.ComponentMgr.get( this.chatRendererId );
            
            var extProvider = this.dialogManager.getSoashable().getExtensionProvider();
            message.loadExtensions( extProvider );
            
            var msgEvent = message.getExtension( Xmpp4Js.Ext.MessageEvent.XMLNS );
            if( msgEvent != null ) {
                //cr.appendMessage( "dude is typing" );
                var event = msgEvent.getEvent();
//;;;                cr.appendNotice( "Event: " +  (event != Xmpp4Js.Ext.MessageEvent.EVENT_EMPTY ? event: "empty") );
            } 
            
            var chatState = message.getExtension( Xmpp4Js.Ext.ChatStates.XMLNS );
            if( chatState != null ) {
                var state = chatState.getState();
//;;;                cr.appendNotice( "Chat State: " + state );
            }
            
            var tokBoxReq = message.getExtension( Soashable.Ext.TokBox.XMLNS );
            if( tokBoxReq != null ) {
                var widget = tokBoxReq.getWidget();
                
                Ext.Ajax.request({
                    url: "/app/tokbox", 
                    method: "GET",
                    params:{
                        op: "getInfo", 
                        email: "testing2@soashable.com"
                    },
                    scope: this,
                    callback: this.onTokBoxServletResponse_Join,
                    options: {
                        remoteWidget: widget // we open the box to their widget
                    }
                });    
            }
        },
        
        /**
         * 
         * @param chat {Xmpp4Js.Chat.Chat} The chat the message is related to
         * @param message {Xmpp4Js.Packet.Message} The incoming message
         * @private
         */
        onMessageSent : function( chat, message ) {
            var cr = Ext.ComponentMgr.get( this.chatRendererId );
            cr.appendMessage( chat.getOutgoingJid(), message.getBody(), "blue" );
            cr.scrollToBottom();
        },
        onChatClosed : function( chat ) {
            var cr = Ext.ComponentMgr.get( this.chatRendererId );
            cr.appendNotice( "The chat was closed." ); 
            
            this.ownerCt.remove( this, true );
        },
    
        onAddContact: function() {
            var addContactDlg = this.dialogManager.createAddContactDialog({
                //initialGroup: // TODO some kind of default group... selection, etc.
                initialUsername: this.chat.getParticipant().withoutResource().toString()
            });
            addContactDlg.show();
        }
}

Ext.extend( Soashable.Dialog.ChatDialog.Tab, Ext.Panel, Soashable.Dialog.ChatDialog.Tab.prototype);

