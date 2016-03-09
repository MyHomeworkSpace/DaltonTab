window.mhs = {
	basePath: "https://planhub.me/api/v1/"
};

window.mhs.getNonce = function(callback) {
	$.get(window.mhs.basePath + "csrf", function(data) {
		callback(data.nonce);
	});
};

window.mhs.get = function(url, callback) {
	window.mhs.getNonce(function(nonce) {
		$.get(window.mhs.basePath + url, { nonce: nonce }, function(data) {
			if (typeof data == "string") {
				callback({ status: "error", message: "Not signed in!" });
				return;
			}
			callback(data);
		});
	});
};

window.mhs.post = function(url, data, callback) {
	window.mhs.getNonce(function(nonce) {
		data["nonce"] = nonce;
		$.post(window.mhs.basePath + url, function(data) {
			callback(data);
		});
	});
};
