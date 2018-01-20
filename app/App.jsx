import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "fonts/weather.styl";

import "App.styl";

import { h, Component } from "preact";

import image from "image.js";
import mhs from "mhs.js";
import sections from "sections.js";

import FeedbackControls from "feedback/FeedbackControls.jsx";

import Clock from "main/Clock.jsx";
import ImageInfoBar from "main/ImageInfoBar.jsx";

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
		chrome.storage.sync.get(["sections", "mhsToken", "clockType", "displayDate", "backImgTog"], function(tabStorage) {
			var order = tabStorage.sections || sections.defaultOrder;

			// get section storage keys
			var storageKeys = [];
			order.forEach(function(sectionName) {
				var section = sections[sectionName];
				storageKeys = storageKeys.concat(section.storage);
			});
			chrome.storage.sync.get(storageKeys, function(sectionStorage) {
				sectionStorage.mhsToken = tabStorage.mhsToken;
				var imageEnabled = true;
				if (tabStorage.backImgTog) {
					imageEnabled = false;
				}
				that.setState({
					loaded: true,

					imageEnabled: imageEnabled,
					imageLoading: imageEnabled,

					order: order,
					tabStorage: tabStorage,
					sectionStorage: sectionStorage
				}, function() {
					if (imageEnabled) {
						that.loadImage.call(that);
					}
				});
			});
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
		}, function() {
			// get image
			var channel = localStorage.nc || "normal";
			if (channel != "normal") {
				console.log("Using image channel '" + channel + "'");
			}
			image.fetchImage(channel, function(imageData) {
				that.setState({
					imageLoading: false,
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
				newOrder.forEach(function(sectionName) {
					keysToFetch = keysToFetch.concat(sections[sectionName].storage);
				});
			}
		}
		this.setState({
			tabStorage: storage
		}, function() {
			chrome.storage.sync.set(newStorage, function() {
				if (keysToFetch.length > 0) {
					chrome.storage.sync.get(keysToFetch, function(storageUpdates) {
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

	render(props, state) {
		if (!state.loaded) {
			return <div></div>;
		}

		return <div class={`app ${state.scrolled ? "scrolled" : ""} ${state.settingsOpen ? "settingsOpen" : ""}`} style={`background-image: url(${state.imageData ? state.imageData.imgUrl : ""})`}>
			<ModalManager modalName={state.modalName} modalState={state.modalState} openModal={this.openModal.bind(this)} />
			{state.settingsOpen && <SettingsPane tabStorage={state.tabStorage} toggleSettings={this.toggleSettings.bind(this)} updateStorage={this.updateStorage.bind(this)} />}

			{state.settingsOpen && <div class="settingsOverlay" onClick={this.toggleSettings.bind(this)}></div>}

			<IconButton class="settingsButton" icon="fa-gear" onClick={this.toggleSettings.bind(this)} />
			{(state.tabStorage.jumpingArrowTog || state.tabStorage.jumpingArrowTog === undefined) &&
				<IconButton class="sectionButton" icon="fa-arrow-circle-o-down" href={state.scrolled ? "#top" : "#sectionContainer"} scroll />
			}
			<div id="top" class="top">
				<div class="topCenter">
					<Clock type={state.tabStorage.clockType} showDate={state.tabStorage.displayDate} />
				</div>
				{state.imageEnabled && <ImageInfoBar scrolled={state.scrolled} loading={state.imageLoading} image={state.imageData} />}
			</div>
			<SectionContainer sections={state.order} storage={state.sectionStorage} openModal={this.openModal.bind(this)} />
			<div class="feedbackRow">
				<FeedbackControls openModal={this.openModal.bind(this)} />
			</div>
		</div>;
	}
};