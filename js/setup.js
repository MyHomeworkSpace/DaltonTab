$(document).ready(function() {
	$("#mhsSignin").click(function() {
		window.location.href = MyHomeworkSpace.getAuthURL();
	});
});