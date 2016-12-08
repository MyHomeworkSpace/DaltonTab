/*
Lots of this code from https://github.com/diafygi/webrtc-ips, under the MIT License

The MIT License (MIT)

Copyright (c) 2015 Daniel Roesler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
DaltonTab.LocalIP = {
	getLocalIP: function(callback) {
		var RTCPeerConnection = window.RTCPeerConnection
                    || window.mozRTCPeerConnection
                    || window.webkitRTCPeerConnection;
		var pc = new RTCPeerConnection({
			iceServers: [
				{urls: "stun:stun.services.mozilla.com"}
			]
		}, {
            optional: [
				{RtpDataChannels: true}
			]
        });
		pc.onicecandidate = function(ice) {};
		pc.createDataChannel("");
        pc.createOffer(function(result){
            pc.setLocalDescription(result, function(){}, function(){});
        }, function(){});
		setTimeout(function(){
	        var lines = pc.localDescription.sdp.split('\n');
	        for (var lineIndex in lines) {
				var line = lines[lineIndex];
	            if (line.indexOf('a=candidate:') === 0) {
	                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
	                var ip_addr = ip_regex.exec(line)[1];
					console.log("Found candidate IP: " + ip_addr);
					if (ip_addr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
						callback(ip_addr);
						return false;
					}
				}
	        }
	    }, 2000);
	}
};
