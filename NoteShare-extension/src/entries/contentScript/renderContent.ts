import { image } from "@nextui-org/theme";
import browser from "webextension-polyfill";

// This function renders content into the web page using a Shadow DOM
export default async function renderContent(
  cssPaths: string[],
  render: (appRoot: HTMLElement) => void
) {
  console.log("Rendering content started...");

  const appContainer = document.createElement("div");

  appContainer.id = "snooze-notification-root";
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.MODE === "development" ? "open" : "closed",
  });

  console.log("Shadow DOM attached:", shadowRoot.mode);

  const appRoot = document.createElement("div");

  // Dynamically load Vite styles if in hot-reload mode
  if (import.meta.hot) {
    const { addViteStyleTarget } = await import(
      "@samrum/vite-plugin-web-extension/client"
    );
    await addViteStyleTarget(shadowRoot);
    console.log("Vite style target added to Shadow DOM");
  } else {
    // Load styles for production
    console.log("Production mode - loading styles...");
    cssPaths.forEach((cssPath: string) => {
      const styleEl = document.createElement("link");
      styleEl.setAttribute("rel", "stylesheet");
      styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
      shadowRoot.appendChild(styleEl);
      console.log(`Style added: ${cssPath}`);
    });
  }

  shadowRoot.appendChild(appRoot);
  document.body.appendChild(appContainer);

  console.log("Rendering content complete. App container added to body.");

  // Render the provided component into the Shadow DOM
  render(appRoot);
}

const targetUrl = "https://staging.newboard.app/";

console.log("Content script loaded! Waiting for messages...");

// Message interface for structured message handling

interface Message {
  type: string;
  token?: string;
  groupId?: number;
  currentUrl?: string;
  urls?: string[];
  listData?: { name: string; id: string };
  [key: string]: any;
}

// Handle incoming messages from background or popup scripts
browser.runtime.onMessage.addListener(
  (
    message: Message,
    sender: browser.Runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log("Message received:", message);

    switch (message.type) {
      case "SEND_TOKEN":
        // Store user token received
        if (message.token) {
          localStorage.setItem("userToken", message.token);
          console.log("Token received and stored:", message.token);
        }
        break;

      case "TAB_GROUP_CLOSURE":
        // Handle tab group closure
        if (message.groupId) {
          console.log(`Tab group with ID ${message.groupId} has been deleted`);
          window.postMessage(
            {
              type: "TAB_GROUP_CLOSURE",
              groupId: message.groupId,
            },
            "*"
          );
        }
        break;

      case "BROWSER_OPENED":
        // Clear relevant local storage keys when the target URL is opened
        if (window.location.href.includes(targetUrl)) {
          console.log("Target URL opened:", targetUrl);
          const tabRegex = /^TAB_GROUP_.+/;
          const listRegex = /^LIST_ID_.+/;
          const allKeys = Object.keys(localStorage);
          console.log("Checking localStorage for keys to remove...");
          allKeys.forEach((key) => {
            if (tabRegex.test(key) || listRegex.test(key)) {
              localStorage.removeItem(key);
              console.log(`Removed key from localStorage: ${key}`);
            }
          });
        }
        break;

      case "openTabs":
        console.log("Opening tabs:", message.urls);
        break;

      case "closeTabGroup":
        console.log("Closing tab group with ID:", message.groupId);
        break;

      case "currentUrl":
        if (message.currentUrl) {
          console.log("Current URL received:", message.currentUrl);
        }
        break;

      case "verifyTabs":
        if (message.groupId) {
          console.log("Verifying tab group with ID:", message.groupId);
        }
        break;

      default:
        console.warn("Received unknown message type:", message.type);
        break;
    }

    // Optional response back to the sender
    sendResponse({ status: "Message received" });
  }
);

// Function to extract image URLs from the current page
function extractImageUrls() {
  const images = document.querySelectorAll("img");
  const imageUrls = Array.from(images).map((img) => img.src);
  console.log("Extracted image URLs:", imageUrls);

  return imageUrls;
}

// Send extracted image URLs to the background script
function sendImageUrls() {
  const imageUrls = extractImageUrls();
  console.log("Sending image URLs to background script...");
  browser.runtime.sendMessage({ type: "IMAGE_URLS", urls: imageUrls });

  // Send the image URLs as soon as the script runs
  sendImageUrls();

  // ---------- TWEET SCRAPING FUNCTIONALITY ----------

  // let tweets: string[] = []; // Initialize an empty array to store tweet text

  // const scrollInterval = 1000; // Interval to scroll the page
  // const scrollStep = 5000; // Pixels to scroll on each step
  // let previousTweetCount = 0;
  // let unchangedCount = 0;

  // // Function to extract visible tweets from the page
  // function extractTweets() {
  //   const tweetElements = document.querySelectorAll('[data-testid="tweetText"]');
  //   console.log(`Found ${tweetElements.length} tweet elements`);

  //   // Loop through all tweet elements and extract text
  //   tweetElements.forEach(tweetElement => {
  //     const tweetText = tweetElement.textContent?.trim();
  //     if (tweetText && !tweets.includes(tweetText)) {
  //       tweets.push(tweetText);
  //       console.log(`New tweet added. Total tweets: ${tweets.length}`);
  //     }
  //   });
  // }

  // // Initially extract all tweets present on the page
  // extractTweets();
  // console.log("Initial tweet extraction complete");

  // // Set up scrolling mechanism to load more tweets
  // const scrollToEndIntervalID = setInterval(() => {
  //   console.log("Scrolling the page...");
  //   window.scrollBy(0, scrollStep); // Scroll the page

  //   const currentTweetCount = tweets.length;
  //   console.log(`Current tweet count: ${currentTweetCount}`);

  //   // Check if no new tweets have been loaded
  //   if (currentTweetCount === previousTweetCount) {
  //     unchangedCount++;
  //     console.log(`No new tweets found. Unchanged count: ${unchangedCount}`);

  //     if (unchangedCount >= 2) {
  //       console.log('Scraping complete');
  //       console.log('Total tweets scraped:', tweets.length);

  //       // Send scraped tweets to the background script
  //       console.log("Sending scraped tweets to the background script...");
  //       browser.runtime.sendMessage({ type: 'SCRAPED_TWEETS', tweets });

  //       // Stop further scrolling and observations
  //       clearInterval(scrollToEndIntervalID);
  //       observer.disconnect();
  //     }
  //   } else {
  //     unchangedCount = 0; // Reset counter if new tweets are found
  //   }

  //   previousTweetCount = currentTweetCount;
  // }, scrollInterval);

  // // MutationObserver to detect changes in the DOM (for infinite scroll)
  // const observer = new MutationObserver((mutations) => {
  //   console.log("MutationObserver detected changes in the DOM");

  //   mutations.forEach((mutation) => {
  //     if (mutation.type === 'childList') {
  //       console.log("New child nodes added. Re-extracting image URLs and tweets...");
  //       sendImageUrls(); // Resend image URLs if new content is added
  //       extractTweets(); // Extract new tweets when DOM changes
  //     }
  //   });
  // });

  // Observe the entire document body for changes in the DOM tree
  // console.log("Starting MutationObserver to monitor DOM changes...");
  // observer.observe(document.body, { childList: true, subtree: true });
  // Optionally, you can set up a MutationObserver to detect new images added to the page
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        sendImageUrls();
      }
    });
  });
}
