
import browser from "webextension-polyfill";
import metadata from "url-metadata";
import axios from "axios";

// Specific URL and domain for the app
const specificUrl = process.env.NEXT_PUBLIC_APP_URL;

// Function to handle URL processing
async function processUrl(url: string, token: string) {
  try {
    // Fetch metadata using url-metadata
    const metadataResult = await metadata(url as string);

    // Save metadata in browser storage
    await browser.storage.local.set({ metadata: metadataResult });
    console.log(`Metadata for ${url} saved successfully.`);

    // Check if URL exists in the database
    const checkUrlConfig = {
      method: 'get',
      url: `http://localhost:4000/api/v1/urls/get-url-by-id/${encodeURIComponent(url)}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.request(checkUrlConfig);
    const urlData = response.data;

    if (!urlData || !urlData.startedAt) {
      // If URL does not exist or has no startedAt, create a new entry
      const createData = JSON.stringify({
        url: url,
        metadata: JSON.stringify(metadataResult)
      });

      const createConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/api/v1/urls/save-url',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: createData
      };

      await axios.request(createConfig);
      console.log("URL created successfully.");
    } else if (!urlData.completedAt) {
      // If URL exists and has no completedAt, update it
      const updateConfig = {
        method: 'put',
        url: `http://localhost:4000/api/v1/urls/update-url`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({ urlId: urlData._id, completedAt: new Date() })
      };

      await axios.request(updateConfig);
      console.log("URL updated successfully.");
    } else {
      // If both startedAt and completedAt exist, create a new entry
      const createData = JSON.stringify({
        url: url,
        metadata: JSON.stringify(metadataResult)
      });

      const createConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/api/v1/urls/save-url',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: createData
      };

      await axios.request(createConfig);
      console.log("New URL entry created successfully.");
    }
  } catch (err) {
    console.error(`Failed to process URL ${url}:`, err);
  }
}

// Handle tab updates (page load or navigation)
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tabId = activeInfo.tabId;
  const tab = await browser.tabs.get(tabId);
  console.log("tab", tab);

  try {
    const result = await browser.storage.local.get([
      "defaultWorkspaceId",
      "userToken",
    ]);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGY4YTU1Y2RkMjk2Yzc3YmYwOTA1OSIsImVtYWlsIjoiYWRpdHlhLjIxMjEwNDEwMUB2Y2V0LmVkdS5pbiIsInJvbGUiOiJzdXBlcnVzZXIiLCJpc1ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3MzAwODc0NjgsImV4cCI6MTczMDE3Mzg2OH0.CkSzTGp92iedqJ7dndPnVNj38LGu3xLJ0UdtxwIKXpA';
    const url = tab.url;
    console.log("running");

    await processUrl(url as string, token);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
