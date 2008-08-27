/**
 * Include using document.write, so only works while document is loading.
 */
function include(libraryName) {
	//document.write('<script type="text/javascript" src="'+libraryName+'"></script>');
	var script = document.createElement( "script" );
	script.setAttribute( "type", "text/javascript" );
	script.setAttribute( "src", libraryName );

	document.getElementsByTagName("head")[0].appendChild( script );
}


include("lib/extjs2.js");
include("lib/log4js.js");
include("lib/crypto.js");
include("lib/dom-all.js");
include("lib/xmpp4js.js");
include("../classes/soashable-ui.js");
