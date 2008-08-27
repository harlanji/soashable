/**
 * Original code taken from http://www.quirksmode.org/js/detect.html
 *
 * @author Matthew Purland
 */

/**
 * Detects browsers and provides methods to determine
 * what browser the client is running on.
 */
var BrowserDetect = function() {
	this.dataOS = [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	];
	
	this.dataBrowser = [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		// Match the iPhone before we match Safari
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Internet Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	];
	
	this._browser = "";
	this._version = "";
	this._OS = "";
}

/**
 * Lazy init for when we don't need to get the browser information.
 */
BrowserDetect.prototype._initBrowser = function () {
	if (this._browser == "") {
		this._browser = this._searchString(this.dataBrowser) || "An unknown browser";
	}
}
BrowserDetect.prototype._initVersion = function () {
	if (this._version == "") {
		this._version = this._searchVersion(navigator.userAgent)
			|| this._searchVersion(navigator.appVersion)
			|| "an unknown version";
	}
}
BrowserDetect.prototype._initOS = function () {
	if (this._OS == "") {
		this._OS = this._searchString(this.dataOS) || "an unknown OS";
	}
}

BrowserDetect.prototype._searchString = function (data) {
	for (var i=0;i<data.length;i++)	{
		var dataString = data[i].string;
		var dataProp = data[i].prop;
		this.versionSearchString = data[i].versionSearch || data[i].identity;
		if (dataString) {
			if (dataString.indexOf(data[i].subString) != -1)
				return data[i].identity;
		}
		else if (dataProp)
			return data[i].identity;
	}
}

BrowserDetect.prototype._searchVersion = function (dataString) {
	var index = dataString.indexOf(this.versionSearchString);
	if (index == -1) return;
	return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
}
	
BrowserDetect.prototype.isApplePhone = function() {
	return "iPhone" == this.getBrowser();
}

BrowserDetect.prototype.isFirefox = function() {
	return "Firefox" == this.getBrowser();
}

BrowserDetect.prototype.isInternetExplorer = function() {
	return "Internet Explorer" == this.getBrowser();
}

BrowserDetect.prototype.getBrowser = function() {
	this._initBrowser();
	return this._browser;
}

BrowserDetect.prototype.getOS = function() {
	this._initOS();
	return this._OS;
}

BrowserDetect.prototype.getVersion = function() {
	this._initVersion();
	return this._version;
}

// Create the browser detector and initialize it
var browserDetect = new BrowserDetect();