# WifiWizard

Version 0.2.8

This Phonegap plugin enables WiFi management from within Phonegap applications.

Only Android is in development at this time. iOS is planned to be developed, with other platforms following.

### Installation

Run `phonegap plugin install https://github.com/parsonsmatt/WifiWizard.git`

### Usage from within Cordova/Phonegap:

#### `WifiWizard.formatWifiConfig(SSID, password, algorithm);` 

Formats the wifi configuration information into a JSON for use with the addNetwork function. Currently, only WPA is supported for the `algorithm` value.

#### `WifiWizard.formatWPAConfig(SSID, password);` 

Is a helper method. It returns an object which can be used to add a WPA wifi network.

#### `WifiWizard.addNetwork(wifi, win, fail);` 

Adds the network to the list of available networks that the user can log into. `wifi` needs to be an object as formatted by formatWifiConfig. `win` and `fail` are callback functions to be executed based on the result of the call.

#### `WifiWizard.removeNetwork(SSID, win, fail);` 

Removes the network with the given SSID. As above, `win` and `fail` are callback functions.

#### `WifiWizard.connectNetwork(SSID, win, fail);` 

Connects the phone to the given Wifi network.

#### `WifiWizard.disconnectNetwork(SSID, win, fail);` 

Disconnects the phone to the given Wifi network.

#### `WifiWizard.listNetworks(listHandler, fail);` 

Retrieves a list of the configured networks as an array of strings and passes them to the function listHandler.

#### `WifiWizard.startScan(success, fail);` 

Start WiFi scanning. `success` is a function that is called when the scan is started. 

#### `WifiWizard.getScanResults(listHandler, fail);` 

Retrieves a list of the available networks as an array of objects and passes them to the function listHandler. The format of the array is:

    networks = [
        {   "level": signal_level, // can be from 0-5
            "SSID": ssid, // SSID as string, with escaped double quotes: "\"ssid name\""
            "BSSID": bssid // MAC address of WiFi router as string
        }
    ]

#### `WifiWizard.getConnectedSSID(ssidHandler, fail);` 

Retrieves the current SSID and passes it to ssidHandler.

#### `WifiWizard.isWifiEnabled(win, fail);` 

Retrieves the current wifi status and passes `true` or `false` to the handler.

#### `WifiWizard.setWifiEnabled(enabled, win, fail);` 

Set wifi status. `enabled` is a Boolean type, so to disable the Wifi, you'd execute `WifiWizard.setWifiEnabled(false);`

### Changelog:

#### v0.2.8

`getScanResults` now returns the BSSID along with the SSID and strength of the network.

#### v0.2.7

- Clobber WifiWizard.js automatically via Cordova plugin architecture

#### v0.2.6 

- Added `isWifiEnabled`, `setWifiEnabled`

#### v0.2.5 

- Fixes `getConnectedSSID` error handlers

#### v0.2.4 

- Added `getConnectedSSID` method

#### v0.2.3 

- Added `disconnect` that does disconnection on current WiFi

#### v0.2.2 

- Added `startScan` and `getScanResults`

#### v0.2.1 

- Fixed reference problem in `formatWPAConfig`

#### v0.2.0 

- Changed format of wifiConfiguration object to allow more extensibility.

#### v0.1.1 

- `addNetwork` will now update the network if the SSID already exists.

#### v0.1.0 

- All functions now work!

#### v0.0.3 

- Fixed errors in native implementation. Currently, Add and Remove networks aren't working, but others are working as expected.

#### v0.0.2 

- Changed plugin.xml and WifiWizard.js to attach WifiWizard directly to the HTML.

#### v0.0.1 

- Initial commit
