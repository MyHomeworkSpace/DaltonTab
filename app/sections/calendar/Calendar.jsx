import "sections/calendar/Calendar.styl";

import { h, Component } from "preact";
import moment from "moment";

import mhs from "mhs.js";

import MHSConnect from "other/MHSConnect.jsx";

import CalendarEvent from "sections/calendar/CalendarEvent.jsx";

import Loading from "ui/Loading.jsx";

export default class Calendar extends Component {
	componentDidMount() {
		var that = this;
		var token = this.props.storage.mhsToken || "";
		mhs.get(token, "calendar/getStatus", {}, function(statusData) {
			if (statusData.status != "ok") {
				that.setState({
					loaded: true,
					loggedIn: false
				});
				return;
			}
			if (statusData.statusNum != 1) {
				that.setState({
					loaded: true,
					loggedIn: true,
					calendarEnabled: false
				});
				return;
			}

			var mondayDate = moment();
			while (mondayDate.day() != 1) {
				mondayDate.subtract(1, "day");
			}

			that.setState({
				loaded: true,
				loggedIn: true,
				calendarEnabled: true,
				token: token,
				monday: mondayDate,
				loadingWeek: true
			}, function() {
				that.loadCurrentWeek.call(that);
				that.setInitialScroll.call(that);
			});
		});
	}

	setInitialScroll() {
		var time = Math.floor((moment().unix() - moment("00:00:00", "HH:mm:ss").unix()) / 60);
		var scrollPos = time - 150;
		if (scrollPos < 0) {
			scrollPos = 0;
		}
		document.querySelector(".calendarViewport").scrollTop = scrollPos;
	}

	loadCurrentWeek() {
		var that = this;
		this.setState({
			loadingWeek: true,
			weekInfo: null
		}, function() {
			mhs.get(that.state.token, "calendar/getView", {
				start: that.state.monday.format("YYYY-MM-DD"),
				end: moment(that.state.monday).add(7, "days").format("YYYY-MM-DD")
			}, function(data) {
				that.setState({
					loadingWeek: false,
					weekInfo: data
				});
			});
		});
	}

	jumpToday() {
		var mondayDate = moment();
		while (mondayDate.day() != 1) {
			mondayDate.subtract(1, "day");
		}
		this.setState({
			monday: mondayDate
		}, function() {
			this.loadCurrentWeek();
		});
	}

