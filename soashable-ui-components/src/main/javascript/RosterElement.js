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


Ext.namespace( "Xmpp4Js.UI.Roster" );

/**
 * @class The visual representation and common operations that can be performed on a roster.
 * @extends Ext.tree.TreePanel
 *
 * Creates a tree
 * @param {Object} config
 */
Xmpp4Js.UI.Roster.RosterTree = function(config) {
    var root = new Ext.tree.TreeNode({
        text: 'Roster', 
        allowDrag:false,
        allowDrop:true,
        expanded: true
    });


    var superConfig = Ext.apply( config, {
        // FIXME this form of ctor should work but doesn't.
        // extjs2 alpha
        //renderTo: elem,
        //items: [root],
        animate:true, 
        enableDD:true,
        ddGroup: 'rosterDD',
        rootVisible:false,
        autoScroll: true,
        root: root
    });
    
    this.addEvents({
        /**
         * Fires when an item is moved from one group to another
         *
         * @event itemmoved
         * @param {Ext.tree.TreeNode} item
         * @param {Ext.tree.TreeNode} fromGroup
         * @param {Ext.tree.TreeNode} toGroup
         */
        itemmoved: true,
        
        /**
         * Fires when a group is moved. Currently there are no nested roster groups
         * (though, see XEP-0083: Nested Roster Groups)
         *
         * @event groupmoved
         * @param {Ext.tree.TreeNode} group
         * @param {Ext.tree.TreeNode} oldParent always root node
         * @param {Ext.tree.TreeNode} newParent always root node
         * @param {int} index The new sort order 
         */
        groupmoved: true,
        
        /**
         * Fires when a new item is created.
         *
         * @event itemcreated
         * @param {Ext.tree.TreeNode} item
         * @param {Ext.tree.TreeNode} group
         */
        itemcreated: true,
        
        /**
         * Fires when a new group is created.
         *
         * @event groupcreated
         * @param {Ext.tree.TreeNode} group
         */
        groupcreated: true
    });


    Xmpp4Js.UI.Roster.RosterTree.superclass.constructor.call( this, superConfig );

    // always create the offline user group
    this.createGroup( Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP );
}

Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP = "Offline Buddies";

