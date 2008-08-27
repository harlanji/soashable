
Ext.namespace("Soashable.Ext");

/**
 * @constructor
 * @extends Xmpp4Js.Ext.PacketExtension
 */
Soashable.Ext.TokBox = function(stanza, widget) {
    Soashable.Ext.TokBox.superclass.constructor.call( this, stanza );

    if( widget ) {
        this.setWidget( widget );
    }
}

Soashable.Ext.TokBox.XMLNS = "soashable:app:tokbox";

Soashable.Ext.TokBox.prototype = {
    
    getElementNS : function() {
        return Soashable.Ext.TokBox.XMLNS;
    },
    setWidget: function(widget) {
        
        // add the new state
        this.getNode().setAttribute( "widget", widget);
    },
    
    getWidget: function() {
        return this.widget;
    },
    
    readNode : function() {
        Soashable.Ext.TokBox.superclass.readNode.call( this );
        
        // FIXME this is potentially flaky... if there are text nodes, etc.
        this.widget = this.getNode().getAttribute("widget");
    },
    createNode : function(widget) {
        Soashable.Ext.TokBox.superclass.createNode.call(this);
        
        if( widget ) {
            this.setWidget( widget );
        }
    }
};

Ext.extend( Soashable.Ext.TokBox, Xmpp4Js.Ext.PacketExtension, Soashable.Ext.TokBox.prototype );