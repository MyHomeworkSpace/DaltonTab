import { h, render } from "preact";

import analytics from "analytics.js";

import MHSConnect from "other/MHSConnect.jsx";

import App from "App.jsx";

// window.onload = function() {
// 	render(h(App, {}), document.querySelector("body"));
// };

export default {
	analytics: analytics,
	other: {
		MHSConnect: MHSConnect
	},

	h: h,
	render: render
};