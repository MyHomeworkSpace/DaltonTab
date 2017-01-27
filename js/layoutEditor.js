DaltonTab.LayoutEditor = {
	draggingSomething: false,
	dragOffset: { x: 0, y: 0 },
	mouse: { x: 0, y: 0 },

	init: function() {
		$("ul.layoutEditorDropTarget").sortable({
			group: 'layoutEditorDropTarget',
			pullPlaceholder: false,
			// animation on drop
			onDrop: function  ($item, container, _super) {
				/*var $clonedItem = $('<li/>').css({height: 0});
				$item.before($clonedItem);
				$clonedItem.animate({'height': $item.height()});

				$item.animate($clonedItem.position(), function  () {
					$clonedItem.detach();*/
					_super($item, container);
				//});
				DaltonTab.mustUpdateSectionPositions = true;
			},

			// set $item relative to cursor position
			onDragStart: function ($item, container, _super) {
				var offset = $item.offset(),
				pointer = container.rootGroup.pointer;

				adjustment = {
					left: pointer.left - offset.left,
					top: pointer.top - offset.top
				};

				_super($item, container);
			},
			onDrag: function ($item, position) {
				$item.css({
					left: position.left - adjustment.left,
					top: position.top - adjustment.top
				});
			}
		});

		$("body").keyup(function(e) {
			if (e.keyCode == 27) { // escape key
				if (!$("#layoutEditorOverlay").hasClass("hidden")) {
					DaltonTab.LayoutEditor.close();
				}
			}
		});

		$("#layoutEditorClose").click(function() {
			DaltonTab.LayoutEditor.close();
		});
	},
	open: function() {
		DaltonTab.mustUpdateSectionPositions = false;

		$("#layoutEditorOverlay").removeClass("hidden");

		$("#topSection #mainRow").addClass("hidden");
		$("#imageInfo").addClass("hidden");
		$("#hwButton").addClass("hidden");
		$("#aboveTop").addClass("hidden");
	},
	close: function() {
		if (DaltonTab.mustUpdateSectionPositions) {
			// update section stuff
			var newOrder = [];
			$("#layoutEditorSections li").each(function() {
				var section = $(this).attr("data-section");
				newOrder.push(section);
			});
			DaltonTab.SectionHandler.updateOrder(newOrder, function() {
				chrome.storage.sync.set({
					sections: newOrder
				}, function() {
					DaltonTab.SectionHandler.createSections();
				});
			});
		}

		$("#layoutEditorOverlay").addClass("hidden");

		$("#topSection #mainRow").removeClass("hidden");
		$("#imageInfo").removeClass("hidden");
		$("#hwButton").removeClass("hidden");
		$("#aboveTop").removeClass("hidden");

		$("body").removeClass("frozen");
	}
};