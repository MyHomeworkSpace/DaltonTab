DaltonTab.Sections = {
    myhomeworkspace: {
        name: "Homework",
        icon: "fa-file",
        description: "View your homework information from MyHomeworkSpace.",
        background: "rgba(60, 77, 99, 0.9)",
        createHtml: function() {
            var $html = $("<div></div>");
                $html.append('<h3 id="hw-warning" class="section-warning"></h3><p id="hwLoadMsg"><i class="fa fa-refresh fa-spin"></i> Getting your homework...</p>');
                var $hwRow = $('<div id="hwRow" class="row"></div>');
                    $hwRow.append('<div id="hwTomorrow" class="col-md-4"><h4>Due tomorrow</h4></div>');
                    $hwRow.append('<div id="hwSoon" class="col-md-4"><h4>Due soon</h4></div>');
                    $hwRow.append('<div id="hwLongTerm" class="col-md-4"><h4>Long-term</h4></div>');
                    $hwRow.hide();
                $html.append($hwRow);
            return $html;
        },
        run: function() {
            window.mhs.init(function() {
            	window.mhs.get("auth/me", function(data) {
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

            		window.mhs.get("classes/get/", function(data) {
            			for (var i = 0; i < data.classes.length; i++) {
            				var itm = data.classes[i];
            				window.daltonTab.subjects[itm.id] = itm;
            			};
                        window.mhs.get("homework/getHWView", function(data) {
                			var ev = data.homework;
                			if (ev.length == 0) {
                				return;
                			}
                			for (var evIndex in ev) {
                				var evObj = {
                					name: ev[evIndex].name,
                					due: new Date(ev[evIndex].due),
                					classId: ev[evIndex].classId,
                					done: ev[evIndex].done
                				};
                				var list = "LongTerm";
                				var dueMoment = moment(evObj.due).utcOffset(0);
                				var tomorrow = moment(window.daltonTab.findNextDay(1)).date();
                				if (dueMoment.date() == tomorrow && dueMoment.month() == moment(window.daltonTab.findNextDay(1)).month() && dueMoment.year() == moment(window.daltonTab.findNextDay(1)).year()) { // moment.isSame didn't work here. /shrug
                					list = "Tomorrow";
                				} else if (dueMoment.isBefore(moment(window.daltonTab.findNextDay(5)).subtract(1, "day"))) {
                					list = "Soon";
                				}
                				window.daltonTab.addEventToList(evObj, list);
                			};
                            $("#hwLoadMsg").remove();
                            $("#hwRow").show();
                		});
            		});
            	});
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
                            $("#sectionsButton").click();
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
					$("#schedules-warning").html('<i class="fa fa-exclamation-circle"></i> Unable to connect to Schedules.');
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
            //window.LoadSched();
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
        	window.coursesLib.checkLoggedIn(function(response) {
        		if (!response.isLoggedIn) {
        			$("#classes-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in <a href="http://courses.dalton.org">to Courses</a>.');
        			$("#classes-warning").css("font-size", "3em");
                    $("#classesLoadMsg").hide();
        		} else {
        			window.coursesLib.getCourseList(function(response) {
        				for (var courseIndex in response.classes) {
        					var course = response.classes[courseIndex];
        					console.log(course);
        					var $element = $("<li></li>");
        						$element.html('<a href="' + course.url + '" style="color:white">' + course.name + '</a>');
        					$("#courses").append($element);
                            $("#classesLoadMsg").hide();
        				}
        			});
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
                    var $options = $('<button class="btn btn-primary btn-lg">Set your location</button>');
                        $options.click(function() {
                            $("#weatherModal").modal();
                        });
                    $("#weatherCurrent").append($options);
                    return;
                }
                $.get("https://daltontabservices.myhomework.space/v1/weather.php", {
                    units: units,
                    place: "New York, NY"
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
                    var $fullForecast = $('<h3><a>View full forecast &raquo;</a></h3>');
                        $fullForecast.children("a").attr("href", results.link);
                    $("#weatherForecast").append($fullForecast);
                    $("#weatherForecast").append('<a href="https://weather.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/white.png" width="134" height="29"/> </a>');
                });
            });
        }
    }
};
