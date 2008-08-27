function PopoutWindow(config) {
    var config = Ext.apply( config, {
    	
    	listeners: {
    		scope: this,
    		titlechange: this.onTitleChange
    	}
    });
    
    // do not popin on close by default
    this.popinOnClose = config.popinOnClose != undefined ? config.popinOnClose : false;
    
    this.isPopout = false;
	
    PopoutWindow.superclass.constructor.call( this, config );
}

PopoutWindow.template = '<html><head><script type="text/javascript">window.onload = onPopoutOpened; window.onunload = onPopoutClosed;</script><!-- TODO load this dynamically --><link rel="stylesheet" type="text/css" href="ext-2.0.1/resources/css/ext-all.css"/></head><body></body></html>';

PopoutWindow.prototype = {
    popout: function() {
	var id = "soashable";
	
	var box = this.getBox();
	
	var x = window.screenX + box.x;
	// this is a rough approximation of the position. need to experiment more for exact.
	var y = window.screenY + box.y + ((window.outerHeight - window.innerHeight) / 2);
	var h = box.height;
	var w = box.width;
	
	var props = "toolbar=no,status=no,location=no,menubar=no,resizable=yes,scrollbars=no,height="+h+",width="+w+",screenX="+x+",screenY="+y;

	// open the popout window 
	this.popoutWin = window.open( "popout.html", id, props );
	
	
	// the popout calls onPopoutOpened in onload
	var self = this;
	this.popoutWin.onPopoutOpened = function() {
		self.onPopoutOpened();
	}
	// this is called by onunload
	this.popoutWin.onPopoutClosed = function() {
		self.onPopoutClosed();	
	}
/*
	// load the document. close triggers onload to be called.
	this.popoutWin.document.open();
	this.popoutWin.document.write( PopoutWindow.template );
	this.popoutWin.document.close();
*/	
	// and finally, mark us as being a popout for events, etc
	this.isPopout = true;
    },
    
    popin: function() {
	var popoutDoc = this.popoutWin.document;
         
        var mainComponent = this;

	// create a new, empty body node in the place of the old. remove the old.
	// TODO investigate if we even need to remove the old one, or if applyToMarkup
	//      finds any differences.
	var newNode = this.oldBody.dom.cloneNode( false );
	// FIXME IE(7) has trouble with 'No such interface supported'
	newNode = this.oldBody.dom.parentNode.insertBefore( newNode, this.oldBody.dom );
	this.oldBody.dom.parentNode.removeChild( this.oldBody.dom );

	// set the body tothe new location and render
        mainComponent.body = Ext.get(newNode);
        mainComponent.applyToMarkup( mainComponent.getEl() );
        
        // TODO set position/size (within bounds of document)
        //      could actually be the job of listeners.
        
        // show the window again
        this.show();
        
        // we're no longer intersted in acting like a popout.
        this.isPopout = false;
        
	// close the external popup 
	// note: onPopoutClosed doesn't affect anything, since it ignores us while not a popout.
        this.popoutWin.close();
        this.popoutWin = null;
    },
    
    onPopoutOpened: function() {
	var popoutDoc = this.popoutWin.document;
	
	this.popoutWin.document.title = this.title;
	
	// TODO copy css
         
        var mainComponent = this;
   
   	// keep a reference to the old body for if/when we popin
        this.oldBody = mainComponent.body;
        
        // set the body to the document body of the new window and 
        // render it.
        // TODO make space for toolbars/buttons/etc on the document, and set BG color.
        mainComponent.body = Ext.get(popoutDoc.body);
        mainComponent.applyToMarkup( mainComponent.getEl() );
        
        // hide the embedded window.
        this.hide();
    },
    
    onPopoutClosed: function() {
    	if( !this.isPopout ) { return; }
    	
    	if( this.popinOnClose ) {
    	    this.popin();
        } else {
        	// TODO look into closeAction for hide/destroy stuff.
        	this.close();
        }
    },
    
    onTitleChange: function( panel, newTitle ) {
    	if( !this.isPopout ) { return; }
    	
    	this.popoutWin.document.title = newTitle;	
    }
}

Ext.extend( PopoutWindow, Ext.Window, PopoutWindow.prototype );
