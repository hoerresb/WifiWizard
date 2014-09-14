/*
 * This is the interface for the WifiWizard Phonegap plugin.
 */
 
var WifiWizard = {

	/**
	 * 	This method formats wifi information into an object for use with the
	 * 	addNetwork function. Currently only supports 
	 *		@param SSID			the SSID of the network enclosed in double quotes
	 *		@param password		the password for the network enclosed in double quotes
	 * 	@param algorithm	the authentication algorithm
	 * 	@return	wifiConfig	a JSON object properly formatted for the plugin.
	 */
	formatWifiConfig: function(SSID, password, algorithm) {
		if (algorithm === 'WPA') {
			var wifiConfig = {
				'SSID': WifiWizard.formatWifiString(SSID),
				'auth' : {
					'algorithm' : algorithm,
					'password' : WifiWizard.formatWifiString(password)
					// Other parameters can be added depending on algorithm.
				}
			};
		}
		else if (algorithm === 'New network type') {
			var wifiConfig = {
				'SSID' : WifiWizard.formatWifiString(SSID),
				'auth' : {
					'algorithm' : algorithm,
					// Etc...
				}
			}
		}
		else {
			console.log("Algorithm incorrect")
			return false;
		}
		return wifiConfig;
	},
	
	/**
	 *	This method is a helper method that returns a wifi object with WPA.
	 */
	formatWPAConfig: function(SSID, password) {
		return formatWifiConfig(SSID, password, 'WPA');
	},
	
	/**
	 *	This method formats a given SSID and ensures that it is appropriate.
	 *	If the SSID is not wrapped in double quotes, it wraps it in double quotes. 
	 * Despite the name, this also needs to be done to WPA PSK.
	 *	@param	ssid	the SSID to format
	 */
	formatWifiString: function(ssid) {
		if (ssid === undefined || ssid === null) {
			ssid = "";
		}
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
	 * 			network, as is done in formatWifiConfig.
	 * @param 	win is a callback function that gets called if the plugin is 
	 * 			successful.
	 * @param 	fail is a callback function that gets called if the plugin gets
	 * 			an error
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
		
		if (typeof wifi.auth == 'object') {
			
			if (wifi.auth.algorithm === 'WPA') {
				networkInformation.push(wifi.auth.algorithm);
				networkInformation.push(wifi.auth.password);
			}
			else if (wifi.auth.algorithm === 'Newly supported type') {
				// Push values in specific order, and implement new type in the Java code.
			}
			else {
				console.log("WifiWizard: authentication invalid.");
			}
		}
		else {
			console.log('WifiWizard: No authentication algorithm given.');
			return false;
		}
		
		cordova.exec(win, fail, 'WifiWizard', 'addNetwork', networkInformation);	
	},
	
	/**
	 *	This method removes a given network from the list of configured networks.
	 *	@param	SSID	of the network to remove
	 *	@param	win		function to handle successful callback
	 *	@param	fail		function to handle error callback
	 */
	removeNetwork: function(SSID, win, fail) {
		cordova.exec(win, fail, 'WifiWizard', 'removeNetwork', [WifiWizard.formatWifiString(SSID)]);
		
	},

	/** 
	 *	This method connects a network if it is configured. 
	 *	@param	SSID	the network to connect
	 *	@param	win		function that is called if successful
	 * @param	fail		function that is called to handle errors
	 */
	connectNetwork: function(SSID, win, fail) {
		cordova.exec(win, fail, 'WifiWizard', 'connectNetwork', [WifiWizard.formatWifiString(SSID)]);
	},
	
	/** 
	 *	This method disconnects a network if it is configured. 
	 *	@param	SSID	the network to disconnect
	 *	@param	win		function that is called if successful
	 * @param	fail		function that is called to handle errors
	 */
	disconnectNetwork: function(SSID, win, fail) {
		cordova.exec(win, fail, 'WifiWizard', 'disconnectNetwork', [WifiWizard.formatWifiString(SSID)]);
		
	},
	
	/**
	 *	Hands the list of available networks to the `win` success callback function.
	 * @param 	win	callback function that receives list of networks
	 * @param 	fail	callback function if error
	 * @return		a list of networks
	 */
	listNetworks: function(win, fail) {
		if (typeof win != "function") {
			console.log("listNetworks first parameter must be a function to handle list.");
			return;
		}
		cordova.exec(win, fail, 'WifiWizard', 'listNetworks', []);
	}	
};

// module.exports = WifiWizard;