Xmpp4Js.UI.Roster.RosterTree.prototype = {

    /**
     * Returns an item node by jid and group name.
     *
     * @param {String} groupName
     * @param {String} jid
     * @return Ext.tree.TreeNode
     */
    getItem: function( groupName, jid ) {
        var groupNode = this.getGroup(groupName);
        var itemNode = groupNode.findChild( "jid", jid );

        return itemNode;
    },

    /**
     * Returns an array of item nodes, one for each group node it exists under.
     *
     * @param {String} groupName
     * @param {String} jid
     * @return Array of Ext.tree.TreeNode
     */
    getItemInAllGroups: function( jid ) {
        var root = this.getRootNode();

        var items = [];

        for( var i = 0; i < root.childNodes.length; i++ ) {
            var groupNode = root.childNodes[i];
            if( groupNode.attributes.groupName == Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP ) {
                continue;
            }


            var item = groupNode.findChild( "jid", jid );

            if( item != null ) {
                items.push( item );
            }
        }

        return items;
    },

    /**
     * Returns a group node by name
     *
     * @param {String} groupName
     * @return Array of Ext.tree.TreeNode
     */
    getGroup: function(groupName) {
        var root = this.getRootNode();
        var groupNode = root.findChild( "groupName", groupName );

        return groupNode;
    },

    /**
     * Creates and returns a group by name. Throws an error if it exists.
     *
     * @param {String} groupName
     * @return Array of Ext.tree.TreeNode
     */
    createGroup: function(groupName) {
        if( this.getGroup(groupName) != null ) {
            throw new Error( "The group "+groupName+" already exists" );   
        }
        
        var root = this.getRootNode();

        var groupNode = new Ext.tree.TreeNode({
            name: "group." + groupName,
            expanded: true,
            text: groupName,
            type: "group",
            groupName: groupName,
            listeners: {
                scope: this,
                beforemove: function(tree, node, oldParent, newParent, index) {
                    var canMove = oldParent == newParent;

                    return canMove;
                },
                move: function(node, oldParent, newParent, index ) {
                    this.fireEvent( "groupmoved", node, oldParent, newParent, index );
                }
            }
        });

        root.appendChild( groupNode );
        
        this.fireEvent( "groupcreated", groupNode );
        return groupNode;
    },
    
    /**
     * Sorts the offline group at the end, always. Leaves anything else alone.
     */
    sort: function() {
        var root = this.getRootNode();
        
        root.sort( function(node) {
            // sink offline group to the end.
            if( node.attributes.groupName == Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP ) { return 1; }
            else{ return -1; }
            
        });   
    },

    /**
     * Creates and returns an item by jid and group name. 
     * Throws an error if the item exists under the given gorup name.
     *
     * @param {String} groupName
     * @param {String} jid
     * @return Array of Ext.tree.TreeNode
     */
    createItem: function( groupName, jid ) {
        if( this.getItem(groupName, jid) != null ) {
            throw new Error( "The item "+jid+" in group "+groupName+" already exists" );   
        }
        var groupNode = this.getGroup(groupName);
        
        if( groupNode == null ) {
            throw new Error( "The group " + groupName + " does not exist" );   
        }

        var itemNode = new Ext.tree.TreeNode({
            name: "item." + jid,
            // FIXME this icon is in soashable!
            //       use an icon set similar to lang, or something.
            //iconCls: "status-icon status-person",  // this still adds x-tree-node. see fix below.
            icon: false,
            leaf: true,
            text: jid,
            type: "item",
            jid: jid,
            listeners: {
                scope: this,
                beforemove: function(tree, node, oldParent, newParent, index) {
                    var canMove = newParent.attributes.groupName != Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP 
                        && newParent.attributes.type == "group" 
                        && !this.getItem( newParent.attributes.groupName, node.attributes.jid );
                        
                    return canMove;
                },
                move: function(tree, node, oldParent, newParent, index ) {
                    this.fireEvent( "itemmoved", node, oldParent, newParent );
                }, 
                render: function() {
                    itemNode.getUI().getIconEl().className = "status-icon status-person";
                }
            }
        });
        
        groupNode.appendChild( itemNode );
        
        this.fireEvent( "itemcreated", itemNode, groupNode );

        return itemNode;
    },

    /**
     * Moves an item from a given group to a given group. Throws
     * an error if any group/item doesn't exist or the item exists
     * in the destination group
     */
    moveItem: function(fromGroupName, toGroupName, jid) {
        var fromGroup = this.getGroup(fromGroupName);
        var toGroup = this.getGroup(toGroupName);
        var item = this.getItem(fromGroupName, jid);
        
        if( item == null ) {
            throw new Error( "Item " + jid + " does not exist in group " + fromGroupName );   
        }
        if( fromGroup == null ) {
            throw new Error( "The from group, " + fromGroupName + ", does not exist" );   
        }
        if( toGroup == null ) {
            throw new Error( "The to group, " + toGroupName + ", does not exist" );   
        }
        if( this.getItem(toGroupName, jid) != null ) {
            throw new Error( "The item "+jid+" in group "+toGroupName+" already exists" );   
        }
        fromGroup.removeChild( item );
        toGroup.appendChild( item );
        //this.createItem( toGroupName, jid );
        
        this.fireEvent( "itemmoved", item, fromGroup, toGroup );
    },

    /**
     * Sets the given jid to only exist in given groups. DOES NOT create all
     * requisite groups and WILL error if they don't exist.
     *
     * @param {String} jid
     * @param {Array of Strings} newGroups
     */
    updateItemGroups: function( jid, newGroups ) {
        var root = this.getRootNode();

        for( var i = 0; i < root.childNodes.length; i++ ) {
            var groupNode = root.childNodes[i];
            var groupName = groupNode.attributes.groupName;

            var itemNode = this.getItem( groupName, jid );

            if( itemNode == null && newGroups.indexOf( groupName ) > -1 ) {
                this.createItem( groupName, jid );
            } else if( itemNode != null && newGroups.indexOf( groupName ) == -1 ) {
                itemNode.remove();
            }
        }
    },
    
    /**
     * Creates all groups in an array. If the group already exists,
     * no error is thrown. Sorts at the end.
     *
     * @param {Array of Strings} groups
     */
    createGroups: function( groups ) {
        for( var i = 0; i < groups.length; i++ ) {
            var groupName = groups[i];

            var groupNode = this.getGroup( groupName );
            try {
                this.createGroup( groupName );
            } catch( e ) {
                // no big deal
            } 
        }
        
        this.sort();
    },
    
    /**
     * Remove an item in all groups returned by getItemInAllGroups
     * @param {String} jid
     */
    removeItemFromAllGroups: function( jid ) {
        var items = this.getItemInAllGroups(jid);
        for( var i = 0; i < items.length; i++ ) {
            var itemNode = items[i];

            itemNode.remove();
        }
    },

    /**
     * Removes item from the offline user group if it exists, and adds it to all given groups
     *
     * @param {String} jid
     * @param {Array of Strings} groups
     */
    setOnline: function( jid, groups ) {
        var offlineItem = this.getItem( Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP, jid );
        if( offlineItem != null ) {
            offlineItem.remove();
        }

        
        //this.updateItemGroups( jid, groups );
    },

    /**
     * Removes item from all groups and adds it to the online group.
     *
     * @param {String} jid
     */
    setOffline: function( jid ) {
        this.removeItemFromAllGroups();
        var itemNode = this.createItem( Xmpp4Js.UI.Roster.RosterTree.OFFLINE_GROUP, jid );
        
        itemNode.getUI().getIconEl().className = "status-icon status-offline";
    }
}

