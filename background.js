
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });



});

var wasPressed = [false]
const collectedData = []
// Listening for messages in background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "The smart-button was pressed") {
    // Run your desired function here
    myFunction();
  }
});

function myFunction() {
  // Your code here
  console.log("The function starts to work");
  // Perform any additional actions you need
  // Sending a message to content.js
  //chrome.runtime.sendMessage({ action: "executeFunction" });
  function openURL(url) {
    chrome.tabs.update({ url, active: false });
  }
  wasPressed.push(true)
  // Example usage
  const targetURL = 'https://www.example.com';
  //openURL(targetURL);
  //openURL(targetURL);
  //openURL(targetURL);


}


//loadconfig: function() {
//ar xhr = new XMLHttpRequest();
//xhr.onreadystatechange = function () {
//if (xhr.readyState === 4) {
//console.log('we got the file', xhr.response);
//}
//};
//xhr.open('GET', chrome.extension.getURL('diary.json'), true)
//}






// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.status === "loaded" && wasPressed[wasPressed.length - 1] === true) {
    console.log("Page loaded!");

    var forward = message.forwardLink;
    console.log(wasPressed[wasPressed.length - 1]);

    function openURL(url) {
      chrome.tabs.update({ url: url, active: false });
    }

    openURL('https://e-journal.iea.gov.ua' + forward);




  }
});





