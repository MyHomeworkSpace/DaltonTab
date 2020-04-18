import ajax from "ajax.js";

var analytics = {
	collectPingPayload: function(callback) {
		chrome.storage.sync.get([ "sections", "mhsToken" ], function(storage) {
			callback({
				prod: (chrome.runtime.id == "ggfjkmflbbjndabmnngilkfpmdegbfkm"),
				sections: (storage.sections || "default"),
				mhsLoggedIn: (storage.mhsToken ? true : false)
			});
		});
	},

	getClientID: function(callback) {
		chrome.storage.sync.get("clientID", function(result) {
			if (result.clientID) {
				callback(result.clientID);
			} else {
				var generatedID = analytics.randomString(36);
				chrome.storage.sync.set({ clientID: generatedID }, function() {
					callback(generatedID);
				});
			}
		});
	},
	hashCode: function(str) {
		var hash = 0;
		if (str.length == 0) return hash;
		for (var i = 0; i < str.length; i++) {
			var char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	},
	randomString: function(len, charSet) {
		charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var randomString = "";
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz,randomPoz+1);
		}
		return randomString;
	},

	ping: function(messageCallback) {
		analytics.getClientID(function(clientID) {
			analytics.collectPingPayload(function(pingPayload) {
				chrome.storage.sync.get("pingPayloadHash", function(storage) {
					var pingPayloadStr = JSON.stringify(pingPayload);
					var pingPayloadHash = analytics.hashCode(pingPayloadStr);
					var lastPingPayloadHash = storage.pingPayloadHash;
					var shouldUpdatePingPayload = (!storage.pingPayloadHash || (pingPayloadHash != lastPingPayloadHash));

					ajax.request("POST", "https://daltontabservices.myhomework.space/v1/analytics/ping", {
						clientID: clientID,
						extensionVersion: chrome.runtime.getManifest().version,
						browserType: (navigator.userAgent.indexOf("Chrome") > -1 ? "Chrome" : "Firefox"),
						browserVersion: navigator.userAgent.split("/")[3].replace(" Safari", "")
					}, function(data) {
						if (shouldUpdatePingPayload) {
							ajax.request("POST", "https://daltontabservices.myhomework.space/v1/analytics/updatePayload", {
								clientID: clientID,
								payload: pingPayloadStr
							}, function(data) {
								chrome.storage.sync.set({ pingPayloadHash: pingPayloadHash }, function() {});
							});
						}
						if (data.isMessage) {
							messageCallback(data.message);
						} else {
							messageCallback(undefined);
						}
					});
				});
			});
		});
	},

	dismissMessage: function(clientID, campaign, callback) {
		ajax.request("POST", "https://daltontabservices.myhomework.space/v1/analytics/dismiss", {
			clientID: clientID,
			campaign: campaign
		}, function(data) {
			callback();
		});
	}
};

export default analytics;