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
MyHomeworkSpace.Prefixes.fallback = {
	background: "#FFD3BD",
	color: "#000000"
};
MyHomeworkSpace.Prefixes.list = [{
									background: "#4c6c9b",
									color: "#FFFFFF",
									words: ["HW", "Read", "Reading"],
									tabSystem: true
								},
								{
									background: "#9ACD32",
									color: "#FFFFFF",
									words: ["Project"],
									tabSystem: true
								},
								{
									background: "#FFD700",
									color: "#FFFFFF",
									words: ["Report", "Essay", "Paper"],
									tabSystem: true
								},
								{
									background: "#ffa500",
									color: "#FFFFFF",
									words: ["Quiz"],
									tabSystem: true
								},
								{
									background: "#ffa500",
									color: "#FFFFFF",
									words: ["PopQuiz"],
									tabSystem: false
								},
								{
									background: "#DC143C",
									color: "#FFFFFF",
									words: ["Test", "Final", "Exam", "Midterm"],
									tabSystem: true
								},
								{
									background: "#2ac0f1",
									color: "#FFFFFF",
									words: ["ICA"],
									tabSystem: true
								},
								{
									background: "#2af15e",
									color: "#FFFFFF",
									words: ["Lab", "Study", "Memorize"],
									tabSystem: true
								},
								{
									background: "#003DAD",
									color: "#FFFFFF",
									words: ["DocID"],
									tabSystem: true
								},
								{
									background: "#000000",
									color: "#00FF00",
									words: ["Trojun", "Hex"],
									tabSystem: false
								},
								{
									background: "#fcf8e3",
									color: "#000000",
									words: ["NoHW", "None"],
									tabSystem: true
								},
								{
									background: "#5000BC",
									color: "#FFFFFF",
									words: ["OptionalHW", "Challenge"],
									tabSystem: true
								},
								{
									background: "#000099",
									color: "#FFFFFF",
									words: ["Presentation", "Prez"],
									tabSystem: true
								},
								{
									background: "#123456",
									color: "#FFFFFF",
									words: ["BuildSession", "Build"],
									tabSystem: true
								}];
MyHomeworkSpace.Prefixes.matchPrefix = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
		for (var wordIndex in MyHomeworkSpace.Prefixes.list[prefixIndex].words) {
			if (MyHomeworkSpace.Prefixes.list[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
				return MyHomeworkSpace.Prefixes.list[prefixIndex];
			}
		}
	}
	return MyHomeworkSpace.Prefixes.fallback;
};