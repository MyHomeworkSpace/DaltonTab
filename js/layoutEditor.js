DaltonTab.LayoutEditor = {
	draggingSomething: false,
	dragOffset: { x: 0, y: 0 },
	mouse: { x: 0, y: 0 },

	init: function() {
		$("body").on("mousemove", function(e) {
			DaltonTab.LayoutEditor.mouse.x = e.clientX;
			DaltonTab.LayoutEditor.mouse.y = e.clientY;
			if (!DaltonTab.LayoutEditor.draggingSomething) {
				return;
			}
			$("li.dragging").css("position", "fixed");
			$("li.dragging").css("z-index", "9999999");
			$("li.dragging").css("left", e.clientX - DaltonTab.LayoutEditor.dragOffset.x + "px");
			$("li.dragging").css("top", e.clientY - DaltonTab.LayoutEditor.dragOffset.y + "px");
		});
		$("#layoutEditorUnusedSections li").on("mousedown", function() {
			$(this).css("width", "127px");
			$(this).css("height", "27px");
			var pos = $(this).offset();

			DaltonTab.LayoutEditor.draggingSomething = true;
			DaltonTab.LayoutEditor.dragOffset.x = DaltonTab.LayoutEditor.mouse.x - pos.left;
			DaltonTab.LayoutEditor.dragOffset.y = DaltonTab.LayoutEditor.mouse.y - pos.top;
			$(this).addClass("dragging");
		}).on("mouseup", function() {
			DaltonTab.LayoutEditor.draggingSomething = false;
			var $dragTarget = $("li.dragging");
			$dragTarget.removeClass("dragging");

			var oldPos = $(this).offset();
			$dragTarget.css("position", "relative");
			$dragTarget.css("top", "0");
			$dragTarget.css("left", "0");

			var newPos = $(this).offset();
			$dragTarget.css("position", "fixed");

			$dragTarget.css("top", oldPos.top + "px");
			$dragTarget.css("left", oldPos.left + "px");
			setTimeout(function() {
				$dragTarget.addClass("animateToPosition");
				$dragTarget.css("top", newPos.top + "px");
				$dragTarget.css("left", newPos.left + "px");

				setTimeout(function() {
					$(".animateToPosition").removeClass("animateToPosition");
					$dragTarget.css("position", "relative");
					$dragTarget.css("top", "0");
					$dragTarget.css("left", "0");
				}, 200);
			}, 0);
		});

		$(".layoutEditorDropTarget").on("mouseover", function() {
			$(this).children("ul").append('<li class="layoutEditorSectionPlaceholder"></li>');
		}).on("mouseleave", function() {
			$(".layoutEditorSectionPlaceholder").remove();
		});
	},
	open: function() {
		$("#layoutEditorOverlay").removeClass("hidden");

		$("#topSection #mainRow").addClass("hidden");
		$("#imageInfo").addClass("hidden");
		$("#hwButton").addClass("hidden");
		$("#aboveTop").addClass("hidden");
	}
};