/*
 * This is the interface for the WifiWizard Phonegap plugin.
 */
 
var WifiWizard = {

	/**
	 * 	This method formats wifi information into an object for use with the
	 * 	addNetwork function.
	 *		@param SSID			the SSID of the network enclosed in double quotes
	 *		@param password		the password for the network enclosed in double quotes
	 * 	@param algorithm	the authentication algorithm
	 * 	@return	wifiConfig	a JSON object properly formatted for the plugin.
	 */
	formatWifiConfig: function(SSID, password, algorithm) {
		var wifiConfig = {
			'SSID': WifiWizard.formatWifiString(SSID),
			'Password': WifiWizard.formatWifiString(password),
			'AuthAlg': algorithm
		};
		return wifiConfig;
	},
	
	/**
	 *	This method formats a given SSID and ensures that it is appropriate.
	 *	If the SSID is not wrapped in double quotes, it wraps it in double quotes. 
	 *	@param	ssid	the SSID to format
	 */
	formatWifiString: function(ssid) {
		ssid = ssid.trim()
		
		if (ssid.charAt(0) != '"' ) {
			ssid = '"' + ssid;
		}
		
		if (ssid.charAt(ssid.length-1) != '"' ) {
			ssid = ssid + '"';
		}
		
		return ssid;
	},
	
	/** 
	 * This methods adds a network to the list of available networks.
	 * Currently, only WPA authentication method is supported.
	 * 
	 * @param 	wifi is JSON formatted information necessary for adding the Wifi
	 * 			network. Ex:
	 *				wifi = { 
	 * 					'SSID': '\'MyNetwork\'',
	 *					'Password': '\'suchsecretpasswordwow\'',
	 *					'AuthAlg': 'WPA'
	 *				}
	 * @param 	win is a callback function that gets called if the plugin is 
	 * 			successful.
	 * @param 	fail is a callback function that gets called if the plugin gets
	 * 			an error
	 * @return 	`this` so you can chain calls together.
	 */
	addNetwork: function(wifi, win, fail) {
		//console.log("WifiWizard add method entered.");
		if (wifi !== null && typeof wifi === 'object') {
			// Ok to proceed!
		}
		else {
			console.log('WifiWizard: Invalid parameter. wifi not an object.');
		}
		
		var networkInformation = [];
		
		if (wifi.SSID !== undefined && wifi.SSID !== '') {
			networkInformation.push(wifi.SSID);
		}
		else {
			// i dunno, like, reject the call or something? what are you even doing?
			console.log('WifiWizard: No SSID given.');
			return false;
		}
		
		if (wifi.Password !== undefined) {
			networkInformation.push(wifi.Password);
		}
		else {
			// Assume no password for open networks.
			networkInformation.push('');
			console.log('WifiWizard: No password given.');
		}
		
		if (wifi.AuthAlg !== undefined && wifi.AuthAlg !== '') {
			networkInformation.push(wifi.AuthAlg);
		}
		else {
			console.log('WifiWizard: No authentication algorithm given.');
			return false;
		}
		
		cordova.exec(win, fail, 'WifiWizard', 'addNetwork', networkInformation);
			
	},
	
	// Remove network
	removeNetwork: function(SSID, win, fail) {
		//console.log("WifiWizard remove method entered.");
		cordova.exec(win, fail, 'WifiWizard', 'removeNetwork', [WifiWizard.formatWifiString(SSID)]);
		
	},

	// Connect to Network
	connectNetwork: function(SSID, win, fail) {
		//console.log("WifiWizard connect method entered.");
		cordova.exec(win, fail, 'WifiWizard', 'connectNetwork', [WifiWizard.formatWifiString(SSID)]);
	},
	
	// Disconnect from network
	disconnectNetwork: function(SSID, win, fail) {
		//console.log("WifiWizard disconnect method entered.");
		cordova.exec(win, fail, 'WifiWizard', 'disconnectNetwork', [WifiWizard.formatWifiString(SSID)]);
		
	},
	
	/**
	 *	Hands the list of available networks to the `win` success callback function.
	 * @param 	win	callback function that receives list of networks
	 * @param 	fail	callback function if error
	 * @return		a list of networks
	 */
	listNetworks: function(win, fail) {
	//	console.log("WifiWizard list method entered.");
		if (typeof win != "function") {
			console.log("listNetworks first parameter must be a function to handle list.");
			return;
		}
		cordova.exec(win, fail, 'WifiWizard', 'listNetworks', []);
	}	
};

// module.exports = WifiWizard;
