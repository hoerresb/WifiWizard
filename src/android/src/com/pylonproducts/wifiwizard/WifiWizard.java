package com.pylonproducts.wifiwizard;

import org.apache.cordova.*;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.net.wifi.WifiManager;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiEnterpriseConfig;
import android.content.Context;
import android.util.Log;


public class WifiWizard extends CordovaPlugin {

	private static final String ADD_NETWORK = "addNetwork";
	private static final String REMOVE_NETWORK = "removeNetwork";
	private static final String CONNECT_NETWORK = "connectNetwork";
	private static final String DISCONNECT_NETWORK = "disconnectNetwork";
	private static final String LIST_NETWORKS = "listNetworks"; 
	
	private static final String TAG = "WifiWizard";
	
	private WifiManager wifiManager;
	private CallbackContext callbackContext;
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		this.wifiManager = (WifiManager) cordova.getActivity().getSystemService(Context.WIFI_SERVICE);
	}
	
	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext)
							throws JSONException {
		
		this.callbackContext = callbackContext;
		
		if (!wifiManager.isWifiEnabled()) {
			callbackContext.error("Wifi is not enabled.");
			return false;
		}
		
		if (action.equals(ADD_NETWORK)) {
			return this.addNetwork(callbackContext, data);
		}
	
		else if (action.equals(REMOVE_NETWORK)) {
			return this.removeNetwork(callbackContext, data);
		}
	
		else if (action.equals(CONNECT_NETWORK)) {
			return this.connectNetwork(callbackContext, data);
		}

		else if (action.equals(DISCONNECT_NETWORK)) {
			return this.disconnectNetwork(callbackContext, data);
		}
		
		else if (action.equals(LIST_NETWORKS)) {
			return this.listNetworks(callbackContext);
		}
		
		callbackContext.error("Incorrect action parameter: " + action);
		
		return false;	
	}
	
	/**
	 * This methods adds a network to the list of available WiFi networks.
	 * If the network already exists, then it updates it.
	 * 
	 * @params callbackContext 	A Cordova callback context.
	 * @params data				JSON Array with [0] == SSID, [1] == password
	 * @return true	if add successful, false if add fails
	 */
	private boolean addNetwork(CallbackContext callbackContext, JSONArray data) {
		// Initialize the WifiConfiguration object
		WifiConfiguration wifi = new WifiConfiguration();
		
		Log.d(TAG, "WifiWizard: addNetwork entered.");
		
		try {
			// data's order for ANY object is 0: ssid, 1: authentication algorithm, 
			// 2+: authentication information.
			String authType = data.getString(1);
			
						
			if (authType.equals("WPA")) {
				// WPA Data format:
				// 0: ssid
				// 1: auth
				// 2: password
				String newSSID = data.getString(0);
				wifi.SSID = newSSID;
				String newPass = data.getString(2); 	
				wifi.preSharedKey = newPass;
				
				wifi.status = WifiConfiguration.Status.ENABLED;        
				wifi.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
				wifi.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
				wifi.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
				wifi.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
				wifi.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
				wifi.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
				
				wifi.networkId = ssidToNetworkId(newSSID);
				
				if ( wifi.networkId == -1 ) {
					wifiManager.addNetwork(wifi);
					callbackContext.success(newSSID + " successfully added.");
				}
				else {
					wifiManager.updateNetwork(wifi);
					callbackContext.success(newSSID + " successfully updated.");
				}
				
				wifiManager.saveConfiguration();
				return true;
			}
			else if (authType.equals("WEP")) {
				// TODO: connect/configure for WEP
				Log.d(TAG, "WEP unsupported.");
				callbackContext.error("WEP unsupported");
				return false;
			}
			// TODO: Add more authentications as necessary
			else {
				Log.d(TAG, "Wifi Authentication Type Not Supported.");
				callbackContext.error("Wifi Authentication Type Not Supported: " + authType);
				return false;
			}
		}
		catch (Exception e) {
			callbackContext.error(e.getMessage());
			Log.d(TAG,e.getMessage());
			return false;
		}
	}
	
	/**
	 *	This method removes a network from the list of configured networks.
	 * 
	 *	@param	callbackContext		A Cordova callback context
	 *	@param	data				JSON Array, with [0] being SSID to remove
	 *	@return	true if network removed, false if failed
	 */
	private boolean removeNetwork(CallbackContext callbackContext, JSONArray data) {
		Log.d(TAG, "WifiWizard: removeNetwork entered.");
		
		if(!validateData(data)) {
			callbackContext.error("WifiWizard: removeNetwork data invalid");
			Log.d(TAG, "WifiWizard: removeNetwork data invalid");
			return false;
		}
		
		// TODO: Verify the type of data!
		try {
			String ssidToDisconnect = data.getString(0);

			int networkIdToRemove = ssidToNetworkId(ssidToDisconnect);
			
			if (networkIdToRemove >= 0) {
				wifiManager.removeNetwork(networkIdToRemove);
				wifiManager.saveConfiguration();
				callbackContext.success("Network removed.");
				return true;
			}
			else {
				callbackContext.error("Network not found.");
				Log.d(TAG, "WifiWizard: Network not found, can't remove.");
				return false;
			}
		}
		catch (Exception e) {
			callbackContext.error(e.getMessage());
			Log.d(TAG, e.getMessage());
			return false;
		}
	}
	
	/**
	 *	This method connects a network.
	 *
	 *	@param	callbackContext		A Cordova callback context
	 *	@param	data				JSON Array, with [0] being SSID to connect
	 *	@return	true if network connected, false if failed
	 */
	private boolean connectNetwork(CallbackContext callbackContext, JSONArray data) {
		Log.d(TAG, "WifiWizard: connectNetwork entered.");
		if(!validateData(data)) {
			callbackContext.error("WifiWizard: connectNetwork invalid data");
			Log.d(TAG, "WifiWizard: connectNetwork invalid data.");
			return false;
		}
		String ssidToConnect = "";

		try {
			ssidToConnect = data.getString(0);
		}
		catch (Exception e) {
			callbackContext.error(e.getMessage());
			Log.d(TAG, e.getMessage());
			return false;
		}
		
		int networkIdToConnect = ssidToNetworkId(ssidToConnect);
		
		if (networkIdToConnect > 0) {
			wifiManager.enableNetwork(networkIdToConnect, true);
			callbackContext.success("Network " + ssidToConnect + " connected!");
			return true;
		}
		else {
			callbackContext.error("Network " + ssidToConnect + " not found!");
			Log.d(TAG, "WifiWizard: Network not found to connect.");
			return false;
		}
	}
	
	/**
	 *	This method disconnects a network.
	 *
	 *	@param	callbackContext		A Cordova callback context
	 *	@param	data				JSON Array, with [0] being SSID to connect
	 *	@return	true if network disconnected, false if failed
	 */
	private boolean disconnectNetwork(CallbackContext callbackContext, JSONArray data) {
	Log.d(TAG, "WifiWizard: disconnectNetwork entered.");
		if(!validateData(data)) {
			callbackContext.error("WifiWizard: disconnectNetwork invalid data");
			Log.d(TAG, "WifiWizard: disconnectNetwork invalid data");
			return false;
		}
		String ssidToDisconnect = "";
		// TODO: Verify type of data here!
		try {
			ssidToDisconnect = data.getString(0);
		}
		catch (Exception e) {
			callbackContext.error(e.getMessage());
			Log.d(TAG, e.getMessage());
			return false;
		}
		
		int networkIdToDisconnect = ssidToNetworkId(ssidToDisconnect);
		
		if (networkIdToDisconnect > 0) {
			wifiManager.disableNetwork(networkIdToDisconnect);
			callbackContext.success("Network " + ssidToDisconnect + " disconnected!");
			return true;
		}
		else {
			callbackContext.error("Network " + ssidToDisconnect + " not found!");
			Log.d(TAG, "WifiWizard: Network not found to disconnect.");
			return false;
		}
	}
	
	/**
	 *	This method uses the callbackContext.success method to send a JSONArray
	 *	of the currently configured networks.
	 *
	 *	@param	callbackContext		A Cordova callback context
	 *	@param	data				JSON Array, with [0] being SSID to connect
	 *	@return	true if network disconnected, false if failed
	 */
	private boolean listNetworks(CallbackContext callbackContext) {
		Log.d(TAG, "WifiWizard: listNetworks entered.");
		List<WifiConfiguration> wifiList = wifiManager.getConfiguredNetworks();
		
		JSONArray returnList = new JSONArray();
		
		for (WifiConfiguration wifi : wifiList) {
			returnList.put(wifi.SSID);
		}
		
		callbackContext.success(returnList);
		return true;
	}
	
	/**
	 *	This method takes a given String, searches the current list of configured WiFi
	 * 	networks, and returns the networkId for the network if the SSID matches. If not,
	 * 	it returns -1.
	 */
	private int ssidToNetworkId(String ssid) {
		List<WifiConfiguration> currentNetworks = wifiManager.getConfiguredNetworks();
		int networkId = -1;
		
		// For each network in the list, compare the SSID with the given one
		for (WifiConfiguration test : currentNetworks) {
			if ( test.SSID.equals(ssid) ) {
				networkId = test.networkId;
			}
		}
		
		return networkId;
	}
	
	private boolean validateData(JSONArray data) {
		try {
			if (data == null || data.get(0) == null) {
				callbackContext.error("Data is null.");
				return false;
			}
			return true;
		}
		catch (Exception e) {
			callbackContext.error(e.getMessage());
		}
		return false;
	}
}
