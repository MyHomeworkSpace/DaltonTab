import ajax from "ajax.js";

var basePath = "https://api-v2.myhomework.space/";
var clientID = "PA2QtTk14dimr5jY-W7BlNZKiGuL2HY-zrNQZ3vP16P2XasErsleyOXT";

var prefixes = [];
var fallback = {};

var request = function(method, token, url, data, callback) {
	ajax.request(method, basePath + url, data, function(data) {
		callback(data);
	}, {
		headers: {
			Authorization: "Bearer " + token
		}
	});
};

export default {
	getAuthURL: function() {
		return basePath + "application/requestAuth/" + clientID;
	},

	get: function(token, url, data, callback) {
		request("GET", token, url, data, callback);
	},

	post: function(token, url, data, callback) {
		request("POST", token, url, data, callback);
	},

	initPrefixes: function(token, callback) {
		if (prefixes.length == 0) {
			request("GET", token, "prefixes/getList", {}, function(data) {
				prefixes = data.prefixes;
				fallback = {
					background: data.fallbackBackground,
					color: data.fallbackColor
				};
				callback();
			});
		} else {
			callback();
		}
	},

	matchPrefix: function(prefix) {
		var chkPrefix = prefix.toLowerCase();
		for (var prefixIndex in prefixes) {
			for (var wordIndex in prefixes[prefixIndex].words) {
				if (prefixes[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
					return prefixes[prefixIndex];
				}
			}
		}
		return fallback;
	}
};