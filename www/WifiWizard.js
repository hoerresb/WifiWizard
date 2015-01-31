var WifiWizard = (function() {
    var WifiConfig = require('WifiConfig');
    var WifiAuth = require('WifiAuth');

    this.addNetwork = function(wifi, win, fail) {
        if (wifi instanceof WifiConfig === false) {
            throw new Error("WifiConfig must be WifiConfig object");
        }

        var networkInformation = wifi.toArray();

        switch (wifi.auth().algorithm()) {
            case 'wpa':
                networkInformation.push('wpa');
                networkInformation.push(wifi.auth().psk());
            break;
            case 'none':
                networkInformation.push('none');
            break;
            case 'newly supported type':
                // push values in specific order, and implement new type in the java code.
                break;
            default:
                console.log("wifiwizard: authentication invalid.");
        }


        cordova.exec(win, fail, 'WifiWizard', 'addNetwork', networkInformation);
    };

    return {

        /**
         * 	this method formats wifi information into an object for use with the
         * 	addnetwork function. currently only supports
         *		@param ssid			the ssid of the network enclosed in double quotes
         *		@param password		the password for the network enclosed in double quotes
         * 	@param algorithm	the authentication algorithm
         * 	@return	wificonfig	a json object properly formatted for the plugin.
         */
        formatwificonfig: function(ssid, password, algorithm) {
            var wificonfig = {
                ssid: util.formatssid(ssid)
      };
            if (!algorithm && !password) {
                // open network
                wificonfig.auth = {
                    algorithm: 'none'
                };
            } else if (algorithm === 'wpa') {
                wificonfig.auth = {
                    algorithm: algorithm,
                    password : util.formatssid(password)
                    // other parameters can be added depending on algorithm.
                };
            }
            else if (algorithm === 'new network type') {
                wificonfig.auth = {
                    algorithm : algorithm
                    // etc...
                };
            }
            else {
                console.log("algorithm incorrect")
                return false;
            }
            return wificonfig;
        },

        /**
         *	this method is a helper method that returns a wifi object with wpa.
         */
        formatwpaconfig: function(ssid, password) {
            return wifiwizard.formatwificonfig(ssid, password, 'wpa');
        },


        /**
         * this methods adds a network to the list of available networks.
         * currently, only wpa authentication method is supported.
         *
         * @param 	wifi is json formatted information necessary for adding the wifi
         * 			network, as is done in formatwificonfig.
         * @param 	win is a callback function that gets called if the plugin is
         * 			successful.
         * @param 	fail is a callback function that gets called if the plugin gets
         * 			an error
         */

        /**
         *	This method removes a given network from the list of configured networks.
         *	@param	SSID	of the network to remove
         *	@param	win		function to handle successful callback
         *	@param	fail		function to handle error callback
         */
        removeNetwork: function(SSID, win, fail) {
            cordova.exec(win, fail, 'WifiWizard', 'removeNetwork', [util.formatSSID(SSID)]);
        },

        /**
         *	This method connects a network if it is configured.
         *	@param	SSID	the network to connect
         *	@param	win		function that is called if successful
         * @param	fail		function that is called to handle errors
         */
        connectNetwork: function(SSID, win, fail) {
            cordova.exec(win, fail, 'WifiWizard', 'connectNetwork', [util.formatSSID(SSID)]);
        },

        /**
         *	This method disconnects a network if it is configured.
         *	@param	SSID	the network to disconnect
         *	@param	win		function that is called if successful
         * @param	fail		function that is called to handle errors
         */
        disconnectNetwork: function(SSID, win, fail) {
            cordova.exec(win, fail, 'WifiWizard', 'disconnectNetwork', [util.formatSSID(SSID)]);

        },

        /**
         *	Hands the list of previously used and configured networks to the `win` success callback function.
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
        },

        /**
         *  Hands the list of scanned  networks to the `win` success callback function.
         * @param 	win	callback function that receives list of networks
         * @param 	fail	callback function if error
         * @return		a list of networks
         */
        getScanResults: function(win, fail) {
            if (typeof win != "function") {
                console.log("getScanResults first parameter must be a function to handle list.");
                return;
            }
            cordova.exec(win, fail, 'WifiWizard', 'getScanResults', []);
        },

        /**
         *  Start scanning wifi.
         * @param 	win	callback function
         * @param 	fail	callback function if error
         */
        startScan: function(win, fail) {
            if (typeof win != "function") {
                console.log("startScan first parameter must be a function to handle list.");
                return;
            }
            cordova.exec(win, fail, 'WifiWizard', 'startScan', []);
        },

        /**
         *  Disconnect current wifi.
         * @param 	win	callback function
         * @param 	fail	callback function if error
         */
        disconnect: function(win, fail) {
            if (typeof win != "function") {
                console.log("disconnect first parameter must be a function to handle list.");
                return;
            }
            cordova.exec(win, fail, 'WifiWizard', 'disconnect', []);
        },

        /**
         *  Gets the currently connected wifi SSID
         * @param 	win	callback function
         * @param 	fail	callback function if error
         */
        getCurrentSSID: function(win, fail) {
            if (typeof win != "function") {
                console.log("getCurrentSSID first parameter must be a function to handle SSID.");
                return;
            }
            cordova.exec(win, fail, 'WifiWizard', 'getConnectedSSID', []);
        },

        /**
         *  Gets 'true' or 'false' if WiFi is enabled or disabled
         * @param 	win	callback function
         * @param 	fail
         */
isWifiEnabled: function(win, fail) {
                   if (typeof win != "function") {
                       console.log("isWifiEnabled first parameter must be a function to handle wifi status.");
                       return;
                   }
                   cordova.exec(function(result) {
                           win(!!result);
                           }, fail, 'WifiWizard', 'isWifiEnabled', []
                           );
               },

        /**
         *  Gets '1' if WiFi is enabled
         * @param   enabled	callback function
         * @param 	win	callback function
         * @param 	fail	callback function if wifi is disabled
         */
        setWifiEnabled: function(enabled, win, fail) {
            if (typeof win != "function") {
                console.log("setWifiEnabled second parameter must be a function to handle enable result.");
                return;
            }
            cordova.exec(win, fail, 'WifiWizard', 'setWifiEnabled', [enabled]);
        }
    }
})();

module.exports = WifiWizard;
