import "settings/SettingsPane.styl";

import { h, Component } from "preact";

import AccountSettings from "settings/AccountSettings.jsx";
import LayoutSettings from "settings/LayoutSettings.jsx";
import SettingCheckbox from "settings/SettingCheckbox.jsx";
import SettingTimeInput from "settings/SettingTimeInput.jsx";
import sections from "sections.js";

export default class SettingsPane extends Component {
	constructor() {
		super();
		this.state = {
			exportReady: false,
			importCode: ""
		};
		this.generateExport();
	}

	generateExport() {
		chrome.storage.sync.get(null, (data) => {
			var unencodedString = JSON.stringify(data);
			this.setState({
				exportReady: true,
				exportCode: window.btoa(unencodedString)
			});
		});
	}

	setStorage(key, value) {
		var newStorage = {};
		newStorage[key] = value;
		this.props.updateStorage(newStorage);
		this.generateExport();
	}

	setDayStart(event) {
		this.setStorage.bind(this, "dayStartTime", event.target.value)();
		var dayEnd = event.target.value.split(":");
		var dayStart = this.props.tabStorage.dayStartTime.split(":");
		if (parseInt(dayStart[0]) > parseInt(dayEnd[0]) || (parseInt(dayStart[0]) == parseInt(dayEnd[0]) && parseInt(dayStart[1]) > parseInt(dayEnd[1]))) {
			this.setStorage.bind(this, "dayEndTime", event.target.value)();
		}
	}

	setDayEnd(event) {
		this.setStorage.bind(this, "dayEndTime", event.target.value)();
		var dayEnd = event.target.value.split(":");
		var dayStart = this.props.tabStorage.dayStartTime.split(":");
		if (parseInt(dayStart[0]) > parseInt(dayEnd[0]) || (parseInt(dayStart[0]) == parseInt(dayEnd[0]) && parseInt(dayStart[1]) > parseInt(dayEnd[1]))) {
			this.setStorage.bind(this, "dayStartTime", event.target.value)();
		}
	}

	addOnboarding() {
		var order = this.props.tabStorage.sections || sections.defaultOrder;
		if (order.includes("onboarding")) {
			alert("Onboarding section already added.");
		} else {
			order.unshift("onboarding");
			this.props.updateStorage({
				sections: order
			});
		}
	}

	resetSettings() {
		if (confirm("Are you sure you'd like to reset DaltonTab to it's default settings?")) {
			browser.storage.sync.clear(() => {
				location.reload();
			});
		}
	}

	updateImportCode(event) {
		this.setState({
			importCode: event.target.value
		});
	}

	importSettings() {
		let that = this;
		try {
			var importData = JSON.parse(window.atob(this.state.importCode));
			if (confirm("This will override your current settings and data. Are you sure you would like to proceed?")) {
				browser.storage.sync.clear(() => {
					that.props.updateStorage(importData);
					alert("Import successful.");
				});
			}
		} catch (err) {
			alert("The import code you provided is invalid.");
		}
	}

	smile() {
		document.body.style.fontFamily = "Comic Sans MS";
	}

