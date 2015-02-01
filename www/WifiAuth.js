/**
 * WifiAuth contains information required to authenticate to a Wifi network.
 * Currently, the supported algorithms are WPA and none. For a simple network
 * that only requires a PSK, the config parameter can simply be a password (WPA
 * requires that password is wrapped in double quotes). With more complex
 * network types, config can be an object specifying other parameters.
 *
 * @param {string}  algorithm       string value of algorithm
 * @param {string|object} config    PSK or configuration options
 */
function WifiAuth(algorithm, config) {
    var _algorithm = "";
    var _config = {};

    var self = this;
    
    var ALGS = {
        NONE: "NONE",
        WPA: "WPA"
    };

    this.algorithm = function(algorithm) {
        if (algorithm === undefined) {
            return self._algorithm;
        }

        algorithm = algorithm.toUpperCase();

        switch (algorithm) {
            case "WPA":
                self._algorithm = algorithm;
            break;
            case "NONE":
                self._algorithm = algorithm;
            break;
            default:
                throw new Error("Unsupported authentication algorithm.");
            break;
        }

        return this;
    };

    this.config = function(config) {
        switch(self._algorithm) {
            case "WPA":
                return configWPA(config);
            break;
        }
    };
    
    function configWPA(config) {
        self._config.psk = config
        return this;
    }

    this.toArray = function() {
        var result = [];
        result.push(self._algorithm);
        
        switch (self._algorithm) {
            case ALGS.WPA:
                result.push(self._config.psk);
            break;
            case ALGS.NONE:
            break;
            default:
                throw new Error("Unsupported Algorithm");
            break;
        }
    };
}

module.exports = WifiAuth;
