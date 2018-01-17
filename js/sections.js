DaltonTab.Sections = {
	myhomeworkspace: {
		name: "Homework",
		icon: "fa-file",
		description: "View your homework information from MyHomeworkSpace.",
		background: "rgba(60, 77, 99, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Homework, {}), null, $html[0]);
			return $html;
		},
		run: function() {
			
		}
	},
	schedule: {
		name: "Calendar",
		icon: "fa-calendar",
		description: "View your calendar from MyHomeworkSpace.",
		background: "rgba(121, 70, 26, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Calendar, {}), null, $html[0]);
			return $html;
		},
		run: function() {
			
		}
	},
	classes: {
		name: "Classes",
		icon: "fa-list",
		description: "View and access your classes.",
		background: "rgba(57, 146, 108, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Classes, {}), null, $html[0]);
			return $html;
		},
		run: function() {

		}
	},
	weather: {
		name: "Weather",
		icon: "fa-sun-o",
		description: "View the current weather.",
		background: "rgba(14, 100, 18, 0.9)",
		createHtml: function() {
			var $html = $('<div id="weather" class="row"></div>');
				var $current = $('<div id="weatherCurrent" class="col-md-6"><br /><br /><br /><i class="fa fa-refresh fa-spin"></i> Loading weather...</div>');
				$html.append($current);
				var $forecast = $('<div id="weatherForecast" class="col-md-6"></div>');
				$html.append($forecast);
			return $html;
		},
		run: function() {
			chrome.storage.sync.get(["weather", "weatherUnits"], function(storage) {
				console.log(storage);
				var units = "f";
				if (storage.weatherUnits != undefined) {
					units = storage.weatherUnits;
				}
				if (storage.weather == undefined) {
					$("#weatherCurrent").html("<br /><br /><br /><span style='font-size:2em;'>You haven't set your location.</span><br />");
					var $options = $('<button class="btn btn-default btn-lg">Set your location</button>');
						$options.click(function() {
							$("#weatherModal").modal();
						});
					$("#weatherCurrent").append($options);
					return;
				}
				$.get("https://daltontabservices.myhomework.space/v1/weather.php", {
					units: units,
					place: storage.weather.query
				}, function(data) {
					var results = data.query.results.channel;
					var forecast = results.item.forecast;
					console.log(results);

					var fixStupidYahooTimeThing = function(time) {
						// sometimes yahoo's api gives times like "7:3 am".
						// this function takes those times and fixes them
						var secondPart = time.split(":")[1];
						var minutes = secondPart.split(" ")[0];
						if (minutes.length == 1) {
							minutes = "0" + minutes;
						}
						return time.split(":")[0] + ":" + minutes + " " + secondPart.split(" ")[1];
					};

					// current conditions
					$("#weatherCurrent").html("");
					var $currentInfo = $('<h2 id="weatherCurrentInfo"></h2>');
						var $bigIcon = $('<i class="weather-icon nomove"></i>');
							$bigIcon.addClass("icon-" + results.item.condition.code);
						$currentInfo.append($bigIcon);
						$currentInfo.append(" ");
						var $infoLabel = $('<span></span>');
							$infoLabel.text(results.item.condition.temp + "\xB0 - " + results.item.condition.text);
						$currentInfo.append($infoLabel);
					$("#weatherCurrent").append($currentInfo);
					var $detailedInfo = $("<p></p>");
						$detailedInfo.append(document.createTextNode("Feels like: " + results.wind.chill + "\xB0"));
						$detailedInfo.append("<br />");
						$detailedInfo.append(document.createTextNode("Humidity: " + results.atmosphere.humidity + "%"));
						$detailedInfo.append("<br />");
						$detailedInfo.append(document.createTextNode("Sunrise: " + fixStupidYahooTimeThing(results.astronomy.sunrise)));
						$detailedInfo.append("<br />");
						$detailedInfo.append(document.createTextNode("Sunset: " + fixStupidYahooTimeThing(results.astronomy.sunset)));
					$("#weatherCurrent").append($detailedInfo);
					var $options = $('<button class="btn btn-default btn-xs">Weather options</button>');
						$options.click(function() {
							$("#weatherModal").modal();
						});
					$("#weatherCurrent").append($options);
					$("#weatherCurrent").append("<br />");
					$("#weatherCurrent").append('<a href="https://weather.yahoo.com/?ilc=401" target="_blank" id="weatherPoweredBy"> <img src="https://poweredby.yahoo.com/white.png" width="134" height="29"/> </a>');

					// forecast
					$("#weatherForecast").html("<h2>Forecast</h2><div class='row'></div>");
					for (var forecastIndex in forecast) {
						if (forecastIndex > 4) {
							break;
						}
						var dayForecast = forecast[forecastIndex];
						var $dayForecast = $('<div class="col-md-2"></div>');
							var $day = $('<h4></h4>');
								$day.text(dayForecast.day);
							$dayForecast.append($day);
							var $icon = $('<i class="weather-icon"></i>');
								$icon.addClass("icon-" + dayForecast.code);
							$dayForecast.append($icon);
							var $info = $('<div></div>');
								$info.text(dayForecast.text);
							$dayForecast.append($info);
							var $temps = $('<div></div>');
								$temps.text(dayForecast.high + " / " + dayForecast.low);
							$dayForecast.append($temps);
						$("#weatherForecast .row").append($dayForecast);
					}
					var $fullForecast = $('<a class="btn btn-default">View full forecast &raquo;</a>');
						var forecastUrl = results.link.split("*")[1]; // HACK: for some reason, the link Yahoo returns doesn't work, and it has to be split like this
						$fullForecast.attr("href", forecastUrl);
					$("#weatherForecast").append("<br />");
					$("#weatherForecast").append($fullForecast);
				}).fail(function() {
					$("#weather").removeClass("row");
					$("#weather").html("<span class='section-warning'><i class='fa fa-chain-broken'></i> Could not get weather.</span>");
					$("#weather .section-warning").css("font-size", "3em");
					$("#weather .section-warning").css("font-weight", "lighter");
				});
			});
		}
	},
	tabCount: {
		name: "Tab Count",
		icon: "fa-clone",
		description: "Count the number of tabs that you open in a day",
		background: "rgba(0, 140, 186, 0.9)",
		createHtml: function(){
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.TabCount, {}), null, $html[0]);
			return $html;
		},
		run: function(){
			
		}
	}/*,
	lunchMenu: {
		name: "Lunch Menu",
		icon: "fa-file-text-o",
		description: "Displays the lunch menu for the day.",
		background: "rgba(0, 140, 186, 0.9)",
		createHtml: function(){
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.LunchMenu, {}), null, $html[0]);
			return $html;
		},
		run: function(){
			
		}
	}*/
};
