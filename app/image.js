import { render, h } from "preact";

import ajax from "ajax.js";

import ImageInfoBar from "main/ImageInfoBar.jsx";

var colors = [];

var imageLoading = true;
var currentImage;
var imageInfoBarVisible = true;

export default {
	getSectionBackground: function(index, fallback) {
		var colorIndex = index;
		if (colorIndex >= colors.length) {
			colorIndex = colorIndex % colors.length;
		}
		var color = (colors[colorIndex] || fallback);
		if (color[0] == "#") {
			var r = parseInt(color.substr(1, 2), 16);
			var g = parseInt(color.substr(3, 2), 16);
			var b = parseInt(color.substr(5, 2), 16);
			return "rgba(" + r + "," + g + "," + b + ",0.9)";
		}
		return color;
	},

	renderImageInfoBar: function() {
		render(h(ImageInfoBar, {
			visible: imageInfoBarVisible,
			loading: imageLoading,
			image: currentImage
		}), null, document.querySelector(".imageInfoBar"));

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
	},

	setImage: function(newImage) {
		currentImage = newImage;
	},

	fetchImage: function(channel, callback) {
		colors = [];
		imageLoading = true;
		ajax.request("GET", "https://daltontabservices.myhomework.space/v1/getImage.php?channel=" + channel, {}, function(image) {
			colors = image.colors;

			imageLoading = false;

			callback(image);
		});
	}
};