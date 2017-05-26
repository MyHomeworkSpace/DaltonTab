DaltonTab.Components.Settings.SettingCheckbox = c({
	componentDidMount: function() {
		var storageKey = this.props.storageKey;
		var defaultValue = this.props.defaultValue;
		var that = this;
		chrome.storage.sync.get(storageKey, function(storage) {
			var value = storage[storageKey];
			that.setState({
				value: (value !== undefined ? value : defaultValue || false)
			});
		})
	},
	render: function(props, state) {
		var that = this;
		return (
			h("label", {},
				h("input", {
					type: "checkbox",
					checked: state.value,
					onChange: (function(e) {
						that.setState({
							value: e.target.checked
						}, function() {
							var newStorage = {}
							newStorage[props.storageKey] = e.target.checked;
							chrome.storage.sync.set(newStorage, function() {
								if (props.change) {
									props.change(e.target.checked);
								}
							});
						});
					}).bind(this)
				}),
				" " + props.label
			)
		);
	}
});