import { h, render, Component } from "preact";

import analytics from "analytics.js";

import EndOfYearModal from "other/EndOfYearModal.jsx";
import MHSConnect from "other/MHSConnect.jsx";

import Calendar from "sections/calendar/Calendar.jsx";
import Classes from "sections/classes/Classes.jsx";
import Homework from "sections/homework/Homework.jsx";
import LunchMenu from "sections/lunchMenu/LunchMenu.jsx";
import TabCount from "sections/tabCount/TabCount.jsx";

import AccountPane from "settings/AccountPane.jsx";
import SettingCheckbox from "settings/SettingCheckbox.jsx";

import ModalManager from "ui/ModalManager.jsx";

import App from "App.jsx";

// window.onload = function() {
// 	render(h(App, {}), document.querySelector("body"));
// };

var modalName = "";
var modalState;

window.preact = {
	Component: Component,
	h: h,
	render: render
};

var renderModalManager = function() {
	render(h(ModalManager, {
		modalName: modalName,
		modalState: modalState,
		openModal: openModal
	}), null, document.querySelector("#modalManager > div"));
};

var openModal = function(name, state) {
	modalName = name;
	modalState = state;
	renderModalManager();
	if (modalName != "") {
		$("body").addClass("modal-open");
	} else {
		$("body").removeClass("modal-open");
	}
};

export default {
	analytics: analytics,

	init: function() {
		renderModalManager();
	},

	openModal: openModal,

	other: {
		EndOfYearModal: EndOfYearModal,
		MHSConnect: MHSConnect
	},
	sections: {
		Calendar: Calendar,
		Classes: Classes,
		Homework: Homework,
		LunchMenu: LunchMenu,
		TabCount: TabCount
	},
	settings: {
		AccountPane: AccountPane,
		SettingCheckbox: SettingCheckbox
	},

	h: h,
	render: render
};