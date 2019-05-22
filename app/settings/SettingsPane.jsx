import "settings/SettingsPane.styl";

import { h, Component } from "preact";

import AccountSettings from "settings/AccountSettings.jsx";
import LayoutSettings from "settings/LayoutSettings.jsx";
import SettingCheckbox from "settings/SettingCheckbox.jsx";
import SettingTimeInput from "settings/SettingTimeInput.jsx";

export default class SettingsPane extends Component {
	setStorage(key, value) {
		var newStorage = {};
		newStorage[key] = value;
		this.props.updateStorage(newStorage);
	}

	setDayStart(event) {
		this.setStorage.bind(this, "dayStartTime", event.target.value)();
		var dayEnd = event.target.value.split(":")
		var dayStart = this.props.tabStorage.dayStartTime.split(":")
		if (parseInt(dayStart[0]) > parseInt(dayEnd[0]) || (parseInt(dayStart[0]) == parseInt(dayEnd[0]) && parseInt(dayStart[1]) > parseInt(dayEnd[1]))) {
			this.setStorage.bind(this, "dayEndTime", event.target.value)();
		}
	}

	setDayEnd(event) {
		this.setStorage.bind(this, "dayEndTime", event.target.value)();
		var dayEnd = event.target.value.split(":")
		var dayStart = this.props.tabStorage.dayStartTime.split(":")
		if (parseInt(dayStart[0]) > parseInt(dayEnd[0]) || (parseInt(dayStart[0]) == parseInt(dayEnd[0]) && parseInt(dayStart[1]) > parseInt(dayEnd[1]))) {
			this.setStorage.bind(this, "dayStartTime", event.target.value)();
		}
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

			<h4><i class="fa fa-fw fa-info-circle" /> About</h4>
			<p>You're running DaltonTab version {chrome.runtime.getManifest().version} on {navigator.userAgent.indexOf("Firefox") > -1 ? "Firefox" : "Chrome"}. DaltonTab was created for the TigerHacks NYC Hackathon, and is currently maintained by the MyHomeworkSpace team.</p>

			<a href="https://github.com/MyHomeworkSpace/DaltonTab" class="btn btn-default btn-sm">View on GitHub</a>

			<p class="small">This program uses the Lato font, which is copyright (c) 2010-2014 by tyPoland Lukasz Dziedzic (team@latofonts.com) with Reserved Font Name "Lato"</p>
			<p class="small">We collect some data about the services you've enabled and your web browser's version. We use this to improve DaltonTab, and the data cannot be linked back to your account, as anything that could identify you (such as your username) is not sent.</p>
		</div>;
	}
};