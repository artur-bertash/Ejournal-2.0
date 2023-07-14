
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });



});

var collectingState = 0; // 0=idle   1=looking for end/empty   2=getting last 4
var pagesCollected = 0;
var collectedDataRes = []
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
  collectingState = 1;
  // Perform any additional actions you need
  // Sending a message to content.js
  //chrome.runtime.sendMessage({ action: "executeFunction" });
  //function openURL(url) {
  //  chrome.tabs.update({ url, active: false });
  //}
  // Example usage
  //const targetURL = 'https://www.example.com';
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
  if (message.status === "loaded") {
    function goForward() {
      chrome.tabs.update({ url: 'https://e-journal.iea.gov.ua' + message.forwardLink, active: false });
    }
    function goBack() {
      chrome.tabs.update({ url: 'https://e-journal.iea.gov.ua' + message.backLink, active: false });
    }


    switch (collectingState) {
      case 0: // idle
        break;

      case 1: // looking for end/empty
        if (message.empty) {
          collectingState = 2;
          pagesCollected = 0;
          goBack();
        } else goForward();
        break;

      case 2: // getting last 4
        collectedData.push(JSON.parse(message.data));
        if (++pagesCollected < 4) goBack();
        else collectingState = 0;


      /*
  
      var forward = message.forwardLink;
      console.log(wasPressed[wasPressed.length - 1]);
  
      function openURL(url) {
        chrome.tabs.update({ url: url, active: false });
      }
  
      openURL('https://e-journal.iea.gov.ua' + forward);
  
      */

    }
    if (collectedData.length === 4) {
      console.log(collectedData);
    }

  }
});


