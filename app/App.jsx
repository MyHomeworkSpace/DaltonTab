/* eslint no-console: "off" */

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "fonts/lato/lato.styl";
import "fonts/weather.styl";

import "App.styl";

import { h, Component } from "preact";

import analytics from "analytics.js";
import image from "image.js";
import mhs from "mhs.js";
import sections from "sections.js";

import FeedbackControls from "feedback/FeedbackControls.jsx";

import Clock from "main/Clock.jsx";
import ImageInfoBar from "main/ImageInfoBar.jsx";
import InfoMessage from "main/InfoMessage.jsx";

import SectionContainer from "sections/SectionContainer.jsx";

import SettingsPane from "settings/SettingsPane.jsx";

import IconButton from "ui/IconButton.jsx";
import ModalManager from "ui/ModalManager.jsx";

export default class App extends Component {
	componentWillMount() {
		var that = this;

		// add scroll listener
		this._scrollListener = this.onScroll.bind(this);
		window.addEventListener("scroll", this._scrollListener);
		this.onScroll();

		// get tab storage
		chrome.storage.sync.get(["sections", "mhsToken", "clockType", "displayDate", "backImgTog", "jumpingArrowTog", "progressBar", "showPercent", "dayStartTime", "dayEndTime"], function (tabStorage) {
			var sectionOrder = tabStorage.sections || sections.defaultOrder;

			// get section storage keys
			var storageKeys = [];
			sectionOrder.forEach(function (sectionName) {
				var section = sections[sectionName];
				storageKeys = storageKeys.concat(section.storage);
			});
			chrome.storage.sync.get(storageKeys, function (sectionStorage) {
				sectionStorage.mhsToken = tabStorage.mhsToken;
				var imageEnabled = true;
				if (tabStorage.backImgTog) {
					imageEnabled = false;
				}
				that.setState({
					loaded: true,

					imageEnabled: imageEnabled,
					imageLoading: imageEnabled,
					imageFailed: false,

					sections: sectionOrder,
					tabStorage: tabStorage,
					sectionStorage: sectionStorage
				}, function () {
					if (imageEnabled) {
						that.loadImage.call(that);
					}
				});
			});
		});

		// analytics
		analytics.ping(function (message) {
			if (message) {
				// there is a message
				chrome.storage.sync.get("dismissedMessages", function (storage) {
					var dismissedMessages = storage.dismissedMessages || [];
					if (!message.campaign || dismissedMessages.indexOf(message.campaign) == -1) {
						// should show the message
						that.setState({
							message: message
						});
					} else {
						console.log("Message with campaign " + message.campaign + " ignored because user dismissed it.");
					}
				});
			}
		});
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this._scrollListener);
	}

	onScroll(e) {
		var scrolled = (window.scrollY > 0);
		if (scrolled !== this.state.scrolled) {
			this.setState({
				scrolled: scrolled
			});
		}
	}

	loadImage() {
		var that = this;
		this.setState({
			imageLoading: true,
			imageFailed: false
		}, function () {
			// get image
			var channel = localStorage.nc || "normal";
			if (channel != "normal") {
				console.log("Using image channel '" + channel + "'");
			}
			image.fetchImage(channel, function (success, imageData) {
				if (imageData.beaconUrl) {
					// unsplash requires us to report image views
					// this is normally done just by hotlinking the image; however, we can't do that because of permissions
					// so, this uses the special magic unsplash partner api to call their view beacon thing
					// except we can't directly call that either, so this function call proxies that request through a daltontab server
					image.trackView(imageData);
				}

				// update state
				that.setState({
					imageLoading: false,
					imageFailed: !success,
					imageData: imageData
				});
			});
		});
	}

	openModal(modalName, modalState) {
		this.setState({
			modalName: modalName,
			modalState: modalState
		});
	}

	toggleSettings() {
		this.setState({
			settingsOpen: !this.state.settingsOpen
		});
	}

	updateStorage(newStorage) {
		var that = this;
		var keysToFetch = [];
		var storage = this.state.tabStorage;
		for (var key in newStorage) {
			storage[key] = newStorage[key];
			if (key == "sections") {
				// we've updated the section order, make sure to fetch keys related to those sections
				var newOrder = newStorage.sections;
				newOrder.forEach(function (sectionName) {
					keysToFetch = keysToFetch.concat(sections[sectionName].storage);
				});
			}
		}
		this.setState({
			tabStorage: storage
		}, function () {
			chrome.storage.sync.set(newStorage, function () {
				if (keysToFetch.length > 0) {
					chrome.storage.sync.get(keysToFetch, function (storageUpdates) {
						var storage = that.state.tabStorage;
						for (var key in storageUpdates) {
							storage[key] = storageUpdates[key];
						}
						that.setState({
							tabStorage: storage
						});
					});
				}
			});
		});
	}

	dismissMessage() {
		var that = this;
		var message = this.state.message;
		chrome.storage.sync.get("dismissedMessages", function (storage) {
			var dismissedMessages = storage.dismissedMessages || [];
			dismissedMessages.push(message.campaign);
			analytics.getClientID(function (clientID) {
				chrome.storage.sync.set({ dismissedMessages: dismissedMessages }, function () {
					that.setState({
						message: null
					});
					analytics.dismissMessage(clientID, message.campaign, function () {

					});
				});
			});
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <div></div>;
		}
		return <div class={`app ${state.scrolled ? "scrolled" : ""} ${state.settingsOpen ? "settingsOpen" : ""}`} style={`background-image: url(${state.imageData ? state.imageData.imgUrl : ""})`}>
			<ModalManager modalName={state.modalName} modalState={state.modalState} dismissMessage={this.dismissMessage.bind(this)} openModal={this.openModal.bind(this)} />
			{state.settingsOpen && <SettingsPane tabStorage={state.tabStorage} toggleSettings={this.toggleSettings.bind(this)} updateStorage={this.updateStorage.bind(this)} />}

			{state.settingsOpen && <div class="settingsOverlay" onClick={this.toggleSettings.bind(this)}></div>}

			<IconButton class="settingsButton" icon="fa-gear" onClick={this.toggleSettings.bind(this)} />
			{(state.tabStorage.jumpingArrowTog || state.tabStorage.jumpingArrowTog === undefined) &&
				<IconButton class="sectionButton" icon="fa-arrow-circle-o-down" href={state.scrolled ? "#top" : "#sectionContainer"} scroll />
			}
			<div id="top" class="top">
				<div class="topCenter">
					<Clock type={state.tabStorage.clockType || "12hr"} progressBar={state.tabStorage.progressBar} showPercent={state.tabStorage.showPercent} showDate={(state.tabStorage.displayDate !== undefined ? state.tabStorage.displayDate : true)} dayStart={state.tabStorage.dayStartTime} dayEnd={state.tabStorage.dayEndTime} />
					{state.message && <InfoMessage message={state.message} image={state.imageData} dismissMessage={this.dismissMessage.bind(this)} openModal={this.openModal.bind(this)} />}
				</div>
				{state.imageEnabled && <ImageInfoBar scrolled={state.scrolled} loading={state.imageLoading} error={state.imageFailed} image={state.imageData} />}
			</div>
			<SectionContainer sections={state.sections} storage={state.sectionStorage} openModal={this.openModal.bind(this)} />
			<div class="feedbackRow">
				<FeedbackControls openModal={this.openModal.bind(this)} />
			</div>
		</div>;
	}
};