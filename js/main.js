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

$(document).ready(function() {
	$(window).scroll(function() {
		if ($(window).scrollTop() >= 20) {
			$("#hwButton").attr("href", "#topFiller");
			$("#hwButton").addClass("flipped");
			$("#settingsButton").addClass("visible");
		} else {
			$("#hwButton").attr("href", "#sectionContainer");
			$("#hwButton").removeClass("flipped");
			$("#settingsButton").removeClass("visible");
		}
	});
	$("#hwButton").smoothScroll();

	$("#settingsButton, #settingsPaneClose, #manageOverlay").click(function() {
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
			$("#hwButton").addClass("hidden");
		}
	});

	DaltonTab.SectionHandler.init(function() {
		DaltonTab.SectionHandler.updateSectionLists();
		DaltonTab.SectionHandler.createSections();
	});

	DaltonTabBridge.default.init();

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
