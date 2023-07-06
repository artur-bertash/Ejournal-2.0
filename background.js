
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });


});


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

  // Example usage
  const targetURL = 'https://www.example.com';
  //openURL(targetURL);


}






