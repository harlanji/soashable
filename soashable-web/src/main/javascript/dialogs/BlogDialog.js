Ext.namespace( "Soashable.Dialog" );


/**
 * @class
 */
Soashable.Dialog.BlogDialog = function(config) {
    this.lang = config.lang;
    
    var superConfig = Ext.apply( config, {
        title: "Soashable Blog",
        autoLoad: "/blog",
        width: 300,
        height: 300,
        bodyStyle: 'padding: 7px',
        autoScroll: true
        
    });

    Soashable.Dialog.BlogDialog.superclass.constructor.call( this, superConfig );
}

Soashable.Dialog.BlogDialog.prototype = {

}

Ext.extend( Soashable.Dialog.BlogDialog, Ext.Window, Soashable.Dialog.BlogDialog.prototype );