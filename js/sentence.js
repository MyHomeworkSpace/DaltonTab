$(document).ready(function() {
    var nextWeekday = moment().add(1, "day").format("YYYY-MM-DD");
    var nextDayName = "tomorrow";
    var sentenceContainer = $('#sentenceContainer');
    if(moment(nextWeekday).isoWeekday() == 6 || moment(nextWeekday).isoWeekday() == 7) {
        nextWeekday = moment().day(8).format("YYYY-MM-DD");
        nextDayName = "Monday"
    }
    console.log(nextWeekday)
    chrome.storage.sync.get("mhsToken", function(storage) {
        var token = storage["mhsToken"] || "";
        MyHomeworkSpace.get(token, "homework/getHWView", {}, function(data) {
            if (data.status == "ok") {
                var assignmentsDue = 0;
                var assignmentsDone = 0;
                for(var i in data.homework){
                    var assignment = data.homework[i];
                    if (assignment.due == nextWeekday){
                        assignmentsDue++;
                        if(assignment.complete == 1) {
                            assignmentsDone++;
                        }
                    }
                }
                chrome.storage.sync.get("name", function(response) {
                    var name = response.name;
                    var sentence;
                    if (moment().isoWeekday() == 5) {
                        mondayDate = moment().day(1).format("YYYY-MM-DD");
                        MyHomeworkSpace.get(token, "/calendar/events/getWeek/" + mondayDate, {}, function(data){
                            var friday = data.friday.index;
                            sentence = "Hi " + name + "! You have " + assignmentsDue + " assignments due " + nextDayName + ". Today is a Friday " + friday + ".";  
                            sentenceContainer.text(sentence);                          
                        })
                    } else if (assignmentsDone > 0) {
                        sentence = "Hi " + name + "! You have " + assignmentsDue + " assignments due " + nextDayName + ". " + assignmentsDone + " of those assignments have been completed.";
                        sentenceContainer.text(sentence);
                    } else if (assignmentsDone == assignmentsDone){
                        sentence = "Hi " + name + "! You have completed all of your assignments due tomorrow. Congrats!";
                        sentenceContainer.text(sentence);                        
                    } else if (assignmentsDue == 0){
                        sentence = "Hi " + name + "! You don't have any assignments due tomorrow. Enjoy your free night!";
                        sentenceContainer.text(sentence);
                    } else {
                        sentence = "Hi " + name + "! You have " + assignmentsDue + " assignments due " + nextDayName + ".";
                        sentenceContainer.text(sentence);
                    }
                })
            } else {
                console.log("Failed to get homework for Sentence. API call returned status" + data.status)
            }
        });
    });
});

