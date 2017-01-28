CoursesLib = {
	baseURL: "https://courses2017.dalton.org/",
	token: "",
	userId: 0,

	login: function(username, password, callback) {
		$.post(CoursesLib.baseURL + "login/token.php", {
			username: username,
			password: password,
			service: "moodle_mobile_app"
		}, function(response) {
			if (response.token) {
				CoursesLib.token = response.token;
			}
			callback(response);
		});
	},
	getUserInfo: function(callback) {
		$.post(CoursesLib.baseURL + "webservice/rest/server.php?moodlewsrestformat=json", {
			moodlewssettingfilter: true,
			moodlewssettingfileurl: true,
			wsfunction: "core_webservice_get_site_info",
			wstoken: CoursesLib.token
		}, function(response) {
			if (response.userid) {
				CoursesLib.userId = response.userid;
			}
			callback(response);
		});
	},
	getCourseList: function(callback) {
		$.post(CoursesLib.baseURL + "webservice/rest/server.php?moodlewsrestformat=json", {
			userid: CoursesLib.userId,
			moodlewssettingfilter: true,
			moodlewssettingfileurl: true,
			wsfunction: "core_enrol_get_users_courses",
			wstoken: CoursesLib.token
		}, function(response) {
			callback(response);
		});
	}
};