function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "./etc/setup.html"});
}
install_notice();

chrome.tabs.onCreated.addListener(function(){
    var tabCountLocal = 0;
    chrome.storage.sync.get("tabCount", function(response) {
        tabCountLocal = response.tabCount;
        if (!tabCountLocal) {
            tabCountLocal = 1;
        } else {
            tabCountLocal++;
        }
    });
    chrome.storage.sync.set({tabCount: tabCountLocal}, function(){
        //alert("yay");
    });
});