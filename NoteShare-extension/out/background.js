

chrome && chrome.cookies.onChanged.addListener(async(changeInfo) => {

    if (changeInfo.cookie.name === 'token' && changeInfo.cookie.domain === "staging.newboard.app") {
      // Handle the change for your specific cookie here
      // console.log(changeInfo.cookie.value.length> 0 ? 'user is logged in' : 'user logged out');
     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      // console.log(activeTab)
       chrome.tabs.sendMessage(activeTab.id, {type: "SEND_TOKEN", token: changeInfo.cookie.value});
    });

    chrome.storage.local.set({ userToken: changeInfo.cookie.value }, function() {
        chrome && chrome.storage.local.get('userToken', function(data) {
            // console.log("sto", data.userToken); // Use data.userToken instead of data.token
        });
    })
    }
});


const graphqlEndpoint='https://server.newboard.io/graphql'



// Listener for tab activation (tab switch)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    const tab = await chrome.tabs.get(tabId); 
    chrome.storage.local.get(['defaultWorkspaceId', 'userToken'], function (result) {
        const workspaceId = result.defaultWorkspaceId;
        const token = result.userToken;
        const url = tab.url;

        console.log('Stored Workspace ID:', workspaceId);
        console.log('Stored Token:', token);
        console.log('Active Tab URL:', url);

        // Define the GraphQL query with variables
        const query = `
          query($payload: checkBookMarkExistsData) {
            checkBookMarkExists(payload: $payload)
          }
        `;

        const payload = {
            query: query,
            variables: {
                payload: {
                    url: url, // Use the URL of the active tab
                    workspaceId: workspaceId
                }
            }
        };

        // const graphqlEndpoint = 'http://localhost:8000/graphql'; // Your GraphQL endpoint

        fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token if necessary
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if(data.data.checkBookMarkExists){
                    chrome.action.setIcon({ path: "icons/icons44.png" }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error updating icon:', chrome.runtime.lastError.message);
                        } else {
                            sendResponse({ status: "Icon updated as the url is already present" });
                        }
                    });
                }else{
                    // this is to set to the earlier icon
                    chrome.action.setIcon({ path: "icons/favicon.png" }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('Error updating icon:', chrome.runtime.lastError.message);
                        } else {
                            console.log('Icon updated to original beacuse this is not the link')
                        }
                    });
                }

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
});

// Listener for tab updates (page load or navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only act when the tab is fully loaded
    if (changeInfo.status === 'complete') {
        chrome.storage.local.get(['defaultWorkspaceId', 'userToken'], function (result) {
            const workspaceId = result.defaultWorkspaceId;
            const token = result.userToken;
            const url = tab.url;

            console.log('Stored Workspace ID:', workspaceId);
            console.log('Stored Token:', token);
            console.log('Updated Tab URL:', url);

            // Define the GraphQL query with variables
            const query = `
              query($payload: checkBookMarkExistsData) {
                checkBookMarkExists(payload: $payload)
              }
            `;

            const payload = {
                query: query,
                variables: {
                    payload: {
                        url: url, // Use the URL of the updated tab
                        workspaceId: workspaceId
                    }
                }
            };

            // const graphqlEndpoint = 'http://localhost:8000/graphql'; // Your GraphQL endpoint

            fetch(graphqlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token if necessary
                },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Data fetched:', data);

                    if(data.data.checkBookMarkExists){
                        chrome.action.setIcon({ path: "icons/icons44.png" }, () => {
                            if (chrome.runtime.lastError) {
                                console.error('Error updating icon:', chrome.runtime.lastError.message);
                            } else {
                                sendResponse({ status: "Icon updated as the url is already present" });
                            }
                        });
                    }else{
                        // this is to set to the earlier icon
                        chrome.action.setIcon({ path: "icons/favicon.png" }, () => {
                            if (chrome.runtime.lastError) {
                                console.error('Error updating icon:', chrome.runtime.lastError.message);
                            } else {
                                console.log('Icon updated to original beacuse this is not the link')
                               
                            }
                        });
                    }


                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
    }
});




chrome.storage.local.get('defaultWorkspaceId', function(result) {
    console.log('Stored defaultWorkspaceId:', result.defaultWorkspaceId);
  });


  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Request from extension:', request);
    if (request.action === "bookmarkAdded") {
        console.log(chrome);
        chrome.action.setIcon({ path: "icons/icons44.png" }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error updating icon:', chrome.runtime.lastError.message);
            } else {
                sendResponse({ status: "Icon updated" });
            }
        });

        console.log('settime out staring')
        setTimeout(() => {
            chrome.action.setIcon({ path: "icons/favicon.png" }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error updating icon:', chrome.runtime.lastError.message);
                } else {
                    console.log('icons updated in setTimeout')
                    sendResponse({ status: "Icon updated in setTimeout" });
                }
            });
        }, 3000);
      
        return true; 
    }
});

  




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openTabs') {
        const urls = request.urls;
        let title = request.name;
        // console.log(request.name)
    let tabIds = [];

    // Create tabs and collect their IDs
    urls.forEach((url, index) => {
      chrome.tabs.create({ url }, (tab) => {
        tabIds.push(tab.id);

        // Once all tabs are created, create a tab group
        if (tabIds.length === urls.length) {
            // console.log(title)
          chrome.tabs.group({ tabIds }, (groupId) => {
            // Optionally set the title and color of the group
            chrome.tabGroups.update(groupId, {
              title: title,
              color: 'blue'
            });

            sendResponse({ status: 'Tab group created', groupId });
          });
        }
      });
  });
  }
})
  
