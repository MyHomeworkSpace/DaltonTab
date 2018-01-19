import { h, Component } from "preact";

export default class SettingCheckbox extends Component {
	render(props, state) {
		var value = props.storage[props.storageKey];
		if (value === undefined) {
			value = props.defaultValue || false;
		}

		return (
			<label>
				<input
					type="checkbox"
					checked={value}
					onChange={(function(e) {
						var newStorage = {}
						newStorage[props.storageKey] = e.target.checked;
						this.props.updateStorage(newStorage);
					}).bind(this)}
				/>
				{" " + props.label}
			</label>
		);
	}
};