import { h, render } from "preact";

import analytics from "analytics.js";

import App from "App.jsx";

// window.onload = function() {
// 	render(h(App, {}), document.querySelector("body"));
// };

export default {
	analytics: analytics,

	h: h,
	render: render
};