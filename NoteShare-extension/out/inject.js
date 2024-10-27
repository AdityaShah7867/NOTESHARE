chrome && chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "SEND_TOKEN") {
    //  console.log("token",request.token) // Notify the React app that the token is ready
     localStorage.setItem("userToken",request.token);
     // contentScript.js
chrome.runtime.sendMessage({
    userToken: request.token
  });
  
    }
  });
// content-script.js
window.addEventListener('message', (event) => {
  // console.log(event.data.name)
  if (event.source !== window || !event.data.action) return;
// console.log("listening to receive message")
  if (event.data.action === 'sendUrlsToExtension') {
    chrome.runtime.sendMessage({ action: 'openTabs', urls: event.data.urls,name:event.data.name }, (response) => {
      if (response && response.status) {
        // console.log('Tabs opened:',event.data.urls);
      } else {
        console.error('Failed to open tabs');
      }
    });
  }
});
