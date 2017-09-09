DaltonTab.Analytics = {
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
				var generatedID = DaltonTab.Analytics.randomString(36);
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
			char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	},
	randomString: function(len, charSet) {
		charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz,randomPoz+1);
		}
		return randomString;
	},

	ping: function(messageCallback) {
		DaltonTab.Analytics.getClientID(function(clientID) {
			DaltonTab.Analytics.collectPingPayload(function(pingPayload) {
				chrome.storage.sync.get("pingPayloadHash", function(storage) {
					var pingPayloadStr = JSON.stringify(pingPayload);
					var pingPayloadHash = DaltonTab.Analytics.hashCode(pingPayloadStr);
					var lastPingPayloadHash = storage.pingPayloadHash;
					var shouldUpdatePingPayload = (!storage.pingPayloadHash || (pingPayloadHash != lastPingPayloadHash));

					$.post("https://daltontabservices.myhomework.space/v1/analytics/ping.php", {
						clientID: clientID,
						extensionVersion: chrome.runtime.getManifest().version,
						browserVersion: navigator.appVersion.split("/")[2].replace(" Safari", "")
					}, function(data) {
						if (shouldUpdatePingPayload) {
							$.post("https://daltontabservices.myhomework.space/v1/analytics/updatePayload.php", {
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
	}
};