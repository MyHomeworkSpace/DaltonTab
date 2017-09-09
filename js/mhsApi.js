MyHomeworkSpace = {
	basePath: "https://api-v2.myhomework.space/",
	clientID: "PA2QtTk14dimr5jY-W7BlNZKiGuL2HY-zrNQZ3vP16P2XasErsleyOXT",

	getAuthURL: function() {
		return MyHomeworkSpace.basePath + "application/requestAuth/" + MyHomeworkSpace.clientID;
	},

	get: function(token, url, data, callback) {
		$.ajax({
			method: "GET",
			url: MyHomeworkSpace.basePath + url,
			data: data,
			complete: function(data) {
				callback(data.responseJSON);
			},
			headers: {
				Authorization: "Bearer " + token
			}
		});
	},

	post: function(token, url, data, callback) {
		$.ajax({
			method: "POST",
			url: MyHomeworkSpace.basePath + url,
			data: data,
			complete: function(data) {
				callback(data.responseJSON);
			},
			headers: {
				Authorization: "Bearer " + token
			}
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