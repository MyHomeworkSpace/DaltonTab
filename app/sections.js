import Calendar from "sections/calendar/Calendar.jsx";
import Classes from "sections/classes/Classes.jsx";
import Homework from "sections/homework/Homework.jsx";
import LunchMenu from "sections/lunchMenu/LunchMenu.jsx";
import TabCount from "sections/tabCount/TabCount.jsx";
import Weather from "sections/weather/Weather.jsx";

export default {
	defaultOrder: ["myhomeworkspace", "schedule", "classes"],
	myhomeworkspace: {
		name: "Homework",
		icon: "fa-file",
		description: "View your homework information from MyHomeworkSpace.",
		background: "rgba(60, 77, 99, 0.9)",
		storage: [],
		component: Homework
	},
	schedule: {
		name: "Calendar",
		icon: "fa-calendar",
		description: "View your calendar from MyHomeworkSpace.",
		background: "rgba(121, 70, 26, 0.9)",
		storage: [],
		component: Calendar
	},
	classes: {
		name: "Classes",
		icon: "fa-list",
		description: "View and access your classes.",
		background: "rgba(57, 146, 108, 0.9)",
		storage: [],
		component: Classes
	},
	weather: {
		name: "Weather",
		icon: "fa-sun-o",
		description: "View the current weather.",
		background: "rgba(14, 100, 18, 0.9)",
		storage: ["weather", "weatherUnits"],
		component: Weather
	},
	tabCount: {
		name: "Tab Count",
		icon: "fa-clone",
		description: "Count the number of tabs that you open in a day",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: TabCount
	},
	lunchMenu: {
		name: "Lunch Menu",
		icon: "fa-cutlery",
		description: "Displays the lunch menu for the day.",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: LunchMenu
	}
};
