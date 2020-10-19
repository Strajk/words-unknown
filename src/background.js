if (process.env.NODE_ENV === "development") {
  chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    if (info.url === `http://localhost/reloadExtension?id=${require("./../package.json").name}`) {
      chrome.tabs.remove(tabId)
      chrome.runtime.reload()
    }
  })
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == "install") {
    chrome.runtime.openOptionsPage()
  } else if (details.reason == "update") {
    const thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});

browser.browserAction.onClicked.addListener(tab => {
  browser.tabs.executeScript({file: "browser-polyfill.js"});
  browser.tabs.executeScript(tab.id, {
    file: 'inject.js'
  });
});

