/**
 * GUI Manager base for providing a common way for events.
 * 
 * The gui manager will notify the layout  
 */
function GuiManager() {
}

/**
 * Default GUI manager.
 */
GuiManager.Default = function(soashableClient) {
	this._LOGIN_DIALOG = "login-dlg";
	this._ROSTER_DIALOG = "rosterDialog";
	this._CHAT_DIALOG = function(chat) { return "chatDialog-"+chat.thread+"-"+chat.getParticipant().toString(); };
	
	this._soashableClient = soashableClient;
	
	this._registerHandlers();
}

GuiManager.Default.logger = Xmpp4Js.creatLogger( "guimanager.default" );
    
GuiManager.Default.prototype.getLoginDialog = function() {
	return Ext.DialogManager.get( this._LOGIN_DIALOG );
}

GuiManager.Default.prototype.getRosterDialog = function() {
	return Ext.DialogManager.get( this._ROSTER_DIALOG );
}

GuiManager.Default.prototype._registerHandlers = function() {
	this._soashableClient.on("loginCompleted", this.loginCompleted, this);
	this._soashableClient.on("messageReceived", this.messageReceived, this);
	this._soashableClient.on("rosterUpdated", this.rosterUpdated, this);
	this._soashableClient._jabberConnection.getChatManager().on("chatStarted", this.chatStarted, this);
}

GuiManager.Default.prototype.loginCompleted = function() {
	this._loadRosterDialog();
}

GuiManager.Default.prototype.chatStarted = function(chat) {
	chat.on( "messageReceived", this.messageReceived, this );

}

/**
 * @param {Xmpp4Js.Packet.Message} messagePacket The message packet
 * @param {Xmpp4Js.Chat.Chat} chat The chat
 */
GuiManager.Default.prototype.messageReceived = function(chat, collector) {
	var chatDlg = this.getOrCreateChatDialog( chat );
	chatDlg.show();
}

GuiManager.Default.prototype.getOrCreateChatDialog = function(chat) {

 	var winId = this._CHAT_DIALOG(chat);
 	var win = Ext.DialogManager.get( winId );

	if( win == undefined ) {
		win = new Soashable.Dialog.ChatDialog.Default(chat, winId);
	}
	
	return win;


}

GuiManager.Default.prototype.rosterUpdated = function(addedEntries, updatedEntries, deletedEntries) {
;;;  GuiManager.Default.logger.log("Roster updated.  Added: " + addedEntries + ", Updated: " + updatedEntries + ", Deleted: " + deletedEntries);
}

/**
 * When the window has loaded.
 */
GuiManager.Default.prototype.onLoad = function() {
	// Depending on the type of gui manager we want to load a login window
	// or what...

}

/**
 * When the unload has been received.
 */
GuiManager.Default.prototype.onUnload = function() {
	// @todo Shutdown any specific gui and gray out?
}

GuiManager.Default.prototype._loadLoginDialog = function() {
	// @todo should be redone to classify scope of gui manager?
 	var win = Ext.DialogManager.get( this._LOGIN_DIALOG );

	if( win == undefined ) {
		win = new Soashable.Dialog.LoginDialog(this._LOGIN_DIALOG);
	}
	
	return win;
}

GuiManager.Default.prototype._loadRosterDialog = function() {
 	var win = Ext.DialogManager.get( this._ROSTER_DIALOG );

	if( win == undefined ) {
		win = new Soashable.Dialog.RosterDialog.Default(this, this._ROSTER_DIALOG);
	}
	
	return win;
}

GuiManager.Default.prototype.getSoashableClient = function() {
 	return this._soashableClient;
}

