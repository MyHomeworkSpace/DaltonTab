import { h, render } from "preact";

import App from "App.jsx";

window.onload = function() {
	render(h(App, {}), document.querySelector("body"));
};