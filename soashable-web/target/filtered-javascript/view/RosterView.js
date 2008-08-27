dojo.provide("soashable.view.RosterView");

dojo.require("soashable.Application");
dojo.require("soashable.model.RosterModel");

/**
 * Responsible for rendering a roster and its list
 */
dojo.declare("soashable.view.RosterView", Xmpp4Js.Event.EventProvider, {
    constructor: function(application, rosterModel) {
        this.application = application;
        this.rosterModel = rosterModel;
    },

    addContact: function(jid, alias, group) {
        jQuery(this.listEl).append("<li><a href=\"#"+jid+"\">"+alias+"</a></li>" );
    },
    
    render: function() {
        jQuery("<div id=\"roster\"><ul id=\"roster-list\"></ul>"
            + "<div id=\"roster-toolbar\">"
            + "<button id=\"roster-toolbar-im\">Send IM</button>"
            + "</div></div>").appendTo(jQuery("body"));
        
        this.mainEl = document.getElementById("roster");
        this.listEl = document.getElementById("roster-list");
        this.toolbarEl = document.getElementById("register-toolbar");
        this.imEl = document.getElementById("roster-toolbar-im");
        
        var self = this;
        this.imEl.addEventListener("click", function() { self.sendImClicked(); }, false);
    },
    destroy: function() {
        jQuery(this.mainEl).remove();
        this.mainEl = null;
    },
    
    sendImClicked: function() {
        alert( "Send IM" );
    }
});
