import { h, render, Component } from "preact";
import moment from "moment";

import analytics from "analytics.js";
import image from "image.js";
import sections from "sections.js";

import FeedbackControls from "feedback/FeedbackControls.jsx";

import EndOfYearModal from "other/EndOfYearModal.jsx";
import MHSConnect from "other/MHSConnect.jsx";

import SectionContainer from "sections/SectionContainer.jsx";

import AccountPane from "settings/AccountPane.jsx";
import SettingCheckbox from "settings/SettingCheckbox.jsx";

import IconButton from "ui/IconButton.jsx";
import ModalManager from "ui/ModalManager.jsx";

import App from "App.jsx";

window.onload = function() {
	if (window.location.href.indexOf("index.html") > -1) {
		render(h(App, {}), document.querySelector("body"));
	}
};

var modalName = "";
var modalState;

window.preact = {
	Component: Component,
	h: h,
	render: render
};
window.moment = moment;

var renderModalManager = function() {
	render(h(ModalManager, {
		modalName: modalName,
		modalState: modalState,
		openModal: openModal
	}), null, document.querySelector("#modalManager > div"));
};

var openModal = function(name, state) {
	if (document.querySelector(".modal") && document.querySelector(".modal").classList.contains("reloadSectionsOnClose")) {
		DaltonTab.SectionHandler.createSections();
	}

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
	image: image,
	sections: sections,

	IconButton: IconButton,
	SectionContainer: SectionContainer,

	init: function() {
		renderModalManager();
	},

	openModal: openModal,

	feedback: {
		FeedbackControls: FeedbackControls
	},
	other: {
		EndOfYearModal: EndOfYearModal,
		MHSConnect: MHSConnect
	},
	settings: {
		AccountPane: AccountPane,
		SettingCheckbox: SettingCheckbox
	},

	h: h,
	render: render
};