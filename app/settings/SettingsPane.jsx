import "settings/SettingsPane.styl";

import { h, Component } from "preact";

import AccountSettings from "settings/AccountSettings.jsx";
import SettingCheckbox from "settings/SettingCheckbox.jsx";

export default class SettingsPane extends Component {
	render(props, state) {
		return <div class="settingsPane">
			<div class="settingsPaneClose" onClick={props.toggleSettings}>
				<i class="fa fa-times" />
			</div>
			<h3 class="settingsPaneTitle">Settings</h3>

			<h4>MyHomeworkSpace</h4>
			<AccountSettings tabStorage={props.tabStorage} />

			<h4>Clock</h4>
			<SettingCheckbox 
				storage={props.tabStorage} updateStorage={props.updateStorage}
				label="Show current date underneath time" storageKey="displayDate" defaultValue={true}
			/>

			<h4>Background</h4>

			<h4>Layout</h4>

			<h4>About</h4>
			<p>You're running DaltonTab version {chrome.runtime.getManifest().version}.</p>
			<a href="https://github.com/ULTIMATHEXERS/DaltonTab" class="btn btn-default btn-sm">View on GitHub</a>
			<p>We collect some data about the services you've enabled and your web browser's version. We use this to improve DaltonTab, and the data cannot be linked back to your account, as anything that could identify you (such as your username) is not sent.</p>
			
		</div>;
	}
};