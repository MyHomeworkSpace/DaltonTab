import "sections/weather/Weather.styl";

import { h, Component } from "preact";

import ajax from "ajax.js";

import Loading from "ui/Loading.jsx";

export default class Weather extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentWillReceiveProps(nextProps) {
		var that = this;
		this.setState({
			loading: true,
			results: null
		}, function() {
			var units = "f";
			if (nextProps.storage.weatherUnits != undefined) {
				units = nextProps.storage.weatherUnits;
			}

			if (nextProps.storage.weather == undefined) {
				that.setState({
					loading: false,
					noLocation: true
				});
				return;
			}

			ajax.request("GET", "https://daltontabservices.myhomework.space/v1/weather", {
				units: units,
				place: nextProps.storage.weather.query
			}, function(data) {
				if (data) {
					that.setState({
						loading: false,
						results: data.query.results.channel
					});
				} else {
					that.setState({
						loading: false,
						error: true
					});
				}
			});
		});
	}

	openSettingsModal() {
		this.props.openModal("weather");
	}

	fixStupidYahooTimeThing(time) {
		// sometimes yahoo's api gives times like "7:3 am".
		// this function takes those times and fixes them
		var secondPart = time.split(":")[1];
		var minutes = secondPart.split(" ")[0];
		if (minutes.length == 1) {
			minutes = "0" + minutes;
		}
		return time.split(":")[0] + ":" + minutes + " " + secondPart.split(" ")[1];
	};

	render(props, state) {
		if (state.error) {
			return <div class="weather row">
				{state.error && <span class="section-warning"><i class="fa fa-chain-broken" /> Could not get weather.</span>}
			</div>;
		}

		var forecast = state.results && state.results.item.forecast;
		var forecastUrl = state.results && state.results.link.split("*")[1]; // HACK: for some reason, the link Yahoo returns doesn't work, and it has to be split like this

		if (state.loading) {
			return <Loading section="weather" />;
		}

		return <div class="weather row">
			<div class="col-md-6">
				{state.noLocation && <div>
					<div>You haven't set your location.</div>
					<button class="btn btn-default btn-lg" onClick={this.openSettingsModal.bind(this)}>Set your location</button>
				</div>}
				{state.results && <div>
					<h2 class="weatherCurrentInfo">
						<i class={`weather-icon nomove icon-${state.results.item.condition.code}`} />
						{state.results.item.condition.temp}{"\xB0 - "}{state.results.item.condition.text}
					</h2>
					<div>
						<div>Feels like: {state.results.wind.chill}{"\xB0"}</div>
						<div>Humidity: {state.results.atmosphere.humidity}%</div>
						<div>Sunrise: {this.fixStupidYahooTimeThing(state.results.astronomy.sunrise)}</div>
						<div>Sunset: {this.fixStupidYahooTimeThing(state.results.astronomy.sunset)}</div>
					</div>
					<button class="btn btn-default btn-xs" onClick={this.openSettingsModal.bind(this)}>Weather options</button>
					<div>
						<a href="https://weather.yahoo.com/?ilc=401" target="_blank" rel="noopener noreferrer" class="weatherPoweredBy">
							<img src="https://poweredby.yahoo.com/white.png" width="134" height="29" />
						</a>
					</div>
				</div>}
			</div>
			{state.results && <div class="col-md-6">
				<h2>Forecast</h2>
				<div class="row">
					{forecast.map(function(dayForecast, index) {
						if (index > 4) {
							return;
						}
						return <div class="col-md-2">
							<h4>{dayForecast.day}</h4>
							<i class={`weather-icon icon-${dayForecast.code}`} />
							<div>{dayForecast.text}</div>
							<div>{dayForecast.high} / {dayForecast.low}</div>
						</div>;
					})}
				</div>
				<a href={forecastUrl} class="btn btn-default">View full forecast &raquo;</a>
			</div>}
		</div>;
	}
};