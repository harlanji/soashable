// Default soashable client to perform operations
var soashableClient = new SoashableClient.Default();

// Default gui manager to perform operations
var guiManager = new GuiManager.Default(soashableClient);

var soashable = new Soashable(soashableClient, guiManager);

// Start soashable
soashable.start();

// @todo need to move function to a more appropriate place
function register_transport() {
	var sdm = sc.con.getServiceDisco();
	var gatewayJid = "aim.im.cosmacs.org";
	
	var aimScreenName = "";
	var aimPassword = "";
	
	
	//TransportHelper.discoverGateways( sdm, function( jid, ident ) {
	//	if( ident.type == "aim" ) {
	//		alert( "Found AIM on " + jid );
			TransportHelper.registerForAim( sc.con, gatewayJid, aimScreenName, aimPassword );
	//	}
	//} );
}
