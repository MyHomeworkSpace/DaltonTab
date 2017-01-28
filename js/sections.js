DaltonTab.Sections = {
	myhomeworkspace: {
		name: "Homework",
		icon: "fa-file",
		description: "View your homework information from MyHomeworkSpace.",
		background: "rgba(60, 77, 99, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				$html.append('<h3 id="hw-warning" class="section-warning"></h3><p id="hwLoadMsg"><i class="fa fa-refresh fa-spin"></i> Getting your homework...</p>');
				var $hwRow = $('<div id="myHWSpaceRow" class="row"></div>');
					$hwRow.append('<div id="myHWSpaceOverdue" class="myHWSpaceList hidden col-md-4"><div class="myHWSpaceListName">Overdue</div><ul></ul></div>');
					$hwRow.append('<div id="myHWSpaceTomorrow" class="myHWSpaceList col-md-4"><div class="myHWSpaceListName">Tomorrow</div><ul></ul></div>');
					$hwRow.append('<div id="myHWSpaceSoon" class="myHWSpaceList col-md-4"><div class="myHWSpaceListName">Soon</div><ul></ul></div>');
					$hwRow.append('<div id="myHWSpaceLongterm" class="myHWSpaceList col-md-4"><div class="myHWSpaceListName">Long-term</div><ul></ul></div>');
					$hwRow.hide();
				$html.append($hwRow);
			return $html;
		},
		run: function() {
			MyHomeworkSpace.init(function() {
				MyHomeworkSpace.get("auth/me", function(data) {
					console.log(data);
					if (data.status == "error") {
						$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Sign into <a href="https://myhomework.space">MyHomeworkSpace</a> to view your homework.');
						$("#hw-warning").css("font-size", "3em");
						$("#hwLoadMsg").remove();
						$("#hwRow").remove();
						return;
					}

					// update settings info
					$("#mhsSignInInfo").addClass("hidden");
					$("#mhsSignedIn").removeClass("hidden");
					$("#mhsAccountName").text(data.name + " (" + data.username + ")");

					MyHomeworkSpace.get("classes/get/", function(data) {
						var classes = [];
						for (var i = 0; i < data.classes.length; i++) {
							var itm = data.classes[i];
							classes[itm.id] = itm;
						}
						MyHomeworkSpace.get("homework/getHWView", function(data) {
							var hw = data.homework;
							var showMonday = (moment().day() == 5 || moment().day() == 6);
							var tomorrowDaysToThreshold = 2;
							var showOverdue = false;
							if (showMonday) {
								$("#myHWSpaceTomorrowTitle").text("Monday");
								if (moment().day() == 5) {
									tomorrowDaysToThreshold = 4;
								} else {
									tomorrowDaysToThreshold = 3;
								}
							}
							for (var hwIndex in hw) {
								var hwItem = hw[hwIndex];

								var due = moment(hwItem.due);
								var dueText = due.calendar().split(" at ")[0];
								var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);
								var prefix = hwItem.name.split(" ")[0];

								if (daysTo < 1 && hwItem.complete == "1") {
									continue;
								}

								if (dueText.indexOf(' ') > -1) {
									dueText = dueText[0].toLowerCase() + dueText.substr(1);
								}

								var $item = $('<div class="myHWSpaceItem"></div>');

									$item.attr("data-hwId", hwItem.id);
									if (hwItem.complete == "1") {
										$item.addClass("done");
									}
									var $name = $('<div class="myHWSpaceName"></div>');
										$name.append($("<span></span>").text(prefix).addClass(MyHomeworkSpace.Prefixes.matchClass(prefix)));
										if (hwItem.name.indexOf(" ") != -1) {
											$name.append($("<span></span>").text(hwItem.name.substr(hwItem.name.indexOf(" "))));
										}
										if (daysTo < 1) {
											$name.append(" (late)");
										}
									$item.append($name);
									var $subtext = $('<div class="myHWSpaceSubText"></div>');
										var keyword = "due ";
										if (prefix.toLowerCase() == "test" || prefix.toLowerCase() == "exam" || prefix.toLowerCase() == "midterm" || prefix.toLowerCase() == "quiz" || prefix.toLowerCase() == "ica" || prefix.toLowerCase() == "lab" || prefix.toLowerCase() == "study") {
											keyword = "on ";
										}
										if (keyword == "on " && (dueText.toLowerCase() == "today" || dueText.toLowerCase() == "tomorrow")) {
											keyword = "";
										}
										$subtext.text(keyword + dueText);
										for (var classIndex in classes) {
											if (classes[classIndex].id == hwItem.classId) {
												$subtext.append(" in " + classes[classIndex].name)
											}
										}
									$item.append($subtext);

									if (daysTo < 1) {
										$item.addClass("myHWSpaceLate");
									}

								if (daysTo < 1) {
									showOverdue = true;
									$("#myHWSpaceOverdue ul").append($item);
								} else if (daysTo < tomorrowDaysToThreshold) {
									$("#myHWSpaceTomorrow ul").append($item);
								} else if (daysTo < 5) {
									$("#myHWSpaceSoon ul").append($item);
								} else {
									$("#myHWSpaceLongterm ul").append($item);
								}
							}
							if (showOverdue) {
								$("#myHWSpaceOverdue").removeClass("hidden");
								$(".myHWSpaceList").removeClass("col-md-4").addClass("col-md-3");
							}
							
							$("#hwLoadMsg").remove();
							$("#myHWSpaceRow").show();
						});
					});
				});
			}, function() {
				$("#hw-warning").html('<i class="fa fa-chain-broken"></i> Could not reach MyHomeworkSpace.');
				$("#hw-warning").css("font-size", "3em");
				$("#hwLoadMsg").remove();
				$("#hwRow").remove();
			});
		}
	},
	schedule: {
		name: "Schedule",
		icon: "fa-calendar",
		description: "View your schedule from schedules.dalton.org.",
		background: "rgba(121, 70, 26, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				$html.append('<h3 id="schedules-warning" class="section-warning"></h3>');
				$html.append('<div id="scheduleLoadMsg"><i class="fa fa-refresh fa-spin"></i> Loading your schedule...</div>');
				var $schedule = $('<div id="schedule"></div>');
					var $daysOfWeek = $('<div id="daysOfWeek"></div>');
						$daysOfWeek.append('<div class="dayOfWeek">Monday</div>');
						$daysOfWeek.append('<div class="dayOfWeek">Tuesday</div>');
						$daysOfWeek.append('<div class="dayOfWeek">Wednesday</div>');
						$daysOfWeek.append('<div class="dayOfWeek">Thursday</div>');
						$daysOfWeek.append('<div class="dayOfWeek">Friday</div>');
					$schedule.append($daysOfWeek);
					$schedule.append('<div class="dayClasses mon"><div></div></div>');
					$schedule.append('<div class="dayClasses tue"><div></div></div>');
					$schedule.append('<div class="dayClasses wed"><div></div></div>');
					$schedule.append('<div class="dayClasses thu"><div></div></div>');
					$schedule.append('<div class="dayClasses fri"><div></div></div>');
					$schedule.hide();
				$html.append($schedule);
			return $html;
		},
		run: function() {
			chrome.storage.sync.get(["schedulesLogin"], function(storage) {
				if (storage.schedulesLogin == undefined) {
					// we aren't signed in
					$("#schedules-warning").html('<i class="fa fa-exclamation-circle"></i> You aren\'t signed in to Schedules. ');
					var $link = $('<a href="#">Sign in to continue.</a>');
						$link.click(function() {
							DaltonTab.Settings.open("accounts");
							return false;
						});
					$("#schedules-warning").append($link);
					$("#scheduleLoadMsg").hide();
					$("#schedule").remove();
					return;
				}
				DaltonTab.Schedule.reset();
				DaltonTab.Schedule.init(storage.schedulesLogin, function() {
					// yay it worked!

					// for some reason, some classes show up twice on schedules: once as a middle school class and once as a high school class
					// this means that the class ends up on the schedule twice
					// this includes my geometry class
					// to fix it, count the grades of your classes, and whichever is the higher number is declared "your grade"
					// classes from outside your grade are ignored
					// hopefully this doesn't break something?
					// could also change this to remove duplicate classes instead if it ends up breaking stuff
					// tho you have to be careful, because you might remove things like double chem if you do that
					var gradeCounts = {};
					DaltonTab.Schedule.scheduleData.find("period").each(function() {
						var grade = $(this).children("SCHOOL_ID").text();
						if (!gradeCounts[grade]) {
							gradeCounts[grade] = 0;
						}
						gradeCounts[grade]++;
					});
					var yourGrade = "";
					var gradeCount = 0;
					for (var grade in gradeCounts) {
						if (gradeCounts[grade] > gradeCount) {
							yourGrade = grade;
							gradeCount = gradeCounts[grade];
						}
					}

					DaltonTab.Schedule.scheduleData.find("period").each(function() {
						if ($(this).children("SCHOOL_ID").text() != yourGrade) {
							return; // outside my grade
						}
						var $item = $('<div class="class"></div>');

						var name = $(this).children("section").children("name").text().replace("<![CDATA[", "").replace("]]>");
						var instructor = $(this).children("instructor").children("name").text();
						var location = $(this).children("location").text();

						var date = moment($(this).children("date").text());
						var start = moment($(this).children("start").text());
						var end = moment($(this).children("end").text());
						var startHour = start.hour() - 8;
						var startMin = start.minutes();
						var endHour = end.hour() - 8;
						var endMin = end.minutes();

						var pixelsPerMinute = 1.25;

						var startOffset = (startHour * 60 + startMin) * pixelsPerMinute;
						var endOffset = (endHour * 60 + endMin) * pixelsPerMinute;
						var boxSize = endOffset - startOffset;
						$item.css("height", boxSize + "px");
						$item.css("top", startOffset + "px");

						$item.append("<strong>" + name + " in " + location + "</strong><br />");
						if (instructor != "") {
							$item.append("with " + instructor);
							$item.append("<br />");
						}
						$item.append("from " + start.format("h:mm") + " to " + end.format("h:mm"));
						$(".dayClasses." + date.format("ddd").toLowerCase() + "").append($item);
					});

					$("#scheduleLoadMsg").hide();
					$("#schedule").show();
				}, function() {
					// session is expired
					$("#schedules-warning").html('<i class="fa fa-exclamation-circle"></i> Your Schedules session has expired. Please re-sign in using the DaltonTab settings page.');
					$("#schedules-warning").css("font-size", "3em");
					$("#scheduleLoadMsg").hide();
					$("#schedule").remove();
				}, function() {
					// general failure, but session might not be bad
					$("#schedules-warning").html('<i class="fa fa-chain-broken"></i> Could not reach Schedules.');
					$("#schedules-warning").css("font-size", "3em");
					$("#scheduleLoadMsg").hide();
					$("#schedule").remove();
				}, function(newKey, callback) {
					// a new key!
					// update our storage
					storage.schedulesLogin.key = newKey;
					chrome.storage.sync.set({
						schedulesLogin: storage.schedulesLogin
					}, function() {
						// and inform it that we're done so it can try again
						callback();
					});
				});
			});
		}
	},
	classes: {
		name: "Classes",
		icon: "fa-list",
		description: "View and access your courses from courses.dalton.org.",
		background: "rgba(57, 146, 108, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				$html.append('<h3 id="classes-warning" class="section-warning"></h3>');
				$html.append('<div id="classesLoadMsg"><i class="fa fa-refresh fa-spin"></i> Loading your classes...</div>');
				$html.append('<ul id="courses"></ul>');
			return $html;
		},
		run: function() {
			var displayCoursesLoginMessage = function() {
				$("#classes-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in ');
				var $link = $('<a href="#">to Courses</a>');
					$link.click(function() {
						$("#coursesSignInBtn").click();
						return false;
					});
				$("#classes-warning").append($link);
				$("#classes-warning").append(".");
				$("#classesLoadMsg").hide();
			};
			chrome.storage.sync.get("coursesToken", function(storage) {
				if (storage.coursesToken) {
					var token = storage.coursesToken;
					CoursesLib.token = token;
					CoursesLib.getUserInfo(function(userInfo) { 
						if (userInfo.errorcode) {
							displayCoursesLoginMessage();
							return;
						}
						$("#coursesAccountName").text(userInfo.fullname + " (" + userInfo.username + ")")
						$("#coursesSignInInfo").addClass("hidden");
						$("#coursesSignedIn").removeClass("hidden");
						CoursesLib.getCourseList(function(courses) {
							var rowIndex = 0;
							var $row = null;
							for (var courseIndex in courses) {
								if (rowIndex == 0) {
									$row = $('<div class="row"></div>');
								}

								var course = courses[courseIndex];

								var $element = $('<a class="col-md-3 classesClass"></a>');
									$element.attr("href", CoursesLib.baseURL + "course/view.php?id=" + course.id);
									$element.text(course.fullname.replace(/&amp;/g, "&"));
								$row.append($element);

								rowIndex++;
								if (rowIndex == 3) {
									$("#courses").append($row);
									rowIndex = 0;
									$row = null;
								}
							}
							if ($row) {
								$("#courses").append($row);
							}
							$("#classesLoadMsg").hide();
						});
					}, function() {
						$("#classes-warning").html('<i class="fa fa-chain-broken"></i> Could not reach Courses.');
						$("#classesLoadMsg").hide();
					});
				} else {
					displayCoursesLoginMessage();
				}
			});
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
						// this function takes those timesand fixes them
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
						$fullForecast.children("a").attr("href", results.link);
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
	}
};
