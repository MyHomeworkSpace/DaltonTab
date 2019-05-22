import "settings/SettingCheckbox.styl";

import { h, Component } from "preact";

export default class SettingCheckbox extends Component {
	render(props, state) {
		var value = props.storage[props.storageKey];
		if (value === undefined) {
			value = props.defaultValue || false;
		}

		return (
			<label class="settingCheckbox">
				<input
					type="checkbox"
					checked={(props.inverted ? !value : value)}
					onChange={(function(e) {
						var newStorage = {};
						newStorage[props.storageKey] = (props.inverted ? !e.target.checked : e.target.checked);
						this.props.updateStorage(newStorage);
					}).bind(this)}
				/>
				{" " + props.label}
			</label>
		);
	}
};