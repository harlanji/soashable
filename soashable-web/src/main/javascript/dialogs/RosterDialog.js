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


Ext.namespace( "Soashable.Dialog.RosterDialog" );

/**
* Initialize RosterWindow and add onRosterUpdate as a listener to roster, and
* reload roster to get all updates.
*
* TODO use a config object
*
* @param roster Roster the roster to bind to
*/
Soashable.Dialog.RosterDialog.Default = function( winId, dialogManager, roster, lang) {
    this.dialogManager = dialogManager;
    this.roster = roster;
    this.lang = lang;
    
    var config = {
        id: winId,
        height : 400,
        width : 300,
        title : this.lang.rosterTitle,
        renderTo: document.body,
        closable: false,
        tbar: [{ 
            text: this.lang.addContactButton, 
            icon: "images/roster/plus.gif",
            cls: 'x-btn-text-icon add-contact',
            handler: this._onAddContact,
            scope: this
        },
        { 
            text: this.lang.removeContactButton, 
            icon: "images/roster/minus.gif",
            cls: 'x-btn-text-icon remove-contact',
            handler: this.onDeleteContact,
            scope: this
        },
        { 
            text: this.lang.addGroupButton, 
            icon: "images/roster/plus.gif",
            cls: 'x-btn-text-icon add-group',
            handler: this.onAddGroup,
            scope: this
        },
        { 
            text: this.lang.signoutButton, 
            cls: 'x-btn-text-icon signout',
            handler: this.onSignout,
            scope: this
        }],
        layout: 'border',
        items: [{
                region: 'center',
                layout: 'accordion',
                border: false,
                layoutConfig: {
                    animate: false
                },
                items: [{
                    title: this.lang.onlineUsersTitle,
                    id: "roster-tree",
                    xtype: "xmpp4js.rostertree",
                    lang: this.lang,
                    rim: roster.getRosterItemManager(), 
                    pm: roster.getPresenceManager(), 
                    con: roster.getConnection(),
                    lines: false,
                    listeners: {
                        scope: this,
                        "itemcreated": this._onEntryNodeCreated,
                        "groupcreated": this._onGroupNodeCreated,
                        "itemmoved": this.onItemMoved,
                        "render": function() {
                            roster.reload();
                        }
                    },
                    tools:[{
                        id:'refresh',
                        on:{
                            click: function(){
                                roster.reload();
                            },
                            scope: this
                        }
                    }]
                },
                {
                    title: this.lang.settingsTitle,
                    html: "I love settings."
                }]
        },
        {
            region: 'south',
            xtype: "soashable.statusbox",
            lang: this.lang,
            listeners: {
                scope: this,
                statuschange: this.onStatusChange
            }

        }]
    };
    
    Soashable.Dialog.RosterDialog.Default.superclass.constructor.call( this, config );
    
    this.addEvents({
        "itemDblClick" : true,
        "groupDblClick" : true
    });
    
    this.createGroupContextMenu();
}


