var buildParamStr = function(data, method) {
	var paramStr = "";

	var first = true;
	for (var key in data) {
		var value = data[key];
		if (first) {
			if (method == "GET") {
				paramStr += "?";
			}
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

var buildURL = function(url, method, data) {
	return url + (method == "GET" ? buildParamStr(data, method) : "");
};

export default {
	request: function(method, url, data, callback, options) {
		var paramStr = buildParamStr(data, method);
		var request = new XMLHttpRequest();	

		request.open(method, buildURL(url, method, data), true);

		request.onload = function() {
			callback((request.responseText == "" ? null : JSON.parse(request.responseText)), request);
		};
		request.onerror = function() {
			callback(null, request);
		};

		if (method == "POST") {
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		}
		if (options) {
			if (options.cors) {
				request.withCredentials = true;
			}
			if (options.headers) {
				for (var headerName in options.headers) {
					var headerValue = options.headers[headerName];
					request.setRequestHeader(headerName, headerValue);
				}
			}
		}

		request.send((method == "POST" ? paramStr : undefined));
	}
};