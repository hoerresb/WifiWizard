function WifiAuth() {
    var _algorithm;
    var _psk;

    var self = this;
    
    var ALGS = {
        NONE:   'NONE',
        WPA:    'WPA'
    };

    this.algorithm = function(algorithm) {
        if (algorithm === undefined) {
            return self._algorithm;
        }

        algorithm = algorithm.toUpperCase();
        for (alg in ALGS) {
            if (ALGS[alg] === algorithm) {
                self._algorithm = algorithm;
            }
        }

        throw new Error("Unsupported algorithm");
        // TODO: validate algorithm, set if ok
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
