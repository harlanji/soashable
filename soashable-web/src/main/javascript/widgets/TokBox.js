Ext.namespace( "Soashable.Widget" );

/**
 * @class Renders a flash player with TokBox, using the user's widget and user info.
 */
 
Soashable.Widget.TokBox = function(config) {
    /**
     * @private
     * @type {Ext.Element}
     */
    this.el = null;
    
    var superConfig = Ext.apply( config, {
        width: 540,
        height: 260
    });
    
    Soashable.Widget.TokBox.superclass.constructor.call( this, superConfig );
}

/**
* Used as the main box (i.e. that everything is rendered into)
* @private
*/
Soashable.Widget.TokBox.boxTemplate = new Ext.Template( '<div class="tokbox" id="{id}" style="width: {width}px; height: {height}px;"><object type="application/x-shockwave-flash" data="http://www.tokbox.com/f/{tokboxWidget}" width="{width}" height="{height}"><param name="movie" value="http://www.tokbox.com/f/{tokboxWidget}"></param><param name=FlashVars value="user={tokboxUserId}&pass={tokboxPasswordMd5}"></param></object></div>' );

Soashable.Widget.TokBox.prototype = {    
    /**
    * Handle the actual rendering of the component.
    * @private
    */
    onRender : function(ct, position) {
        var tplVars = {
            id: this.getId(),
            tokboxWidget: this.initialConfig.widget,
            tokboxUserId: this.initialConfig.userId,
            tokboxPasswordMd5: hex_md5(this.initialConfig.password),
            
            height: this.initialConfig.height,
            width: this.initialConfig.width
        };
        
        var el = Soashable.Widget.TokBox.boxTemplate.append( ct, tplVars );
        el = Ext.get( el )
        this.el = el;
        
        this.setSize(this.initialConfig.width, this.initialConfig.height);
    }
}

Ext.extend( Soashable.Widget.TokBox, Ext.BoxComponent, Soashable.Widget.TokBox.prototype );

Ext.ComponentMgr.registerType( "soashable.tokbox", Soashable.Widget.TokBox );