Ext.extend( Xmpp4Js.UI.Roster.RosterTree, Ext.tree.TreePanel, Xmpp4Js.UI.Roster.RosterTree.prototype );


Ext.namespace( "Xmpp4Js.UI.Roster" );

/**
* 
* @param {Object} config - takes rim, pm, and con
* @constructor
*/
Xmpp4Js.UI.Roster.BoundRosterTree = function(config) {
    this.rim = config.rim;
    this.pm = config.pm;
    this.con = config.con;
    
    // add listeners so we can update the elements accordingly
    this.rim.on({
        scope: this,
        add: this.onRosterItemAdd,
        update: this.onRosterItemUpdate,
        remove: this.onRosterItemRemove
    });
    this.pm.on({
        scope: this,
        update: this.onPresenceUpdate
    });

    Xmpp4Js.UI.Roster.BoundRosterTree.superclass.constructor.call(this, config);
    
    this.createGroup( Xmpp4Js.UI.Roster.BoundRosterTree.UNFILED_GROUP );
    this.sort();
}

Xmpp4Js.UI.Roster.BoundRosterTree.UNFILED_GROUP = "Unfiled Entries";

Xmpp4Js.UI.Roster.BoundRosterTree.logger = Xmpp4Js.createLogger("soashable.ui.boundrostertree");

Xmpp4Js.UI.Roster.BoundRosterTree.prototype = {    
    
    /**
     * @private
     */
    onRosterItemAdd: function( entry ) {
        this.onRosterItemUpdate( null, entry );
    },

    /**
     * @private
     */
    onRosterItemUpdate: function( oldEntry, entry ) {
        var groups = entry.getGroups();
        for( var i = 0; i < groups.length; i++ ) {
            groups[i] = groups[i].name;
        }
        
        this.createGroups( groups );
        
        var bestPresence = this.pm.getBest( new Xmpp4Js.Jid(entry.jid).withoutResource().toString() );
        if( bestPresence ) {
            this.onPresenceUpdate( bestPresence );
        } else {
            try {
                this.setOffline( entry.jid );
            } catch(e) {
                // they're already offline
            }
        }
    },

    /**
     * @private
     */
    onRosterItemRemove: function( entry ) {
        this.removeItemFromAllGroups( entry.jid );
    },
    /**
     * @private
     */
    onPresenceUpdate: function( newPresence ) {
        var jid = newPresence.getFromJid();
        
        var bestPresence = this.pm.getBest( jid.withoutResource().toString() );
        
        var entry = this.rim.get( jid.withoutResource().toString(), jid.getResource() );
        
;;;     Xmpp4Js.UI.Roster.BoundRosterTree.logger.info( jid.toString() + " is now " + newPresence.getType() + "; entry: " );

        if( entry != null ) {
            if( bestPresence.getType() == "available" ) {
                
                var groups = entry.getGroups();
                for( var i = 0; i < groups.length; i++ ) {
                    groups[i] = groups[i].name;
                }
                
                this.updateItemGroups( jid.withoutResource().toString(), groups );

                for( var i = 0; i < groups.length; i++ ) {
                    var groupName = groups[i];

                    var itemNode = this.getItem( groupName, jid.withoutResource().toString() );
                    itemNode.getUI().getIconEl().className = "status-icon status-"+bestPresence.getShow(); 
                }
                
                this.setOnline( jid.withoutResource().toString() );
            } else if( bestPresence.getType() == "unavailable" ) {
                this.setOffline( jid.withoutResource().toString() );
            }
        } else {
;;;         Xmpp4Js.UI.Roster.BoundRosterTree.logger.warn( jid.toString() + " is not in roster." );
        }
    }
}

Ext.extend( Xmpp4Js.UI.Roster.BoundRosterTree, Xmpp4Js.UI.Roster.RosterTree, Xmpp4Js.UI.Roster.BoundRosterTree.prototype);

Ext.ComponentMgr.registerType( "xmpp4js.rostertree", Xmpp4Js.UI.Roster.BoundRosterTree );



