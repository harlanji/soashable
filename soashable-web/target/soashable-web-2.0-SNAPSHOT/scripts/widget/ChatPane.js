dojo.provide("soashable.widget.ChatPane");

dojo.require("dojox.layout.ContentPane");
dojo.require("dijit._Templated");

dojo.declare(
// widget name and class
"soashable.widget.ChatPane",
// superclass
[dojox.layout.ContentPane, dijit._Templated],
{
    title: "OMG Title 2",
    templatePath: dojo.moduleUrl("soashable.widget", "template/ChatPane-template.html"),

    buildRendering: function() {
        this.inherited(arguments);
    },
    
    postCreate: function() {
        
        this.inherited(arguments);
    },
    
    
    keyUpped: function(e) {
        if(e.keyCode == dojo.keys.ENTER) {
            // clear the value before appending because there is a weird delay otherwise
            var messageText = this.messageTextNode.value;
            this.messageTextNode.value = "";
            this.messageHistoryNode.innerHTML += "<div class=\"message\">"+messageText+"</div>";
            
            dojo.stopEvent(e);
        }
    }
}
);