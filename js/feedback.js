window.feedback = {
	url: "https://daltontabservices.myhomework.space/v1/submitFeedback.php"
};

window.feedback.submitFeedback = function(type, message, done, err) {
	DaltonTab.Analytics.getClientID(function(clientID) {
		var version = chrome.runtime.getManifest().version;
		var metadata = {
			clientID: clientID
		};
		$.post(window.feedback.url, {
			type: type,
			message: message,
			version: version,
			metadata: JSON.stringify(metadata)
		}, function(response_str) {
			var response = JSON.parse(response_str);
			if (response.status == "ok") {
				done(response);
			} else {
				err(response);
			}
		});
	});
};

window.feedback.openFeedbackModal = function(type) {
	var desc = "Liked a feature? Found something helpful? Tell us what you like! We'd love to hear it, and your feedback helps us make even better things in the future!";
	if (type == "frown") {
		desc = "Annoyed by something? Found a glitch? Hate how something works? Tell us! We'd love to help you and improve DaltonTab.";
	} else if (type == "idea") {
		desc = "Have an idea for a new feature? Something that helps you? A tweak to make your life easier? Tell us! We'd love to include it and make DaltonTab even better!";
	}

	$("#feedback-modal-title-first").text("Send a ");
	if (type == "idea") {
		$("#feedback-modal-title-first").text("Send an ");
	}
	$(".feedback-type").text(type);
	$(".feedback-desc").text(desc);

	$("#feedback-modal").modal();
};

$(document).ready(function() {
	$(".feedback-btn").click(function() {
		var type = $(this).attr("data-type");
		window.feedback.openFeedbackModal(type);
	});
	$("#feedback-submit").click(function() {
		$(".feedback-footer-normal").addClass("hidden");
		$(".feedback-footer-load").removeClass("hidden");
		window.feedback.submitFeedback($(".feedback-type:first").text(), $("#feedback-msg").val(), function() {
			$(".feedback-footer-load").addClass("hidden");
			$(".feedback-footer-normal").removeClass("hidden");
			$("#feedback-msg").val("");
			$("#feedback-modal").modal("hide");
			swal("Awesome!", "Your feedback has been sent successfully!", "success");
		}, function() {
			alert("There was an unexpected error.");
		});
	});
});
