window.sections = {
    planhub: { // don't change this plox
        name: "Homework",
        icon: "fa-file",
        description: "View your homework information from MyHomeworkSpace.",
        background: "rgba(60, 77, 99, 0.9)",
        createHtml: function() {
            var $html = $("<div></div>");
                $html.append('<h3 id="hw-warning" class="section-warning"></h3>');
                var $hwRow = $('<div id="hwRow" class="row"></div>');
                    $hwRow.append('<div id="hwTomorrow" class="col-md-4"><h4>Due tomorrow</h4></div>');
                    $hwRow.append('<div id="hwSoon" class="col-md-4"><h4>Due soon</h4></div>');
                    $hwRow.append('<div id="hwLongTerm" class="col-md-4"><h4>Long-term</h4></div>');
                $html.append($hwRow);
            return $html;
        },
        run: function() {
        	window.mhs.get("features/get/", function(data) {
        		console.log(data);
        		if (data.status == "error" || data.status == "auth_required") {
        			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Sign into <a href="https://myhomework.space">MyHomeworkSpace</a> to view your homework.');
        			$("#hw-warning").css("font-size", "3em");
        			$("#hwRow").remove();
        			return;
        		}
        		if (data.features.indexOf("hwView") == -1) {
        			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Enable <a href="https://myhomwork.space/app#hwView">Homework View</a> to see your homework here.');
        			$("#hw-warning").css("font-size", "3em");
        			$("#hwRow").remove();
        			return;
        		}

        		window.mhs.get("planner/sections/get/", function(data) {
        			for (var i = 0; i < data.sections.length; i++) {
        				var itm = data.sections[i];
        				window.daltonTab.subjects[itm.sectionIndex] = itm;
        			};
        			window.daltonTab.loadHomework();
        		});
        	});
        }
    },
    schedule: {
        name: "Schedule",
        icon: "fa-calendar",
        description: "View your schedule from schedules.dalton.org.",
        background: "rgba(121, 70, 26, 0.65)",
        createHtml: function() {
            var $html = $("<div></div>");
                $html.append('<h3 id="schedules-warning" class="section-warning"></h3>');
                $html.append('<table id="schedulesTable" border="0" style="width:100%"><tr><td data-dow="1"><h5>Monday</h5></td><td data-dow="2"><h5>Tuesday</h5></td><td data-dow="3"><h5>Wednesday</h5></td><td data-dow="4"><h5>Thursday</h5></td><td data-dow="5"><h5>Friday</h5></td></tr><tr></tr><tr></tr></table>');
            return $html;
        },
        run: function() {
            window.LoadSched();
        }
    },
    classes: {
        name: "Classes",
        icon: "fa-list",
        description: "View and access your courses from courses.dalton.org.",
        background: "rgba(57, 146, 108, 0.69)",
        createHtml: function() {
            var $html = $("<div></div>");
                $html.append('<h3 id="classes-warning" class="section-warning"></h3>');
                $html.append('<ul id="courses"></ul>');
            return $html;
        },
        run: function() {
        	window.coursesLib.checkLoggedIn(function(response) {
        		if (!response.isLoggedIn) {
        			$("#classes-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in <a href="http://courses.dalton.org">to Courses</a>.');
        			$("#classes-warning").css("font-size", "3em");
        		} else {
        			window.coursesLib.getCourseList(function(response) {
        				for (var courseIndex in response.classes) {
        					var course = response.classes[courseIndex];
        					console.log(course);
        					var $element = $("<li></li>");
        						$element.html('<a href="' + course.url + '" style="color:white">' + course.name + '</a>');
        					$("#courses").append($element);
        				}
        			});
        		}
        	});
        }
    }
};
