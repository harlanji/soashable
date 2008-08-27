

function $ns( packageName ) {
	var elems = packageName.split( "\." );
	
	var testName = "";	
	var p = undefined;
	for( var i = 0; i < elems.length; i++ ) {
		testName += elems[i];
	
		var exists = false;
		try {
			p = eval( testName );
			exists = p !== undefined;
		} catch(e){}

		if( !exists ) {
			p = eval( testName + " = function() {}" );
		}
		
		testName += ".";
	}
	
	return p;
}

function $require( clazz ) {
	var exists = false;
	try {
		p = eval( clazz );
		exists = p !== undefined;
	} catch(e){}
	
	if( !exists ) {
		var path = clazz.replace( /\./g, "/" ) + ".js";
		
		var script = document.createElement( "script" );
		script.setAttribute( "src", "javascripts/" + path );
		script.setAttribute( "type" ,"text/javascript" );
		
		document.getElementsByTagName("head")[0].appendChild( script );
	}
}