function TabStrip(el) {
    this.contentEl = $(el);
    this.idxMap = {};
    
    this.contentEl.tabs();
}

TabStrip.prototype = {
    addTab: function(id, title) {
        this.contentEl.tabs("add", "#"+id, title);
        
        var idx = this.contentEl.tabs("length") - 1;
        this.idxMap[id] = idx;
        
        return $("#"+id);
    },
    
    removeTab: function(id) {
        var idx = this.getIndex(id);
        this.contentEl.tabs("remove", idx);
        this.contentEl.tabs("select", -1);
        
        this.removeIndex( id );
    },
    
    removeIndex: function(id) {
        var idx = this.idxMap[id];
        delete this.idxMap[id];
        for( var k in this.idxMap ) {
            if( this.idxMap[k] > idx ) {
                this.idxMap[k]--;
            }
        }
    },
    
    getIndex: function(id) {
        //return this.contentEl.index("#"+id);
        return this.idxMap[id];
    }
}

function AbstractTabView(tabStrip, id, title) {
    this.tabStrip = tabStrip;
    this.contentEl = null;
    
    this.id = id;
    this.title = title;
}

AbstractTabView.prototype = {
    create: function() {
        this.contentEl = this.tabStrip.addTab( this.id, this.title );
    },
    destroy: function() {
        this.tabStrip.removeTab( this.id );
    }
}
    
Xmpp4Js.Lang.extend( AbstractTabView, Xmpp4Js.Event.EventProvider, AbstractTabView.prototype );