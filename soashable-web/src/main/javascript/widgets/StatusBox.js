Ext.namespace( "Soashable.Widget" );

/**
 * @class A simple status box that has a 'statuschange' event that can be reacted to.
 */
Soashable.Widget.StatusBox = function(config) {
    /** @private */
    this.showComboId = Ext.id();
    /** @private */
    this.statusTextId = Ext.id();
    
    this.lang = config.lang;

    config = Ext.apply( config, {
        height: 50,
        layout: 'table',
        layoutConfig: {
            columns: 1
        },
        items: [{
            xtype: 'combo',
            id: this.showComboId,
            mode: 'local',
            store: this.getShowStore(),
            tpl: Soashable.Widget.StatusBox.showTemplate,
            displayField: 'text',
            valueField: 'show',
            value: 'available',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            width: 250,
            listeners: {
                scope: this,
                select: this.onChange
            }
        },
        {
            xtype: 'textfield',
            id: this.statusTextId,
            width: 250,
            emptyText: this.lang.enterStatusMessage,
            listeners: {
                scope: this,
                blur: this.onChange
            }
        }]
    });

    Soashable.Widget.StatusBox.superclass.constructor.call( this, config );
    
    this.addEvents({
        /**
         * @event statuschange
         * @param {String} show
         * @param {String} status
         */
        'statuschange' : true
    });

}


/**
 * The template to be shown in the status dropdown. Has 'text', 'show', 'icon' and 'color tokens.
 */
Soashable.Widget.StatusBox.showTemplate = '<tpl for="."><div style="color: {color};" class="x-combo-list-item"><img src="{icon}" alt="{text}"/> {text}</div></tpl>';


Soashable.Widget.StatusBox.prototype = {
    /**
     * Fired when the combobox value changes or the text value is blurred.
     * @private
     */
    onChange : function() {
        var showField = Ext.ComponentMgr.get(this.showComboId);
        var statusField = Ext.ComponentMgr.get(this.statusTextId);

        var status = statusField.getValue();
        var show = showField.getValue();

        this.fireEvent( "statuschange", show, status );
    },
    
    /**
     * Creaets and returns a store with all status states, merged
     * with the lang object:
     * row data: 'text', 'show', 'icon', and 'color' fields.
     * @private
     */
    getShowStore: function(config) {
        
        var config = {
            fields: ['text', 'show', 'icon', 'color'],
            data : [
                ['statusChat',  'chat',         'images/status/chat.png',     'green'],
                ['statusAvailable',       'available',    'images/status/available.png',     'black'], 
                ['statusAway',            'away',         'images/status/away.png',     'gray'], 
                ['statusXA',   'xa',           'images/status/extended-away.png',     'gray'], 
                ['statusDND',  'dnd',          'images/status/busy.png',     'red'],
                ['statusInvisible',       'invisible',    'images/status/invisible.png',     'silver']
            ]
        }
        
        for( var i = 0; i < config.data.length; i++) {
            var row = config.data[i];
            
            // the title row will be the name of a string,
            // replace it with the actual string.
            row[0] = this.lang[ row[0] ];
        }
        return new Ext.data.SimpleStore(config);
    }
}

Ext.extend( Soashable.Widget.StatusBox, Ext.Panel, Soashable.Widget.StatusBox.prototype);

Ext.ComponentMgr.registerType( "soashable.statusbox", Soashable.Widget.StatusBox );