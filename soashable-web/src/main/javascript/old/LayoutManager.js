// Copyright (C) 2007  Harlan Iverson <h.iverson at gmail.com>
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

function LayoutManager( to ) {

  var self = this;

  this.to = to;
  this.windows = {};
  this.windowObserver = {
    // onDestroy onStartResize onStartMove onResize onMove onEndResize onEndMove onFocus onBlur onBeforeShow onShow onHide onMinimize onMaximize onClose
    onClose : function(evt, win) {
      self.windows[ win.getId() ] = undefined;
    }
  }

  Windows.addObserver( this.windowObserver );
}

LayoutManager.prototype.showLoginForm = function(visible) {

  var winId = 'login';
  var win = this.windows[winId];

  if( win == undefined ) {
    win = new Window({id: winId, className: "alphacube", title: "Login", width:450, height:225, destroyOnClose: true, recenterAuto:true, minimizable: false, maximizable: false, closable: false, resizable: false, draggable: false});
    //win.getContent().update("<h1>Hello world !!</h1>");
    //win.setHTMLContent( $("login_pane").innerHTML );
    win.setAjaxContent( "views/login.html", {method: 'get'} );

    this.windows[winId] = win;
  }

  if( visible ) {
    //win.show();
    win.showCenter();
  } else {
    win.destroy();
  }

}

// TODO handle thread
// TODO handle typing notification
LayoutManager.prototype.showIM = function(visible, from, body) {

  var fromJid = new Xmpp4Js.Jid( from ).removeResource();

  var winId = 'im.' + fromJid.toString();

  var win = this.windows[winId];

  if( win == undefined ) {
    win = new Window({id: winId, className: "alphacube", title: "IM from "+from, width:350, height:400, destroyOnClose: true, recenterAuto:false});
    //win.setHTMLContent( $("im_pane").innerHTML );
    win.setAjaxContent( "views/im.html", {method: "get", asynchronous: false} );
    win.refresh();
    this.windows[winId] = win;


    win.remoteJid = fromJid;
  }
  
  if( visible ) {
    win.showCenter();
  } else {
    win.destroy();
  }

  var pane = win.getContent();

  var sendToElem = document.getElementsByClassName('sendTo', pane)[0];
  sendToElem.value = from;


  this.appendMessageToIM( win, fromJid.toString(), body );

}

LayoutManager.prototype.sentIM = function( to, body ) {
  var winId = 'im.' + new Xmpp4Js.Jid(to).removeResource();
  var win = this.windows[winId];

  this.appendMessageToIM( win, "You", body );
}

LayoutManager.prototype.appendMessageToIM = function( imWindow, from, body ) {
  var pane = imWindow.getContent();

  if( body != undefined ) {
	  var imPane = document.getElementsByClassName('iResp', pane)[0];


	  var html = '';
	  html += '<b>'+from+' said:</b><br/>';
	  html += body.escapeHTML() + '<hr noshade size="1"/>';
	  
	  //imPane.innerHTML += html;
	  new Insertion.Bottom( imPane, html );
  }

}

LayoutManager.prototype.showBuddyList = function( visible ) {

  //alert( "1" );
  var winId = 'buddylist';

  var win = this.windows[winId];

  if( win == undefined ) {
    win = new Window({id: winId, className: "alphacube", title: "Buddy List", width:200, height:300, destroyOnClose: true, recenterAuto:false});

    win.setAjaxContent( "views/buddylist.html", {method: 'get', asynchronous: false} );
	
    this.windows[winId] = win;
  }
  
  //alert( "2" );

  if( visible ) {
    win.showCenter();
  } else {
    win.destroy();
  }
  
  //alert( "3" );

}

LayoutManager.prototype.updateBuddyList = function( soashableClient ) {
  //alert( "updateBuddyList" );
  var pane = this.windows['buddylist'].getContent();
  var buddyListPane = document.getElementsByClassName( 'list', pane )[0];
  RosterRenderer.render( con.getRoster(), buddyListPane );
}

LayoutManager.prototype.getWindowForElement = function( element ) {
 var windows = this.windows;
 for( var winId in windows ) {
   var win = windows[ winId ];
   if( $(element).descendantOf( win.getContent() ) ) {
     return win;
   }
 };

}

function normalizeJid( jid ) {
	return "jid@domain.com";
}

/**
 * Layouts paving the way for different layouts of different
 * types of layouts including a default, compact, and for different
 * environments.
 */
LayoutManager.Layout = function () {
}

LayoutManager.AbstractLayout = function() {
}

Ext.extend(Soashable.AbstractLayout, LayoutManager.Layout, {

});

LayoutManager.DefaultLayout = function() {
}

Ext.extend(Soashable.DefaultLayout, LayoutManager.Layout, {

});

LayoutManager.iPhoneLayout = function() {
}

Ext.extend(Soashable.iPhoneLayout, LayoutManager.Layout, {

});
