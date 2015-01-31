function WifiAuth() {
    var _algorithm;
    var _psk;

    var self = this;
    
    var ALGS = {
        NONE:   'none',
        WPA:    'wpa'
    };

    this.algorithm = function(algorithm) {
        if (algorithm === undefined) {
            return self._algorithm;
        }

        // todo: validate algorithm, set if ok
    };

    this.toArray = function() {
        var result = [];
        result.push(self._algorithm);
        
        switch (self._algorithm) {
            case ALGS.WPA:
                result.push(self._psk);
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
