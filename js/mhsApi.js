window.mhs = {
	basePath: "https://api-v2.myhomework.space/",
	nonce: ""
};

window.mhs.init = function(callback, failCallback) {
	window.mhs.getNonce(function(nonce) {
		window.mhs.nonce = nonce;
		callback();
	}, failCallback);
}

window.mhs.getNonce = function(callback, failCallback) {
	$.get(window.mhs.basePath + "auth/csrf", function(data) {
		$.get(window.mhs.basePath + "auth/csrf", function(data) {
			callback(data.token);
		}).fail(failCallback);
	}).fail(failCallback);
};

window.mhs.get = function(url, callback) {
	var callbackFunc = function(data) {
		if (data.responseJSON) {
			callback(data.responseJSON);
			return;
		}
		callback(data);
	};
	$.get(window.mhs.basePath + url + "?csrfToken=" + window.mhs.nonce, callbackFunc).fail(callbackFunc);
};

window.mhs.post = function(url, data, callback) {
	$.post(window.mhs.basePath + url + "?csrfToken=" + window.mhs.nonce, function(data) {
		callback(data);
	});
};
