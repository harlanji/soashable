Ext.namespace( "Xmpp4Js.UI.Chat" );

/** 
* @class A place were messages can be appended. Useful for Chat / IM windows. Component xtype = xmpp4js.chatrenderer.
*
* 	<pre>var cr = new Xmpp4Js.UI.Chat.ChatRenderer({
* 	renderTo: document.body,
* 	listeners: {
* 		render: function(cr) {
* 			cr.appendMessage( "test at test.com", "hello" );
* 			cr.appendMessage( "test at test.com", "hello" );
* 			cr.appendNotice( "omg cars" );
* 			cr.appendMessage( "test at test.com", "hello" );
* 		}
* 	}
* });</pre>
*
* @constructor
*/
Xmpp4Js.UI.Chat.ChatRenderer = function(config) {
    /**
     * @private
     * @type {Ext.Element}
     */
    this.el = null;
    /**
     * @private
     */
    this.timestampsEnabled = false;
    
    var superConfig = Ext.apply( config, {
        //autoScroll: true,
        fitToContainer: true,
        layout: 'fit'
    });
    
    Xmpp4Js.UI.Chat.ChatRenderer.superclass.constructor.call( this, superConfig );
}

/**
* Used as the main box (i.e. that everything is rendered into)
* @private
*/
Xmpp4Js.UI.Chat.ChatRenderer.boxTemplate = new Ext.Template( '<div id="{id}"></div>' );
/**
* Used as the format for each message that is appended.
* @private
* @param color {String} An HTML color value.
* @param from {String} The entity to display in the from field (could include timestamp).
* @param message {String} The plain or HTML string to show as the message.
*/
Xmpp4Js.UI.Chat.ChatRenderer.messageTemplate = new Ext.Template('<div class="chat-message"><span class="from" style="color: {color};">{from}:</span> <span class="text">{message}</span></div>')
/**
* @private
* @param message {String} The plain or HTML string to show as the message.
*/
Xmpp4Js.UI.Chat.ChatRenderer.noticeTemplate = new Ext.Template('<div class="chat-notice">{message}</div>');

Xmpp4Js.UI.Chat.ChatRenderer.prototype = {
    /**
    * Append a message from another entity (or self).
    *
    * @param from {String} The entity to display in the from field (could include timestamp).
    * @param message {String} The plain or HTML string to show as the message.
    * @param color {String} An HTML color value.
    */
    appendMessage : function(from, message, color) {
        if( !color ) {
            color = 'red';
        }
        Xmpp4Js.UI.Chat.ChatRenderer.messageTemplate.append( this.getEl(), {from: from, message: message, color: color} );
        
    },
    /**
    * Append some sort of status message or notice.
    * @param message {String} The plain or HTML string to show as the message.
    */
    appendNotice : function(message) {
        Xmpp4Js.UI.Chat.ChatRenderer.noticeTemplate.append( this.getEl(), {message: message} );
    },
    
    /**
    * Handle the actual rendering of the component.
    * @private
    */
    onRender : function(ct, position) {
        var el = Xmpp4Js.UI.Chat.ChatRenderer.boxTemplate.append( ct, {id: this.initialConfig.id} );
        el = Ext.get( el )
        this.el = el;
    },
    
    scrollToBottom: function() {
        // FIXME make this component a Panel so it can scroll itself.
        this.ownerCt.body.scroll("down", 5000, true);
    }
}

Ext.extend( Xmpp4Js.UI.Chat.ChatRenderer, Ext.BoxComponent, Xmpp4Js.UI.Chat.ChatRenderer.prototype );

Ext.ComponentMgr.registerType( "xmpp4js.chatrenderer", Xmpp4Js.UI.Chat.ChatRenderer );
