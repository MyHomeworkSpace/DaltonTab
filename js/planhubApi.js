window.planhub = {
	basePath: "https://planhub.me/api/v1/"
};

window.planhub.getNonce = function(callback) {
	$.get(window.planhub.basePath + "csrf", function(data) {
		callback(data.nonce);
	});
};

window.planhub.get = function(url, callback) {
	window.planhub.getNonce(function(nonce) {
		$.get(window.planhub.basePath + url, { nonce: nonce }, function(data) {
			if (typeof data == "string") {
				callback({ status: "error", message: "Not signed in!" });
				return;
			}
			callback(data);
		});
	});
};

window.planhub.post = function(url, data, callback) {
	window.planhub.getNonce(function(nonce) {
		data["nonce"] = nonce;
		$.post(window.planhub.basePath + url, function(data) {
			callback(data);
		});
	});
};
