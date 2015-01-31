function WifiAuth() {
    var _algorithm;
    var _psk;

    var that = this;

    this.algorithm = function(algorithm) {
        if (algorithm === undefined) {
            return that._algorithm;
        }

        // todo: validate algorithm, set if ok
    };
}

module.exports = WifiAuth;
