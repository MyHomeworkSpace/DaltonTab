MyHomeworkSpace = {
	basePath: "https://api-v2.myhomework.space/",
	csrfToken: "",

	init: function(callback) {
		$.get(MyHomeworkSpace.basePath + "auth/csrf", function() {
			$.get(MyHomeworkSpace.basePath + "auth/csrf", function(response) {
				MyHomeworkSpace.csrfToken = response.token;
				callback();
			});
		});
	},

	get: function(url, callback) {
		var callbackFunc = function(data) {
			if (data.responseJSON) {
				callback(data.responseJSON);
				return;
			}
			callback(data);
		};
		$.get(MyHomeworkSpace.basePath + url + "?csrfToken=" + MyHomeworkSpace.csrfToken, callbackFunc).fail(callbackFunc);
	},

	post: function(url, data, callback) {
		$.post(MyHomeworkSpace.basePath + url + "?csrfToken=" + MyHomeworkSpace.csrfToken, data, function(data) {
			callback(data);
		});
	}
};

MyHomeworkSpace.Prefixes = {};
MyHomeworkSpace.Prefixes.list = [{
									color: "cal_hw",
									words: ["HW", "Read", "Reading"],
									tabSystem: true
								},
								{
									color: "cal_project",
									words: ["Project"],
									tabSystem: true
								},
								{
									color: "cal_paper",
									words: ["Report", "Essay", "Paper"],
									tabSystem: true
								},
								{
									color: "cal_quiz",
									words: ["Quiz"],
									tabSystem: true
								},
								{
									color: "cal_quiz",
									words: ["PopQuiz"],
									tabSystem: false
								},
								{
									color: "cal_test",
									words: ["Test", "Final", "Exam", "Midterm"],
									tabSystem: true
								},
								{
									color: "cal_ica",
									words: ["ICA"],
									tabSystem: true
								},
								{
									color: "cal_lab",
									words: ["Lab", "Study", "Memorize"],
									tabSystem: true
								},
								{
									color: "cal_docid",
									words: ["DocID"],
									tabSystem: true
								},
								{
									color: "cal_hex",
									words: ["Trojun", "Hex"],
									tabSystem: false
								},
								{
									color: "cal_no_hw",
									words: ["NoHW", "None"],
									tabSystem: true
								},
								{
									color: "cal_optional_hw",
									words: ["OptionalHW", "Challenge"],
									tabSystem: true
								},
								{
									color: "cal_prez",
									words: ["Presentation", "Prez"],
									tabSystem: true
								}];
MyHomeworkSpace.Prefixes.matchClass = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
		for (var wordIndex in MyHomeworkSpace.Prefixes.list[prefixIndex].words) {
			if (MyHomeworkSpace.Prefixes.list[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
				return MyHomeworkSpace.Prefixes.list[prefixIndex].color;
			}
		}
	}
	return "cal_no_prefix";
};