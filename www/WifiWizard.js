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
			'SSID':SSID,
			'Password':password,
			'AuthAlg':algorithm
		};
		return wifiConfig;
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
		
		if (wifi !== null && typeof wifi === 'object') {
			// Ok to proceed!
		}
		else {
			console.log('WifiWizard: Invalid parameter. wifi not an object.');
		}
		
		var networkInformation = [];
		
		if (wifi.SSID !== undefined) {
			networkInformation.push(wifi.SSID);
		}
		else {
			// i dunno, like, reject the call or something? what are you even doing?
			console.log('WifiWizard: No SSID given.');
			return false;
		}
		
		if (wifi.password !== undefined) {
			networkInformation.push(wifi.password);
		}
		else {
			// Assume no password for open networks.
			networkInformation.push('');
			console.log('WifiWizard: No password given.');
		}
		
		if (wifi.AuthAlg !== undefined) {
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
		cordova.exec(win, fail, 'WifiWizard', 'removeNetwork', [SSID]);
		
	},

	// Connect to Network
	connectNetwork: function(SSID, win, fail) {
		cordova.exec(win, fail, 'WifiWizard', 'connectNetwork', [SSID]);
		
	},
	
	// Disconnect from network
	disconnectNetwork: function(SSID, win, fail) {
		cordova.exec(win, fail, 'WifiWizard', 'disconnectNetwork', [SSID]);
		
	},
	
	// List networks. Callback function win 
	listNetworks: function(win, fail) {
		return cordova.exec(win, fail, 'WifiWizard', 'listNetworks', []);
	}	
};

// module.exports = WifiWizard;
