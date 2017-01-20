DaltonTab.Survey = {
	responses: {},

	questionIndex: 0,
	questions: [
		{
			type: "text",
			text: "What do you like about DaltonTab?",
			key: "like"
		},
		{
			type: "text",
			text: "What don't you like about DaltonTab?",
			key: "dislike"
		},
		{
			type: "text",
			text: "If you could add or change one thing about DaltonTab, what would it be?",
			key: "change"
		},
		{
			type: "text",
			text: "Anything else?",
			key: "other"
		},
		{
			type: "optin",
			key: "response"
		}
	],

	init: function() {
		$("#surveyPrompt").click(function() {
			DaltonTab.Survey.responses = {};
			DaltonTab.Survey.questionIndex = 0;
			DaltonTab.Survey.updateQuestionDisplay();
			$("#surveyModal").modal({
				backdrop: "static",
				keyboard: false
			});
		});

		$("#surveyCancel").click(function() {
			if (confirm("Are you sure? You will lose your progress!")) {
				$("#surveyModal").modal("hide");
			}
		});

		$("#surveyPromptLater").click(function() {
			chrome.storage.sync.set({
				surveyTabCount: "60"
			}, function() {
				$("#surveyPromptContainer").hide();
			});
		});

		$("#surveyPromptBlock").click(function() {
			chrome.storage.sync.set({
				surveyTabCount: "-1"
			}, function() {
				$("#surveyPromptContainer").hide();
			});
		});

		$("#surveyBack").click(function() {
			DaltonTab.Survey.saveQuestion();
			DaltonTab.Survey.advanceQuestion(-1);
			DaltonTab.Survey.updateQuestionDisplay();
		});

		$("#surveyNext").click(function() {
			DaltonTab.Survey.saveQuestion();
			DaltonTab.Survey.advanceQuestion(1);
			DaltonTab.Survey.updateQuestionDisplay();
		});

		$("input[name=surveyOptInResponse]").change(function() {
			if ($(this).val() == "true" && $(this).prop("checked")) {
				$("#surveyOptInEmail").show();
			} else {
				$("#surveyOptInEmail").hide();
			}
		});

		chrome.storage.sync.get("surveyTabCount", function(storage) {
			// yes, this is not atomic, and it is a race condition or something like that if you open two tabs at the same time
			// however:
			// a) there is no atomic chrome storage api
			//    (you have to get and set as separate things)
			//    (google why do you do this)
			// b) it's ok if this isn't accurate to the exact tab count
			var count = 0;
			if (storage.surveyTabCount) {
				count = parseInt(storage.surveyTabCount);
			}
			if (count == -1 || count == -2) {
				// no survey for you
				return;
			}
			if (!navigator.onLine) {
				// no internet
				return;
			}
			count += 1;
			// store the updated count
			chrome.storage.sync.set({
				surveyTabCount: count
			}, function() {
				// act on the count
				if (count > 80) {
					// show it
					$("#surveyPromptContainer").show();
				}
			});
		});
	},

	advanceQuestion: function(by) {
		var currentQuestion = DaltonTab.Survey.questions[DaltonTab.Survey.questionIndex];

		// can we advance?
		if (currentQuestion.type == "optin") {
			if ($("input[name=surveyOptInResponse]:checked").val() == "true") {
				// did the user enter an email?
				if ($("#surveyEmail").val().trim() == "") {
					alert("You must enter your email if you want a response!");
					return;
				}
				// is it valid?
				if (!$("#surveyEmail")[0].checkValidity()) {
					alert("Invalid email address!");
					return;
				}
			}
		}

		// we can!

		DaltonTab.Survey.questionIndex += by;

		if (DaltonTab.Survey.questionIndex == DaltonTab.Survey.questions.length) {
			$("#surveyControls").addClass("hidden");
			$("#surveySubmittionLoading").removeClass("hidden");
			$("input[name=surveyOptInResponse]").prop("disabled", true);
			$("#surveyEmail").prop("disabled", true);

			$.post("https://daltontabservices.myhomework.space/v1/survey.php", DaltonTab.Survey.responses).done(function(response) {
				$("#surveyControls").removeClass("hidden");
				$("#surveySubmittionLoading").addClass("hidden");
				$("input[name=surveyOptInResponse]").prop("disabled", false);
				$("#surveyEmail").prop("disabled", false);

				if (DaltonTab.Survey.responses.response != "true") {
					$("#surveyThanksResponse").hide();
				} else {
					$("#surveyThanksResponse").show();
				}

				chrome.storage.sync.set({
					surveyTabCount: "-2"
				}, function() {
					$("#surveyModal").modal("hide");
					$("#surveyThanksModal").modal();

					$("#surveyPromptContainer").hide();
				});
			}).fail(function(response) {
				$("#surveyControls").removeClass("hidden");
				$("#surveySubmittionLoading").addClass("hidden");
				$("input[name=surveyOptInResponse]").prop("disabled", false);
				$("#surveyEmail").prop("disabled", false);

				console.warn("Survey submission failed!");
				console.warn(response);

				alert("Failed to submit your answers! Are you connected to the internet?");
				DaltonTab.Survey.questionIndex--;
			});
			return;
		}
		if (DaltonTab.Survey.questionIndex < 0) {
			DaltonTab.Survey.questionIndex = 0;
		}
	},

	saveQuestion: function() {
		var currentQuestion = DaltonTab.Survey.questions[DaltonTab.Survey.questionIndex];

		if (currentQuestion.type == "text") {
			DaltonTab.Survey.responses[currentQuestion.key] = $("#surveyTextResponse").val();
		} else if (currentQuestion.type == "optin") {
			DaltonTab.Survey.responses[currentQuestion.key] = $("input[name=surveyOptInResponse]:checked").val();
			DaltonTab.Survey.responses[currentQuestion.key + "-email"] = $("#surveyEmail").val();
		}
	},

	updateQuestionDisplay: function() {
		var currentQuestion = DaltonTab.Survey.questions[DaltonTab.Survey.questionIndex];
		if (!currentQuestion) {
			return;
		}
		if (DaltonTab.Survey.questionIndex == 0) {
			$("#surveyBack").hide();
		} else {
			$("#surveyBack").show();			
		}
		if (DaltonTab.Survey.questionIndex == (DaltonTab.Survey.questions.length - 1)) {
			$("#surveyNext").html("Finish &rarr;");
		} else {
			$("#surveyNext").html("Next &rarr;");			
		}
		if (currentQuestion.type == "text") {
			$("#surveyQuestion").show();
			$("#surveyQuestion").text(currentQuestion.text);
			var response = "";
			if (DaltonTab.Survey.responses[currentQuestion.key]) {
				response = DaltonTab.Survey.responses[currentQuestion.key];
			}
			$("#surveyTextResponse").val(response);
			$("#surveyTextResponse").show();
			$("#surveyOptInQuestion").hide();
		} else if (currentQuestion.type == "optin") {
			$("#surveyQuestion").hide();
			$("#surveyTextResponse").hide();
			$("#surveyOptInQuestion").show();
			var response = "false";
			if (DaltonTab.Survey.responses[currentQuestion.key]) {
				response = DaltonTab.Survey.responses[currentQuestion.key];
			}
			$("input[name=surveyOptInResponse]").prop("checked", false);
			$("#surveyOptInResponse-" + response).prop("checked", true);
			$("#surveyOptInResponse-true").change();
		}

		$("#surveyTitle").text("Question " + (DaltonTab.Survey.questionIndex + 1) + " of " + DaltonTab.Survey.questions.length);
	}
}