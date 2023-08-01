/**
 * @typedef {Object | "none"} AppraisalData
 * @property {string} grade
 * @property {string} type
 * @property {string} comment
 *
 * @typedef {Object} Subject
 * @property {number} number
 * @property {string} name
 * @property {string} homework
 * @property {AppraisalData} appraisal
 * 
 * @typedef {Object} Day
 * @property {string} date
 * @property {Subject[]} subjects
 */



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

// background.js
// background.js

// Function to check if the current URL contains "youtube"
function checkForYouTubeURL(url) {
  return url.includes('e-journal.iea.gov.ua');
}
var ischanged = []

function getCurrentURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const currentURL = tabs[0].url;
      console.log('Current URL:', currentURL);

      if (checkForYouTubeURL(currentURL)) {
        ischanged.push(false)

      } else {
        ischanged.push(true)

      }
    }
  });
}



let activeTabId = -1;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.status === "loaded") {
    /**
     * @type {Day[]}
     */
    let days = message.data;
    getCurrentURL()
    console.log(ischanged)
    if (ischanged[ischanged.length - 1] == true) {
      ischanged = []            // not sure if this resets the whole thing
      collectingState = "idle";// not sure if this resets the whole thing
      pagesCollected = 0;// not sure if this resets the whole thing
      collectedMonths = [];// not sure if this resets the whole thing
      collectedWeeks = [];// not sure if this resets the whole thing
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { violation: "violation" });
      });
      return
    }
    function goForward() {
      chrome.tabs.update({ url: 'https://e-journal.iea.gov.ua' + message.forwardLink, active: false });
    }
    function goBack() {
      chrome.tabs.update({ url: 'https://e-journal.iea.gov.ua' + message.backLink, active: false });
    }


    switch (collectingState) {
      case "idle":
        break;

      case "initializing":
        if (message.empty) {
          collectingState = "going backward";
          goBack();
        } else {
          collectingState = "going forward";
          goForward();
        }
        break;

      case "going forward":
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
        if (message.empty && days[0].date[4] == '8') {
          //if (++temp == 6) {
          collectingState = "idle";
          collectedMonths = [];
          let currentMonth = [], weeksCollected = 0;
          while (collectedWeeks.length) {
            collectedWeeks.pop().forEach(day => currentMonth.push(day));
            if (++weeksCollected >= 4) {
              collectedMonths.push(currentMonth);
              currentMonth = [];
              weeksCollected = 0;
            }
          }
          if (currentMonth.length) collectedMonths.push(currentMonth);
          temp = 0
          chrome.tabs.create({ url: chrome.runtime.getURL('diary.html') });
          break;
        }
        collectedWeeks.push(days);
        goBack();

    }

    /*
 
    var forward = message.forwardLink;
    console.log(wasPressed[wasPressed.length - 1]);
 
    function openURL(url) {
      chrome.tabs.update({ url: url, active: false });
    }
 
    openURL('https://e-journal.iea.gov.ua' + forward);
 
    */
    /*
        }
        if (collectedData.length === 4) {
          console.log(collectedData);
          console.log(collectedDataRes)
    
          collectedDataRes.push(collectedData);
          collectedData = [];
    
        }
    */
  }
  if (message.status == "loadedDiary") {
    if (sender.origin && sender.origin.slice(19) == chrome.runtime.id) sendResponse({
      data: collectedMonths,
      dataType: "months",
    });
    console.log(collectedMonths)
  }
});

var temp = 0
