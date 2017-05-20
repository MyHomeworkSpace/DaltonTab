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

			var backgroundImageVibrant = document.createElement('img');
			backgroundImageVibrant.setAttribute('src', image.imgUrl);
			backgroundImageVibrant.addEventListener('load', function(){
				var vibrant = new Vibrant(backgroundImageVibrant);
				var swatches = vibrant.swatches();
				for (var swatch in swatches){
					if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
						DaltonTab.Image.colors.push(swatches[swatch].getHex());
					}
				}
				DaltonTab.SectionHandler.updateColors();
			});

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