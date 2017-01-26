DaltonTab.SectionHandler = {
	defaultOrder: ["myhomeworkspace", "schedule", "classes"],
	order: [],
	available: [],
	init: function(callback) {
		chrome.storage.sync.get("sections", function(storage) {
			var order = undefined;
			if (storage.sections == undefined) {
				// use the default order
				order = DaltonTab.SectionHandler.defaultOrder;
			} else {
				// use the stored order
				order = storage.sections;
			}
			DaltonTab.SectionHandler.updateOrder(order, callback);
		});
	},
	createSections: function() {
		$("#sectionContainer").text("");

		// create the html containers
		for (var sectionIndex in DaltonTab.SectionHandler.order) {
			var section = DaltonTab.Sections[DaltonTab.SectionHandler.order[sectionIndex]];
			var $section = $('<div class="section container-fluid"></div>');
				$section.attr("id", "section-" + sectionIndex);
				$section.css("background-color", section.background);
				var $header = $('<h1></h1>');
					var $icon = $('<i class="fa"></i>');
						$icon.addClass(section.icon);
					$header.append($icon);
					$header.append(" " + section.name);
				$section.append($header);
				$section.append(section.createHtml());
			$("#sectionContainer").append($section);
		}

		// run the sections
		for (var sectionIndex in DaltonTab.SectionHandler.order) {
			var section = DaltonTab.Sections[DaltonTab.SectionHandler.order[sectionIndex]];
			section.run();
		}
	},
	updateOrder: function(newOrder, callback) {
		DaltonTab.SectionHandler.order = newOrder;
		DaltonTab.SectionHandler.available = [];
		for (var section in DaltonTab.Sections) {
			if (newOrder.indexOf(section) == -1) {
				// it's not used, so it's available
				DaltonTab.SectionHandler.available.push(section);
			}
		}
		callback();
	},
	updateSingleSectionList: function($list, sections) {
		$list.text("");
		for (var section in sections) {
			var sectionObj = DaltonTab.Sections[sections[section]];
			var $section = $('<li class="layoutEditorSection"></li>');
				var $icon = $('<i class="fa"></i>');
					$icon.addClass(sectionObj.icon);
				$section.append($icon);
				$section.append(" " + sectionObj.name);
				$section.attr("data-section", sections[section]);
			$list.append($section);
		}
	},
	updateSectionLists: function() {
		DaltonTab.SectionHandler.updateSingleSectionList($("#layoutEditorSections"), DaltonTab.SectionHandler.order);
		DaltonTab.SectionHandler.updateSingleSectionList($("#layoutEditorUnusedSections"), DaltonTab.SectionHandler.available);
	}
};
