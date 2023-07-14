
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });



});

function parseDate(string) {
  const [day, monthName] = string.trim().slice(string.indexOf(' ') + 1).split(' ');
  const month = [
    "січня", "лютого", "березня",
    "квітня", "травня", "червня",
    "липня", "серпня", "вересня",
    "жовтня", "листопада", "грудня",
  ].indexOf(monthName) + 1;
  return month == 0 ? "err" : `${day.padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
}

/**
 * @type {"idle" | "initializing" | "going forward" | "going backward" | "collecting"}
 */
var collectingState = "idle";
var pagesCollected = 0;
var collectedMonths = [];
var collectedWeeks = [];


function isListIn2DArray(list, array2D) {
  return array2D.some(row => row.length === list.length && row.every((value, index) => value === list[index]));
}
// Listening for messages in background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "The smart-button was pressed") {
    // Run your desired function here
    myFunction();
  }
});

function myFunction() {
  // Your code here
  if (collectingState != "idle") return;
  console.log("The function starts to work");
  collectingState = "initializing";
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

    console.log('reloaded')

    switch (collectingState) {
      case "idle":
        break;

      case "initializing":
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { addOverlay: "Add overlay" });
        });
        if (message.empty) {
          collectingState = "going backward";
          goBack();
        } else {
          collectingState = "going forward";
          goForward();
        }

        break;

      case "going forward":
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { addOverlay: "Add overlay" });
        });
        if (message.empty) {
          collectingState = "collecting";
          pagesCollected = 0;
          goBack();
        } else goForward();
        break;

      case "going backward":
        if (message.empty) {
          goBack();
          break;
        }
        collectingState = "collecting";

      case "collecting":
        if (message.empty && parseDate(message.data[0][0])[4] == '8') {
          collectingState = "idle";
          collectedMonths = [];
          let currentMonth = [];
          while (collectedWeeks.length) {
            currentMonth.push(collectedWeeks.pop());
            if (currentMonth.length >= 4) {
              collectedMonths.push(currentMonth);
              currentMonth = [];
            }
          }
          if (currentMonth.length) collectedMonths.push(currentMonth);
          break;
        }
        collectedWeeks.push(message.data);
        goBack();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { addOverlay: "Add overlay" });
        });

    }


  }
});


