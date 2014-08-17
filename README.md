WifiWizard
===

Version 0.0.1

This Phonegap plugin enables WiFi management from within Phonegap.

### Usage from within Cordova:

* `WifiWizard.addNetwork(SSID, password, win, fail);` adds the network to the list of available networks that the user can log into. `win` and `fail` are callback functions to be executed based on the result of the call.
* `WifiWizard.removeNetwork(SSID, win, fail);` removes the network with the given SSID. As above, `win` and `fail` are callback functions.
* `WifiWizard.connectNetwork(SSID, win, fail);` connects the phone to the given Wifi network. It'll return an error if the SSID isn't available or can't be connected.
* `WifiWizard.disconnectNetwork(SSID, win, fail);` disconnects the phone to the given Wifi network. 
* `WifiWizard.listNetworks(win, fail);` returns a list of the available networks.
