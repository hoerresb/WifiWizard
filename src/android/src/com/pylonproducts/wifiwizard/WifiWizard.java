package com.pylonproducts.wifiwizard;

import org.apache.cordova.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.net.wifi.WifiManager;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiEnterpriseConfig;
import android.content.Context;
import android.util.log;


public class WifiWizard extends CordovaPlugin {

	private static final String ADD_NETWORK = "addNetwork";
	private static final String REMOVE_NETWORK = "removeNetwork";
	private static final String CONNECT_NETWORK = "connectNetwork";
	private static final String DISCONNECT_NETWORK = "disconnectNetwork";
	private static final String LIST_NETWORKS = "listNetworks"; 
	
	private static final String TAG = "WifiWizard";
	
	private WifiManager wifiManager;
	private CallbackContext callbackContext;
	
	@override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		// initialize wifimanager
		this.wifiManager = (WifiManager) cordova.getActivity().getSystemService(Context.WIFI_SERVICE);
	}
	
	@override
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext)
							throws JSONException {
		
		this.callbackContext = callbackContext;
		
		if (action.equals(ADD_NETWORK)) {
			return this.addNetwork(callbackContext, data);
		}
	
		else if (action.equals(REMOVE_NETWORK)) {
			// TODO: Remove network
		}
	
		else if (action.equals(CONNECT_NETWORK)) {
			// TODO: Connect to network
		}

		else if (action.equals(DISCONNECT_NETOWRK)) {
			// TODO: Disconnect from network
		}
		
		else if (action.equals(LIST_NETWORKS)) {
			// TODO: Return list of networks
		}
		
		return false;	
	}
	
	// Them helper methods!
	
	/**
	 * This methods adds a network to the list of available WiFi networks.
	 * 
	 * @params callbackContext 	A Cordova callback context.
	 * @params data				JSON Array with [0] == SSID, [1] == password
	 * @return true	if add successful, false if add fails
	 */
	private boolean addNetwork(CallbackContext callbackContext, JSONArray data) {
		// Initialize the WifiConfiguration object
		WifiConfiguration wifi = new WifiConfiguration();
		String authType = data.getString(2);
		
		if (authType.equals("WPA")) {
			// TODO: connect/configure for WPA
		}
		else if (authType.equals("WEP")) {
			// TODO: connect/configure for WEP
		}
		// TODO: Add more authentications as necessary
		else {
			log.d(TAG, "Wifi Authentication Type Not Supported.");
		}
		
		// Currently, just assuming WPA. 
		wifi.SSID = data.getString(0);
		wifi.preSharedKey = data.getString(1);
		wifi.status = WifiConfiguration.Status.ENABLED;        
		wifi.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
		wifi.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
		wifi.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
		wifi.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
		wifi.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
		wifi.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
	
		wifiManager.addNetwork();
		wifiManager.saveConfiguration();
	}
	
	private 
}
