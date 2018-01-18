import "sections/weather/WeatherModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import Modal from "ui/Modal.jsx";

export default class WeatherModal extends Component {
	componentWillMount() {
		var that = this;
		chrome.storage.sync.get([ "weather", "weatherUnits" ], function(storage) {
			that.setState({
				weather: storage.weather,
				weatherUnits: storage.weatherUnits || "f"
			});
		});
	}

	close() {
		this.props.openModal("");
	}

	locationSubmit() {
		var that = this;
		var locationName = this.state.locationName;

		if (!locationName || locationName.trim() == "") {
			this.setState({
				locationError: "You must enter a location."
			});
			return;
		}

		this.setState({
			loadingError: null,
			locationLoading: true
		}, function() {
			$.get("https://daltontabservices.myhomework.space/v1/weather.php", {
				units: "f",
				place: locationName
			}, function(data) {
				if (data.query.count == 0) {
					that.setState({
						locationError: "Invalid location. You might have to be more specific.",
						locationLoading: false
					});
					return;
				}

				var prettyName = data.query.results.channel.location.city + "," + data.query.results.channel.location.region;
				var weather = {
					query: locationName,
					prettyName: prettyName
				};

				chrome.storage.sync.set({
					weather: weather
				}, function() {
					that.setState({
						locationLoading: false,
						weather: weather
					});
				});
			});
		});
	}

	locationLocate() {
		var that = this;
		this.setState({
			locationLocating: true,
		}, function() {
			navigator.geolocation.getCurrentPosition(function(pos) {
				var yahooFmt = "(" + pos.coords.latitude + ", " + pos.coords.longitude + ")";
				that.setState({
					locationName: yahooFmt,
					locationLocating: false
				}, function() {
					that.locationSubmit.call(that);
				});
			}, function() {
				that.setState({
					locationLocating: false,
					locationLocatingError: true
				});
			});
		});
	}

	locationReset() {
		var that = this;
		chrome.storage.sync.remove("weather", function() {
			that.setState({
				weather: null
			});
		});
	}

	setWeatherUnits(unit) {
		var that = this;
		chrome.storage.sync.set({
			weatherUnits: unit
		}, function() {
			that.setState({
				weatherUnits: unit
			});
		});
	}

	render(props, state) {
		return <Modal reloadSectionsOnClose title="Weather options" openModal={props.openModal} class="weatherModal">
			<div class="modal-body">
				<h4>Location</h4>
				{!state.weather && !state.locationLoading && <div>
					{state.locationError && <div id="weatherLocationError" class="alert alert-danger">{state.locationError}</div>}
					<input type="text" placeholder="Enter a location to use" class="form-control weatherLocationText" onChange={linkState(this, "locationName")} value={state.locationName} />
					<button class="btn btn-primary weatherLocationSubmit" onClick={this.locationSubmit.bind(this)} disabled={state.locationLoading}>Go</button>
					<button class="btn btn-primary" onClick={this.locationLocate.bind(this)} disabled={state.locationLocating || state.locationLoading || state.locationLocatingError}>
						{state.locationLocatingError && "Couldn't get location"}
						{state.locationLocating && "Getting your location..."}
						{!state.locationLocatingError && !state.locationLocating && "Use current location"}
					</button>
				</div>}
				{state.locationLoading && <div>
					<i class="fa fa-refresh fa-spin" /> Loading...
				</div>}
				{state.weather && <div>
					Weather location is set to <strong>{state.weather.prettyName}</strong>.
					<button class="btn btn-default btn-xs" onClick={this.locationReset.bind(this)} >Change</button>
				</div>}

				<h4>Units</h4>
				<label><input type="radio" name="weatherUnits" value="f" checked={state.weatherUnits == "f"} onChange={this.setWeatherUnits.bind(this, "f")} /> Fahrenheit</label>
				<label><input type="radio" name="weatherUnits" value="c" checked={state.weatherUnits == "c"} onChange={this.setWeatherUnits.bind(this, "c")} /> Celsius</label>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};