DaltonTab.Sections = {
	myhomeworkspace: {
		name: "Homework",
		icon: "fa-file",
		description: "View your homework information from MyHomeworkSpace.",
		background: "rgba(60, 77, 99, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Homework, {}), null, $html[0]);
			return $html;
		},
		run: function() {
			
		}
	},
	schedule: {
		name: "Calendar",
		icon: "fa-calendar",
		description: "View your calendar from MyHomeworkSpace.",
		background: "rgba(121, 70, 26, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Calendar, {}), null, $html[0]);
			return $html;
		},
		run: function() {
			
		}
	},
	classes: {
		name: "Classes",
		icon: "fa-list",
		description: "View and access your classes.",
		background: "rgba(57, 146, 108, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Classes, {}), null, $html[0]);
			return $html;
		},
		run: function() {

		}
	},
	weather: {
		name: "Weather",
		icon: "fa-sun-o",
		description: "View the current weather.",
		background: "rgba(14, 100, 18, 0.9)",
		createHtml: function() {
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.Weather, {
					openModal: DaltonTabBridge.default.openModal
				}), null, $html[0]);
			return $html;
		},
		run: function() {
			
		}
	},
	tabCount: {
		name: "Tab Count",
		icon: "fa-clone",
		description: "Count the number of tabs that you open in a day",
		background: "rgba(0, 140, 186, 0.9)",
		createHtml: function(){
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.TabCount, {}), null, $html[0]);
			return $html;
		},
		run: function(){
			
		}
	}/*,
	lunchMenu: {
		name: "Lunch Menu",
		icon: "fa-file-text-o",
		description: "Displays the lunch menu for the day.",
		background: "rgba(0, 140, 186, 0.9)",
		createHtml: function(){
			var $html = $("<div></div>");
				DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.sections.LunchMenu, {}), null, $html[0]);
			return $html;
		},
		run: function(){
			
		}
	}*/
};
