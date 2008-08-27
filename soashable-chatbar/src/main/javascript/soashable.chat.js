jQuery.fn.chat = function() {
    var op, options;
                
    if(arguments.length == 1 && typeof arguments[0] == "object") {
        op = "create";
        options = arguments[0] || {};
    } else {
        options = arguments[1] || {};
    }

    var person = options.person || "Unnamed"
                
    if( op == "create" ) {
        return this.each(function() {
            $(this).html("<b>Hey, "+person+"</b> sup?").append("<span>x</span>").click(options.onclose);
        });
    }
}



function ChatModel() {
    this.messages = [];
    this.localParticipant = "";
    this.remoteParticipant = "";
    
    this.addEvents({
        messageAdded: true
    });
}

ChatModel.prototype = {
    getRemoteParticipant: function() {
        return this.remoteParticipant;
    },
    getLocalParticipant: function() {
        return this.localParticipant;
    },
    getMessages: function() {
        return this.messages;
    },
    addMessage: function(message) {
        this.messages.push(message);
        
        this.fireEvent( "messageAdded", message );
    }
}

Xmpp4Js.Lang.extend( ChatModel, Xmpp4Js.Event.EventProvider, ChatModel.prototype );


function ChatController(application, remoteParticipant) {
    this.application = application;
    this.remoteParticipant = remoteParticipant;
    
    var chatModel = this.chatModel = new ChatModel();
    chatModel.remoteParticipant = remoteParticipant;
    
    var chatView = this.chatView = new ChatView( application, chatModel );
    
    chatModel.on("messageAdded", function(message) {
        chatView.appendMessage( message.getFrom(), message.getBody() );
    }, this );

    chatView.create();
}

function ChatView(application, chatModel) {
    this.application = application;
    this.chatModel = chatModel;
    
    this.id = "chat-"+parseInt( Math.random() * 1000 );
    this.title = this.chatModel.getRemoteParticipant();

    ChatView.superclass.constructor.call(this, this.application.tabStrip, this.id, this.title);
}

ChatView.prototype = {
    create: function() {

        
        // create a reference to the new content element
        ChatView.superclass.create.call(this);

        // make the content element a chat area and setup handlers
        this.contentEl.chat({
            person: this.title, 
            onclose: function() {
                this.destroy();
            }.bind(this)
        });
    },
    
    appendMessage: function(from, message) {
        this.contentEl.append("<div><b>"+from+":</b> "+message+"</div>");
    }
    
}

Xmpp4Js.Lang.extend( ChatView, AbstractTabView, ChatView.prototype );


