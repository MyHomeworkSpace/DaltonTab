export function getBrowser() {
	if (navigator.userAgent.indexOf("Edg") > -1) {
		return "Edge";
	} else if (navigator.userAgent.indexOf("Firefox") > -1) {
		return "Firefox";
	} else if (navigator.userAgent.indexOf("Safari") > -1) {
		return "Safari";
	}
	return "Chrome";
}