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

function RosterRenderer() {

}

RosterRenderer.render = function( roster, element ) {

  var html = '<ul>';

  var groups = $H(roster.getGroups()).values();
  
  groups.push( roster.getUnfiledEntries() );

  for( var i = 0; i < groups.length; i++ ) {
    var group = groups[ i ];
    html += '<li class="group">' + group.name + '<ul>';
    var entries = group.getEntries();

    for( var j = 0; j < entries.length; j++ ) {
      var entry = entries[j];

      html += '<li class="entry">' + entry.jid + '(' +roster.getPresence( entry.jid ).presence +')<br/>';
      html += '</li>';
    }
    html += '</ul></li>';
  }
  html += '</ul>';


  $(element).update( html );
}
