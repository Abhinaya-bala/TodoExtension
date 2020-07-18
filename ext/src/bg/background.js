// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

var tasks = [{ name: "taskname", isCompleted: true, remindOn: 0 }]

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // First, validate the message's structure.

  console.log("am called", msg)

});

// chrome.extension.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

function saveInLocalStorage(tasks) {
  chrome.storage.local.set({ tasks }, function () {
    console.log('Value is set to ' + value);
  });
}

function getFromLocalStorage() {
  chrome.storage.local.get(['tasks'], function (result) {
    console.log('Value currently is ' + result.key);
  });
}









