var SOASHABLE_DOMAIN = "${soashable.domain}";

var BOSH_TRANSPORT = eval( "${bosh.transport}" );
var BOSH_ENDPOINT = "${bosh.endpoint}";
var BOSH_ENDPOINT_SECURE = "${bosh.endpoint.secure}";


// single global.
var soashable;

Ext.onReady( function() {
    
    if( Ext.isGecko || Ext.isIE || Ext.isOpera || Ext.isSafari) {
        // assign to global.
        soashable = new Soashable(Soashable.Lang.EN);
        soashable.start();
    } else {
        Ext.MessageBox.show({
            title: "Compatibility", 
            msg: "Sorry, this application is only known to work on "+
                "Firefox 2.x, IE7 and Opera. If you wanna be a good sport and help out, "+
                "<a href='http://code.google.com/p/soashable/issues/detail?id=16' "+
                "target='_blank'>here is the ticket</a>.",
            buttons: false,
            icon: Ext.MessageBox.ERROR,
            closable: false,
            modal: false
        });
    }
    
    var blogDlg = new Soashable.Dialog.BlogDialog({lang: this.lang});
    blogDlg.setPosition( 232, 112 );
    blogDlg.show();
    blogDlg.toBack();

});