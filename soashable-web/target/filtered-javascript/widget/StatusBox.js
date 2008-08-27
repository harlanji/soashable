dojo.provide("soashable.widget.StatusBox");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");


dojo.declare(
// widget name and class
"soashable.widget.StatusBox",
// superclass
[dijit._Widget, dijit._Templated],
{
    status: "normal",
    message: "",
    templatePath: dojo.moduleUrl("soashable.widget", "template/StatusBox-template.html"),
    templateCssPath: dojo.moduleUrl("soashable.widget", "template/StatusBox-style.css"),
    isContainer: false,
    snarfChildDomOutput: false,
    
    
    setStatus: function(status) {
        // summary: sets the "strength" percentage, and updates the display acordingly
        this.status = status;
			
        for( var i = 0; i < this.status.options.length; i++ ) {
            if( this.status.options[i].value == this.status ) {
                this.status.selectedIndex = i;
                break;
            }
        }
    },
    setMessage: function(message) {
        this.message.innerHTML = message;
    },
    
    messageBlurred: function() {
        alert("message blurred");
    },
    
    statusBlurred: function() {
        alert("status blurred");
    }
}
);