dojo.provide("soashable.widget.DemoWindow");

dojo.require("dojox.layout.ContentPane");
dojo.require("dijit._Templated");
dojo.require("dojo.dnd.Moveable");

dojo.declare(
// widget name and class
"soashable.widget.DemoWindow",
// superclass
[dojox.layout.ContentPane, dijit._Templated],
{
    title: "OMG Title 2",
    templatePath: dojo.moduleUrl("soashable.widget", "template/DemoWindow-template.html"),
    
    show: function() {
        this.windowNode.style.visibility = 'visible';
    },
    
    hide: function() {
        this.windowNode.style.visibility = 'hidden';
    },
    
    postCreate: function() {
        
        this.inherited(arguments);
        
        this.moveableNode = new dojo.dnd.Moveable(this.domNode, {handle: this.titleBarNode} );
    },
    
    minClicked: function() {
        
    },
    
    closeClicked: function() {
        
    }
}
);