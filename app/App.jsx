import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import "fonts/weather.styl";

import "App.styl";

import { h, Component } from "preact";

import image from "image.js";
import mhs from "mhs.js";
import sections from "sections.js";

import Clock from "main/Clock.jsx";
import ImageInfoBar from "main/ImageInfoBar.jsx";

import SectionContainer from "sections/SectionContainer.jsx";

import SettingsPane from "settings/SettingsPane.jsx";

import IconButton from "ui/IconButton.jsx";
import ModalManager from "ui/ModalManager.jsx";

const defaultOrder = ["myhomeworkspace", "schedule", "classes"];

export default class App extends Component {
	componentWillMount() {
		var that = this;
		// get tab storage
		chrome.storage.sync.get(["sections", "mhsToken", "clockType", "displayDate"], function(tabStorage) {
			var order = tabStorage.sections || defaultOrder;

			// get section storage keys
			var storageKeys = [];
			order.forEach(function(sectionName) {
				var section = sections[sectionName];
				storageKeys = storageKeys.concat(section.storage);
			});
			chrome.storage.sync.get(storageKeys, function(sectionStorage) {
				sectionStorage.mhsToken = tabStorage.mhsToken;
				that.setState({
					loaded: true,

					imageLoading: true,

					order: order,
					tabStorage: tabStorage,
					sectionStorage: sectionStorage
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
		var storage = this.state.tabStorage;
		for (var key in newStorage) {
			storage[key] = newStorage[key];
		}
		this.setState({
			tabStorage: storage
		}, function() {
			chrome.storage.sync.set(newStorage, function() {
				
			});
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <div></div>;
		}

		return <div class="app" style={`background-image: url(${state.imageData ? state.imageData.imgUrl : ""})`}>
			<ModalManager modalName={state.modalName} modalState={state.modalState} openModal={this.openModal.bind(this)} />
			{state.settingsOpen && <SettingsPane tabStorage={state.tabStorage} toggleSettings={this.toggleSettings.bind(this)} updateStorage={this.updateStorage.bind(this)} />}

			<IconButton class="settingsButton" icon="fa-gear" onClick={this.toggleSettings.bind(this)} />
			<div class="top">
				<div class="topCenter">
					<Clock type={state.tabStorage.clockType} showDate={state.tabStorage.displayDate} />
				</div>
				<ImageInfoBar loading={state.imageLoading} image={state.imageData} />
			</div>
			<SectionContainer sections={state.order} storage={state.sectionStorage} openModal={this.openModal.bind(this)} />
		</div>;
	}
};