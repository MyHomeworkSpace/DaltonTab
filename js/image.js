DaltonTab.Image = {
	colors: [],

	getSectionBackground: function(index, fallback) {
		var colorIndex = index;
		if (colorIndex >= DaltonTab.Image.colors.length) {
			colorIndex = colorIndex % DaltonTab.Image.colors.length;
		}
		var color = (DaltonTab.Image.colors[colorIndex] || fallback);
		if (color[0] == "#") {
			var r = parseInt(color.substr(1, 2), 16);
			var g = parseInt(color.substr(3, 2), 16);
			var b = parseInt(color.substr(5, 2), 16);
			return "rgba(" + r + "," + g + "," + b + ",0.9)";
		}
		return color;
	},

	loadCurrentImage: function(channel) {
		DaltonTab.Image.colors = [];
		$.get("https://daltontabservices.myhomework.space/v1/getImage.php?channel=" + channel, function(data) {
			var image = JSON.parse(data);
			$("#topSection").css("background-image", "url(" + image.imgUrl + ")");
			$("#topSection").addClass("imageLoaded");

			DaltonTab.Image.colors = image.colors;
			DaltonTab.SectionHandler.updateColors();

			var messageBackground = DaltonTab.Image.getSectionBackground(0, "rgba(36,118,145,0.9)");
			var messageBackgroundParts = messageBackground.substr(4).replace("(", "").replace(")", "").split(",").map(function(i) { return parseInt(i.trim()); });
			var messageHoverR = ((messageBackgroundParts[0] - 20) > 0 ? (messageBackgroundParts[0] - 20) : 0);
			var messageHoverG = ((messageBackgroundParts[1] - 20) > 0 ? (messageBackgroundParts[1] - 20) : 0);
			var messageHoverB = ((messageBackgroundParts[2] - 20) > 0 ? (messageBackgroundParts[2] - 20) : 0);
			var messageHover = "rgba(" + messageHoverR + "," + messageHoverG + "," + messageHoverB + ",0.9)";
			// HACK: set the message colors by adding an inline style because there's no easy way to set :hover from js
			var messageStyle = "";
			messageStyle += "#frontMessage, #frontMessageSublinks { background-color: " + messageBackground + "; } ";
			messageStyle += "#frontMessage:hover { background-color: " + messageHover + "; }";
			var $messageStyle = $("<style></style>");
				$messageStyle.html(messageStyle);
			$("body").append($messageStyle);

			if (!image.description) {
				$("#imageDesc").text("");
			} else {
				$("#imageDesc").text(image.description);
			}

			$("#imageAuthor").attr("href", image.authorUrl);
			$("#imageAuthor").text(image.authorName);

			$("#imageSite").attr("href", image.siteUrl);
			$("#imageSite").text(image.siteName);

			$("#imageDesc").removeClass("loading");
			$("#imageSubDesc").removeClass("hidden");
		});
	}
};