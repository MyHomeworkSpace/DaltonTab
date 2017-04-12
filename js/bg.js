function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({
        url: "./etc/setup.html"
    });
}
install_notice();

chrome.tabs.onCreated.addListener(function() {
    var today = new Date().getDay();
    chrome.storage.sync.get("lastDate", function(dateResponse) {
        chrome.storage.sync.get("tabCount", function(response) {
            if (dateResponse.lastDate == today) {
                var tabCountLocal = response.tabCount;
                if (!tabCountLocal) {
                    tabCountLocal = 1;
                } else {
                    tabCountLocal++;
                }
                chrome.storage.sync.set({tabCount: tabCountLocal}, function(){});
            } else {
                chrome.storage.sync.set({tabCount: 1}, function(){});
                chrome.storage.sync.set({lastDate: today}, function(){});
            }
        });
    });
});