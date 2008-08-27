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


Ext.namespace( "Soashable.Dialog.RegistrationDialog" );

/**
 * Initialize RosterWindow and add onRosterUpdate as a listener to roster, and
 * reload roster to get all updates.
 *
 * @param roster Roster the roster to bind to
 */
Soashable.Dialog.RegistrationDialog.Default = function( config ) {

    this.formId = Ext.id();
    this.usernameId = Ext.id();
    this.passwordId = Ext.id();
    
    this.con = config.con;
    this.lang = config.lang;


    var superConfig = Ext.apply( config, {
        width:300,
        height:150,
        title: this.lang.registerTitle,
        renderTo: document.body,

        layout: "fit",
        items: [{
            id: this.formId,
            xtype: "form",
            
            onSubmit: Ext.emptyFn,
            submit: Ext.emptyFn,
            
            defaultType: 'textfield',
            defaults: {
                    // applied to each contained item
                    width: 130,
                    msgTarget: 'side'
            },
            items: [
            {
                    fieldLabel: this.lang.username,
                    name: 'username',
                    allowBlank: false,

                    id: this.usernameId
            },{
                    fieldLabel: this.lang.password,
                    name: 'password',
                    allowBlank: false,
                    inputType: "password",

                    id: this.passwordId
            }/*,{
                    fieldLabel: 'Email',
                    name: 'email',
                    allowBlank: true
            },{
                    fieldLabel: 'Name',
                    name: 'name',
                    allowBlank: true
            }*/
                /*new DataFormView({
                    dataForm: this.dataForm, 
                    formId: "register", 
                    template: this.template/*,
                    listeners: {
                        scope: this,
                        submit : this._onSubmit,
                        cancel : this._onCancel   
                    }
                })*/

            ]
        }],
        buttons: [
        {
            text: this.lang.cancelButton,
            scope: this,
            handler: this.onCancel
        },
        {
            text: this.lang.registerButton,
            scope: this,
            handler: this.onRegister
        }
        ]
    });

    Soashable.Dialog.RegistrationDialog.Default.superclass.constructor.call(this, superConfig);
    
    this.addEvents({
        regerror: true,
        regsuccess: true
    });
}

Ext.extend(Soashable.Dialog.RegistrationDialog.Default, Ext.Window, {
    /**
     * This logic should maybe go somewhere else, but it works. It should
     * also use the DataForm if available.
     * @private
     */
    onRegister: function() {
        var formVals = Ext.ComponentMgr.get( this.formId ).getForm().getValues();

        var regFlow = new Xmpp4Js.Workflow.Registration({
        	con: this.con,
        	//toJid: this.con.jid /* TODO make getJid() */,
        	listeners: {
        		scope: this,
        		success: this.onSuccess,
        		failure: this.onFailure
        	}
       	});
       	
       	regFlow.start( formVals );
    },
    
    /**
     * @private
     */
    onSuccess: function(responseIq) {
    	this.fireEvent( "regsuccess", responseIq );
    },
    
    /**
     * @private
     */
    onFailure: function(responseIq) {
    	this.fireEvent( "regerror", responseIq );
    },
    
    /**
     * @private
     */
    onCancel: function() {
        this.hide();
    }
});

