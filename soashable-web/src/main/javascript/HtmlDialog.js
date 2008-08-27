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


var HtmlDialog = function(id, config) {

    config = Ext.applyIf( config, { 
        autoCreate: true,
        center: {}
    });

    HtmlDialog.superclass.constructor.call(this, id, config);
    
    
    this.addEvents({
        /**
         * Fires when the content is ready
         * @event contentready
         * @param dialog {PissingMeOffDialog}
         */
        contentready : true
    });
    
    if( config.callback instanceof Function ) {
        this.on( "contentready", config.callback );
    }

    var content = new Ext.ContentPanel( {
        autoCreate: true
    });
    
    var layout = this.getLayout();
    layout.beginUpdate();
    layout.add( "center",  content );
    layout.endUpdate();
    
    content.load({
        url: config.template,
        loadOnce: true,
        scope: this,
        callback: function() {
            this.fireEvent( "contentready", this );
        }
    });

}

Ext.extend(HtmlDialog, Ext.LayoutDialog, {

});