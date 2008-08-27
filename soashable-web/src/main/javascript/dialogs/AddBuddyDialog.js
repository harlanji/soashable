Ext.namespace( "Soashable.Dialog" );


/**
 * @class
 */
Soashable.Dialog.AddBuddyDialog = function(config) {
    this.title = config.title;
    this.lang = config.lang;
    this.groups = config.groups;
    
    this.initialGroup = config.initialGroup ? config.initialGroup : undefined;
    this.initialUsername = config.initialUsername ? config.initialUsername : undefined;
    this.initialAlias = config.initialAlias ? config.initialAlias : undefined;
    
    
    this.usernameId = "addbuddy-username";
    this.groupId = "addbuddy-group";
    this.aliasId = "addbuddy-alias";
    
    var superConfig = Ext.apply( config, {
        title: this.title,
        width: 310,
        height: 167,

        layout: 'form',
        title: this.title, // cancels out the title we passed in, because that makes it ugly using ext panel title.
        defaultType: 'textfield',
        defaults: {
            // applied to each contained item
            width: 150,
            msgTarget: 'side'
        },

        items: [
        {
            fieldLabel: this.lang.username,
            name: 'username',
            allowBlank: false,
            emptyText: this.lang.enterUsernameBlank,
            value: this.initialUsername,

            id: this.usernameId
        },{
            fieldLabel: this.lang.alias,
            name: 'alias',
            allowBlank: true,
            value: this.initialAlias,

            id: this.aliasId
        },{
            xtype: 'combo',
            id: this.groupId,
            fieldLabel: this.lang.group,
            mode: 'local',
            store: this.getGroupStore(),
            value: this.initialGroup,
            tpl: Soashable.Dialog.AddBuddyDialog.showTemplate,
            displayField: 'group',
            valueField: 'group',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            width: 150
        }
        
        ],

        buttons: [{
            id: "addbuddy-ok-button",
            text: this.lang.addContactButton,
            scope: this,
            handler: this.onAddBuddyClicked
        }]
    });
    
    this.addEvents({
        /**
         * @event addbuddy
         * @param {String} jid
         * @param {String} groupName
         * @param {String} alias
         */
        addbuddy: true
    })

    Soashable.Dialog.AddBuddyDialog.superclass.constructor.call( this, superConfig );
}

/**
 * The template to be shown in the status dropdown. Has 'text', 'show', 'icon' and 'color tokens.
 */
Soashable.Dialog.AddBuddyDialog.showTemplate = '<tpl for="."><div class="x-combo-list-item">{group}</div></tpl>';


Soashable.Dialog.AddBuddyDialog.prototype = {
    /**
     * @private
     */
     onAddBuddyClicked: function() {
        var usernameField = Ext.ComponentMgr.get(this.usernameId);
        var groupField = Ext.ComponentMgr.get(this.groupId);
        var aliasField = Ext.ComponentMgr.get(this.aliasId);

        var jid = usernameField.getValue();
        var groupName = groupField.getValue();
        var alias = aliasField.getValue();
        
        this.fireEvent( "addbuddy", jid, groupName, alias );
    },

    /**
     * Creaets and returns a store with all status states, merged
     * with the lang object:
     * row data: 'text', 'show', 'icon', and 'color' fields.
     * @private
     */
    getGroupStore: function() {
        
        var data = [];
        for( var i = 0; i < this.groups.length; i++ ) {
            var groupName = this.groups[i];
            
            data.push( [groupName] );
        }
        
        var config = {
            fields: ['group'],
            // TODO generate data from the actual roster
            data : data
        }

        return new Ext.data.SimpleStore(config);
    }
}

Ext.extend( Soashable.Dialog.AddBuddyDialog, Ext.Window, Soashable.Dialog.AddBuddyDialog.prototype );