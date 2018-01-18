DaltonTab = {
	mustUpdateSectionPositions: false,
	Components: {
		Calendar: {},
		Homework: {},
		Other: {},
		Sections: {},
		Settings: {}
	}
};

var hwButtonHref;
var iconButtonsScrollDown;
var hwButtonVisible = true;

var renderIconButtons = function() {
	DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.IconButton, {
		icon: "fa-chevron-circle-down",
		class: "hwButton" + (iconButtonsScrollDown ? " flipped" : "") + (hwButtonVisible ? "": " hidden"),
		href: hwButtonHref,
		scroll: true
	}), null, document.querySelector(".hwButton"));
	DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.IconButton, {
		icon: "fa-gear",
		class: "settingsButton" + (iconButtonsScrollDown ? " visible" : ""),
		onClick: function() {
			$("#settingsPaneClose").click();
		}
	}), null, document.querySelector(".settingsButton"));
};

$(document).ready(function() {
	renderIconButtons();

	$(window).scroll(function() {
		if ($(window).scrollTop() >= 20) {
			hwButtonHref = "#topFiller";
			iconButtonsScrollDown = true;
		} else {
			hwButtonHref = "#sectionContainer";
			iconButtonsScrollDown = false;
		}
		renderIconButtons();
	});

	$("#settingsPaneClose, #manageOverlay").click(function() {
		$("#settingsPane").toggleClass("opened");
		$("body").toggleClass("frozen");
	});

	chrome.storage.sync.get("backImgTog", function(storage) {
		if (storage.backImgTog == undefined || !storage.backImgTog) {
			var channel = "normal";
			if (localStorage.nc) {
				console.log("Channel override set, using image channel " + localStorage.nc);
				channel = localStorage.nc;
				localStorage.removeItem("nc");
			}
			DaltonTab.Image.loadCurrentImage(channel);
		} else {
			$("#imageInfoBar").addClass("hidden");
		}
	});

	chrome.storage.sync.get("jumpingArrowTog", function(storage) {
		if (!(storage.jumpingArrowTog == undefined || !storage.jumpingArrowTog)) {
			hwButtonVisible = false;
		}
	});

	DaltonTab.SectionHandler.init(function() {
		DaltonTab.SectionHandler.updateSectionLists();
		DaltonTab.SectionHandler.createSections();
	});

	DaltonTabBridge.default.init();

	DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.feedback.FeedbackControls, {
		openModal: DaltonTabBridge.default.openModal
	}), null, document.querySelector(".feedbackControls"));

	DaltonTab.Clock.init();
	DaltonTab.LayoutEditor.init();
	DaltonTab.Settings.init();

	DaltonTabBridge.default.analytics.ping(function(message) {
		if (message) {
			// there's a message
			chrome.storage.sync.get("dismissedMessages", function(storage) {
				var dismissedMessages = storage.dismissedMessages || [];
				if (!message.campaign || dismissedMessages.indexOf(message.campaign) == -1) {
					$("#frontMessageHeader").text(message.header);
					$("#frontMessageHeader").prepend($('<i class="fa"><i>').addClass(message.icon));
					$("#frontMessageSubtext").text(message.subtext);

					$("#frontMessage").click(function() {
						if (message.type == "url") {
							window.location.href = message.url;
						} else if (message.type == "eoy") {
							DaltonTabBridge.default.openModal("endOfYear");
							setTimeout(function() {
								$(".eoy-email-input").focus();
							}, 500);
						} else {
							if (message.url) {
								// fallback url
								window.location.href = message.url;
							} else {
								alert("To view this message, please update DaltonTab.");
							}
						}
					});

					$("#frontMessageDismiss").click(function() {
						// TODO: ok technically this would be an issue if you were to have multiple tabs open with messages with different campaigns
						// but i don't care
						dismissedMessages.push(message.campaign);
						DaltonTabBridge.default.analytics.getClientID(function(clientID) {
							chrome.storage.sync.set({ dismissedMessages: dismissedMessages }, function() {
								$("#frontMessageContainer").addClass("hidden");
								$.post("https://daltontabservices.myhomework.space/v1/analytics/dismiss.php", {
									clientID: clientID,
									campaign: message.campaign
								}, function() {

								});
							});
						});
						return false;
					});

					if (message.canDismiss) {
						$("#frontMessageSublinks").removeClass("hidden");
					}

					$("#frontMessageContainer").removeClass("hidden");
				} else {
					console.log("Message with campaign " + message.campaign + " ignored because user dismissed it.");
				}
			});
		}
	});

	$('[data-toggle="tooltip"]').tooltip();

	setTimeout(function() {
		$("#loadOverlay").addClass("fade");
		setTimeout(function() {
			$("#loadOverlay").remove();
		}, 300);
	}, 200);
});

window.c = function(obj) {
	// sub-class Component:
	function F() {
		this.state = {};
		preact.Component.call(this);
	}
	var p = F.prototype = new preact.Component;
	// copy our skeleton into the prototype:
	for (var i in obj) {
		if (i === 'getDefaultProps' && typeof obj.getDefaultProps === 'function') {
			F.defaultProps = obj.getDefaultProps() || {};
		} else {
			p[i] = obj[i];
		}
	}
	// restore constructor:
	return p.constructor = F;
};
window.h = preact.h;