Ext.extend(Soashable.Dialog.RosterDialog.Default, Ext.Window, {
    _onAddContact: function(o, e) {
        var selectedGroup = undefined;
        
        var tree = Ext.getCmp( "roster-tree" );
        var selNode = tree.getSelectionModel().getSelectedNode();
        if( selNode != null && selNode.attributes.type == "group" ) {
            selectedGroup = selNode.attributes.groupName
        }
        
        var addContactDlg = this.dialogManager.createAddContactDialog({
            initialGroup: selectedGroup
        });
        addContactDlg.show();
    },
    
    onDeleteContact: function() {
        var selectedJid = undefined;
        
        var tree = Ext.getCmp( "roster-tree" );
        var selNode = tree.getSelectionModel().getSelectedNode();
        
        // HACK getSelection doesn't seem to recognize node that was context-clicked on.
        var selNode = this.selectedItem || selNode;

        if( selNode != null && selNode.attributes.type == "item" ) {
            selectedJid = selNode.attributes.jid;

            Ext.MessageBox.confirm( "Delete Contact", "Are you sure you want to completely remove "+selectedJid+" from your contact list?", function(btn) {
                if( btn == "yes" ) {
                    var p = new Xmpp4Js.Packet.RosterPacket();
                    p.addItem( selectedJid, null, null, "remove" );

                    this.roster.getConnection().send( p );
                }
            }, this);
        }
    },
    
    onAddGroup: function() {
        var tree = Ext.getCmp( "roster-tree" );

        var prompt = Ext.MessageBox.prompt( "Create Group", "Enter the name of the group", function(btn, text) {
            if( btn == "ok" ) {
                tree.createGroup( text );
            }
        } );
    },
    
    onSignout: function() {
        this.roster.getConnection().close();
    },

    onItemMoved: function(node, oldParent, newParent) {
        var jid = node.attributes.jid;
        
        var rim = this.roster.getRosterItemManager();
        
        var entry = rim.get( jid );
        // create a list of names starting with the new group
        var groupNames = [ newParent.attributes.groupName ];
        
        // get all groups except the old group
        var groups = entry.getGroups();
        for( var i = 0; i < groups.length; i++ ) {
            var groupName = groups[i].name;
            if( groupName != oldParent.attributes.groupName ) {
                groupNames.push( groupName );
            }
        }
        
        var packet = new Xmpp4Js.Packet.RosterPacket();
        packet.addItem( jid, entry.alias, groupNames );

        this.roster.getConnection().send( packet ); 
    },

    _onRosterTreeItemDblClick: function(node) {
        var jid = node.attributes.jid;
        this.fireEvent( "itemDblClick", jid );
    },
    
    onStatusChange: function(show, status) {
        var con = this.roster.getConnection();
        
        if( show == "invisible" ) {
            Ext.Msg.alert( "Not Implemented", "Invisibility is not implemented yet." );
        } else {
            var pres = new Xmpp4Js.Packet.Presence( "available", null, status, show );
            con.send( pres );
        }
    },

    /**
     * Creates the (right click) context menu that is associated with group entries.
     */
    createGroupContextMenu: function() {

        var clickHandler = function() {
            Ext.Msg.alert( "Not Implemented", "Not implemented" );
            Ext.menu.MenuMgr.get("groupContextMenu").hide();
        }

        var groupContextMenu = new Ext.menu.Menu({
            id: 'groupContextMenu',
            items: [
                {
                    text: 'Add Contact',
                    scope: this,
                    handler: this._onAddContact
                },
                {
                    text: 'Delete Group',
                    scope: this,
                    handler: clickHandler
                }
            ]
        });
        
        var itemContextMenu = new Ext.menu.Menu({
            id: 'itemContextMenu',
            items: [
                {
                    text: 'Delete',
                    scope: this,
                    handler: this.onDeleteContact
                }
            ]
        });

    },

    _onEntryNodeCreated: function( entryNode, groupNode ) {
        entryNode.on( {
            dblclick: this._onRosterTreeItemDblClick,
            contextmenu: function(node, e) {
                
                // HACK getSelection doesn't seem to recognize node that was context-clicked on.
                this.selectedItem = node;
                
                Ext.menu.MenuMgr.get("itemContextMenu").show( node.ui.getAnchor() );
            },
            scope: this
        } );
/*
        var jid = new Xmpp4Js.Jid( entryNode.attributes.jid );

        if( jid.getDomain() == "aim.soashable.com" && jid.getNode() == "" ) {
            entryNode.getUI().addClass( "x-transport" );
        } else if( jid.getDomain() == "aim.soashable.com" ) {
        entryNode.getUI().addClass( "x-network-aim" );
    }
    */
    },

    _onGroupNodeCreated: function( groupNode ) {
        groupNode.on( {
            //dblclick: this._onRosterTreeItemDblClick,
            contextmenu: function(node, e) {
                // HACK getSelection doesn't seem to recognize node that was context-clicked on.
                this.selectedItem = node;
                
                Ext.menu.MenuMgr.get("groupContextMenu").show( node.ui.getAnchor() );
            },
            scope: this
        } );
    },

    _onUpdateGroupsEntryNode: function( entry, groups ) {
        var packet = new Xmpp4Js.Packet.RosterPacket();
        packet.addItem( entry.jid, entry.alias, groups );

        this.roster.getConnection().send( packet );
    }


});

