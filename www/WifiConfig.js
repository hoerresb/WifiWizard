/**
 *  WifiConfig constructor. The WifiConfig object is used by WifiWizard
 *  to connect and disconnect networks.
 *
 *  @param  {string}    ssid    The SSID of the network to configure
 *  @param  {WifiAuth}  auth    WifiAuth object to authenticate to the Wifi
 */
function WifiConfig(ssid, auth) {
    var _ssid = null;
    var _auth = null;
    var self = this;

    var WifiAuth = require('WifiAuth');

    /**
     *  Either returns the SSID of the WifiConfig object if the paramater is
     *  undefined. If the parameter is defined, it checks to see if it is a
     *  valid SSID. If so, it updates the SSID. Otherwise, it throws an error.
     *
     *  @param  {string}    ssid    String to set SSID
     *  @return this
     */
    this.ssid = function(ssid) {
        if (ssid === undefined) {
            return self._ssid;
        }

        if( ssidIsValid(ssid) ) {
            self._ssid = wrapInQuotes(ssid);
        }
        else {
            throw new Error("SSID Invalid");
        }

        return this;
    };

    /**
     *  Can be used to get a copy of the authentication object or set the
     *  authentication object if a parameter is passed. Verifies the type of 
     *  the auth object, and if invalid, will throw an error.
     *
     *  @param  {WifiAuth}  auth    
     *  @return this
     */
    this.auth = function(auth) {
        if (auth === undefined) {
            return self._auth; // TODO: Clone object instead of returning reference
        }
        else if (auth instanceof WifiAuth) {
            self._auth = auth;
        }
        else {
            throw new Error("Auth must be object of type WifiAuth");
        }

        return this;
    };

    /**
     *  Converts the WifiConfig object into an array suitable for passing into
     *  the cordova.exec method.
     */
    this.toArray = function() {
        return [self._ssid].concat(self._auth.toArray());
    };

    /**
     *  This method ensures that a string is wrapped in double quotes. This is
     *  required for SSID and WPA PSK.
     *
     *  @param  {string}    string  variable to wrap
     *  @return {string}    string wrapped in quotes
     */
    function wrapInQuotes(string) {
        if (string === undefined || string === null) {
            string = "";
        }
        string = string.trim();

        if (string.charAt(0) != '"' ) {
            string = '"' + string;
        }

        if (string.charAt(string.length-1) != '"' ) {
            string = string + '"';
        }

        return string;
    }

    function ssidIsValid(ssid) {
        return (typeof ssid === "string" || ssid instanceof String) && ssid.length <= 32;
    }

    // Initialize object
    this.ssid(ssid).auth(auth);
}

module.exports = WifiConfig;
