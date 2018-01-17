import { h, render, Component } from "preact";

import analytics from "analytics.js";

import EndOfYearModal from "other/EndOfYearModal.jsx";
import MHSConnect from "other/MHSConnect.jsx";

import Calendar from "sections/calendar/Calendar.jsx";
import Classes from "sections/classes/Classes.jsx";
import Homework from "sections/homework/Homework.jsx";
import LunchMenu from "sections/lunchMenu/LunchMenu.jsx";

import SettingCheckbox from "settings/SettingCheckbox.jsx";

import App from "App.jsx";

// window.onload = function() {
// 	render(h(App, {}), document.querySelector("body"));
// };

window.preact = {
	Component: Component,
	h: h,
	render: render
};

export default {
	analytics: analytics,
	other: {
		EndOfYearModal: EndOfYearModal,
		MHSConnect: MHSConnect
	},
	sections: {
		Calendar: Calendar,
		Classes: Classes,
		Homework: Homework,
		LunchMenu: LunchMenu
	},
	settings: {
		SettingCheckbox: SettingCheckbox
	},

	h: h,
	render: render
};