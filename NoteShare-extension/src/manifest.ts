import pkg from "../package.json";

const manifest = {
  action: {
    default_icon: {
      32: "icons/favicon.png",
      38: "icons/favicon.png",
    },
    default_popup: "src/entries/popup/index.html",
  },
  background: {
    service_worker: "src/entries/background/main.ts",
  },
  content_scripts: [
    {
      js: ["src/entries/contentScript/renderContent.ts"],
      matches: ["<all_urls>"],
      
    },
  ],
  // content_security_policy: {
  // 	"extension_pages": "script-src 'self'; object-src 'self';"
  //   },
  host_permissions: ["*://*/*"],
  icons: {
    48: "icons/favicon.png",
    128: "icons/favicon.png",
  },
  permissions: [
    "storage",
    "tabs",
    "storage",
    "cookies",
    "activeTab",
    "scripting",
    "tabGroups",
    "alarms",
    "notifications",
    "webRequest"

    
  ],
};

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}