	render(props, state) {
		return <div class="settingsPane">
			<div class="settingsPaneClose" onClick={props.toggleSettings}>
				<i class="fa fa-times" />
			</div>
			<h3 class="settingsPaneTitle">Settings</h3>

			<LayoutSettings storage={props.tabStorage} updateStorage={props.updateStorage} />

			<h4><i class="fa fa-fw fa-clock-o" /> Clock</h4>
			<label><input type="radio" name="clockType" onChange={this.setStorage.bind(this, "clockType", "12hr")} checked={props.tabStorage.clockType == "12hr" || !props.tabStorage.clockType} /> 12 hour</label>
			<label><input type="radio" name="clockType" onChange={this.setStorage.bind(this, "clockType", "12hrnopm")} checked={props.tabStorage.clockType == "12hrnopm"} /> 12 hour (without AM/PM)</label>
			<label><input type="radio" name="clockType" onChange={this.setStorage.bind(this, "clockType", "24hr")} checked={props.tabStorage.clockType == "24hr"} /> 24 hour</label>
			<label><input type="radio" name="clockType" onChange={this.setStorage.bind(this, "clockType", "percent")} checked={props.tabStorage.clockType == "percent"} /> Percentage clock</label>
			<SettingCheckbox
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show current date underneath time" storageKey="displayDate" defaultValue={true}
			/>
			<SettingCheckbox
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show a progress bar of your completion of the day" storageKey="progressBar" defaultValue={false}
			/>
			<SettingCheckbox
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show a percentage of your completion of the day" storageKey="showPercent" defaultValue={false}
			/>

			{/* Time inputs arent widely supported (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time#Browser_compatibility) */}
			{/* but they work in both Firefox and Chrome, which makes them okay to use in this extension. */}
			<SettingTimeInput
				storage={props.tabStorage} onChange={this.setDayStart.bind(this)}
				label="Day start time" storageKey="dayStartTime" defaultValue="08:10"
			/>
			<SettingTimeInput
				storage={props.tabStorage} onChange={this.setDayEnd.bind(this)}
				label="Day end time" storageKey="dayEndTime" defaultValue="15:15"
			/>

			<h4><i class="fa fa-fw fa-picture-o" /> Background</h4>
			<SettingCheckbox
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show DaltonTab image of the day" storageKey="backImgTog" defaultValue={false} inverted
			/>
			<SettingCheckbox
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show section arrow" storageKey="jumpingArrowTog" defaultValue={true}
			/>

			<h4><i class="fa fa-fw fa-link" /> MyHomeworkSpace</h4>
			<AccountSettings tabStorage={props.tabStorage} />

			<h4><i class="fa fa-fw fa-archive"></i> Export Settings</h4>
			<p>You can export an archive of your settings. Note that this archive may not be compatible with versions other than DaltonTab {chrome.runtime.getManifest().version}. To export your settings, copy and paste the code below into another instance of DaltonTab.</p>
			{state.exportReady ? <input type="text" class="pre" onClick={(event) => event.target.select()} value={state.exportCode} /> : <span><i class="fa fa-circle-o-notch fa-spin"></i> Loading</span>}
			<small><i class="fa fa-exclamation-triangle"></i> Keep this code safe! Someone with malicious intents can use this code to access your MyHomeworkSpace account if you've connected MyHomeworkSpace to DaltonTab.</small>

			<h4><i class="fa fa-fw fa-download"></i> Import Settings</h4>
			<p>You can import settings from a different instance of DaltonTab by pasting that instance's export code below.</p>
			<div class="input-group input-group-sm">
				<input type="text" class="form-control import-field" placeholder="Export code" onChange={this.updateImportCode.bind(this)} value={state.importCode} />
				<span class="input-group-btn">
					<button class="btn btn-danger btn-sm" onClick={this.importSettings.bind(this)}>Import</button>
				</span>
			</div>
			<small><i class="fa fa-exclamation-triangle"></i> Importing settings will overwrite all the settings that you currently have saved.</small>

			<h4><i class="fa fa-fw fa-eraser"></i> Reset</h4>
			<p>Use the button below to reset DaltonTab to it's default settings. Prior to doing this, make sure that you have backed up your settings by saving the export code in the "Export Settings" section.</p>
			<button class="btn btn-sm btn-danger" onClick={this.resetSettings}>Reset DaltonTab</button>

			<h4><i class="fa fa-fw fa-info-circle" /> About</h4>
			<p>You're running DaltonTab version {chrome.runtime.getManifest().version} on {navigator.userAgent.indexOf("Firefox") > -1 ? "Firefox" : "Chrome"}. DaltonTab was created for the TigerHacks NYC Hackathon, and is currently maintained by the MyHomeworkSpace team.</p>

			<div class="btn-group btn-group-justified" role="group">
				<a href="https://github.com/MyHomeworkSpace/DaltonTab" class="btn btn-default btn-sm">View on GitHub</a>
				<div class="btn-group" role="group">
					<button class="btn btn-default btn-sm" onClick={this.addOnboarding.bind(this)}>Getting started</button>
				</div>
				<div class="btn-group" role="group">
					<button class="btn btn-default btn-sm" onClick={this.smile}><i class="fa fa-smile-o"></i></button>
				</div>
			</div>

			<hr />

			<p class="small">This program uses the Lato font, which is copyright (c) 2010-2014 by tyPoland Lukasz Dziedzic (team@latofonts.com) with Reserved Font Name "Lato"</p>
			<p class="small">We collect some data about the services you've enabled and your web browser's version. We use this to improve DaltonTab, and the data cannot be linked back to your account, as anything that could identify you (such as your username) is not sent.</p>
		</div>;
	}
};