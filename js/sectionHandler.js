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
	createSections: function(shouldUpdate) {
		var storageKeys = [];
		DaltonTab.SectionHandler.order.forEach(function(sectionName) {
			var section = DaltonTabBridge.default.sections[sectionName];
			storageKeys = storageKeys.concat(section.storage);
		});
		chrome.storage.sync.get(storageKeys, function(storage) {
			DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.SectionContainer, {
				sections: DaltonTab.SectionHandler.order,
				openModal: DaltonTabBridge.default.openModal,
				storage: storage
			}), null, document.querySelector(".sectionContainer"));
		});
	},
	updateColors: function() {
		DaltonTab.SectionHandler.createSections();
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