	jumpWeek(amount) {
		var newDate = moment(this.state.monday);
		newDate.add(amount, "week");
		this.setState({
			monday: newDate
		}, function() {
			this.loadCurrentWeek();
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <Loading section="calendar" />;
		}
		if (!state.loggedIn) {
			return <MHSConnect />;
		}
		if (!state.calendarEnabled) {
			return <MHSConnect type="calendar" />;
		}

		var dayHeaders = [];
		var dayContents = [];
		var announcementContents = [];
		var names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

		var currentDay = moment(state.monday);
		var earliestEvent = 1440;
		var latestEvent = 0;

		var allGroupsForDays = {};

		for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
			// create list of all events
			var allEvents = [];

			if (!state.loadingWeek) {
				allEvents = state.weekInfo.view.days[dayNumber].events;
			}

			// group events that occur at same time
			var groupsForDay = [];
			allEvents = allEvents.map(function(eventItem) {
				eventItem.groupInfo = {
					dayStart: moment.unix(eventItem.start).startOf("day"),
					start: moment.unix(eventItem.start),
					end: moment.unix(eventItem.end),
				};
				eventItem.groupInfo.offset = eventItem.groupInfo.start.diff(eventItem.groupInfo.dayStart, "minutes");
				eventItem.groupInfo.durationInMinutes = eventItem.groupInfo.end.diff(eventItem.groupInfo.start, "minutes");
				eventItem.groupInfo.height = (eventItem.groupInfo.durationInMinutes < 10 ? 10 : eventItem.groupInfo.durationInMinutes);
				eventItem.groupInfo.endOffset = eventItem.groupInfo.offset + eventItem.groupInfo.durationInMinutes;
				eventItem.groupInfo.endOffsetHeight = eventItem.groupInfo.offset + eventItem.groupInfo.height;
				return eventItem;
			});
			allEvents.forEach(function(eventItem, eventItemIndex) {
				// if the earliest time we've found so far is after this
				if (earliestEvent > eventItem.groupInfo.offset) {
					// update the earliest event
					earliestEvent = eventItem.groupInfo.offset;
				}

				// if the latest time we've found so far is before this
				if (latestEvent < eventItem.groupInfo.endOffset) {
					// update the latest event
					latestEvent = eventItem.groupInfo.endOffset;
				}

				// find which group this event belongs to
				var foundGroupIndex = -1;
				for (var groupIndex in groupsForDay) {
					var groupToTest = groupsForDay[groupIndex];
					for (var eventIndex in groupToTest) {
						var groupEventToTest = groupToTest[eventIndex];

						if (
							(eventItem.groupInfo.offset <= groupEventToTest.groupInfo.endOffsetHeight) &&
							(groupEventToTest.groupInfo.offset <= eventItem.groupInfo.endOffsetHeight)
						) {
							foundGroupIndex = groupIndex;
							break;
						}
					}
				}

				if (foundGroupIndex != -1) {
					groupsForDay[foundGroupIndex].push(eventItem);
				} else {
					groupsForDay.push([eventItem]);
				}
			});

			allGroupsForDays[dayNumber] = groupsForDay;
		}

		var height = latestEvent - earliestEvent;

		var announcements = [];

		for (dayNumber = 0; dayNumber < 7; dayNumber++) {
			if (!state.loadingWeek) {
				announcements = state.weekInfo.view.days[dayNumber].announcements;
			}

			// make the elements
			var eventElements = [];
			allGroupsForDays[dayNumber].forEach(function(eventGroup) {
				eventGroup.forEach(function(eventItem, eventGroupIndex) {
					eventElements.push(<CalendarEvent
						event={eventItem}
						type={eventItem.type}
						groupIndex={eventGroupIndex}
						groupLength={eventGroup.length}
						earliestEvent={earliestEvent}
					/>);
				});
			});

			announcementContents.push(<div class={`calendarAnnouncements day${dayNumber}`}>
				{announcements.map(function(announcement) {
					return <div>{announcement.text}</div>;
				})}
			</div>);

			dayHeaders.push(h("div", { class: "calendarDayHeader" }, names[dayNumber] + " " + currentDay.format("M/D")));
			dayContents.push(h("div", { class: "calendarDayContents day" + dayNumber, style: "height: " + height + "px" }, eventElements));

			currentDay.add(1, "day");
		}

		return (
			<div class="calendarSection">
				<div class="calendarHeader row">
					<div class="col-md-6 calendarHeaderLeft">
						Week of {state.monday.format("MMMM D, YYYY")}
						<span class="calendarHeaderLoading">{(state.loadingWeek ? " Loading week, please wait..." : "")}</span>
					</div>
					<div class="col-md-6 calendarHeaderRight">
						<button class="btn btn-default" onClick={this.jumpWeek.bind(this, -1)}>
							<i class="fa fa-chevron-left" />
						</button>
						<button class="btn btn-default" onClick={this.jumpToday.bind(this)}>Today</button>
						<button class="btn btn-default" onClick={this.jumpWeek.bind(this, 1)}>
							<i class="fa fa-chevron-right" />
						</button>
					</div>
				</div>
				<div class="calendarWeek">{dayHeaders}</div>
				<div class="calendarViewport" style={"height: " + height + "px"}>
					<div class="calendarWeek">{announcementContents}</div>
					<div class="calendarWeek">{dayContents}</div>
				</div>
			</div>
		);
	}
};