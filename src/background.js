if (process.env.NODE_ENV === "development") {
  chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
    if (info.url === `http://localhost/reloadExtension?id=${require("./../package.json").name}`) {
      chrome.tabs.remove(tabId)
      chrome.runtime.reload()
    }
  })
}

browser.browserAction.onClicked.addListener(tab => {
  browser.tabs.executeScript({file: "browser-polyfill.js"});
  browser.tabs.executeScript(tab.id, {
    file: 'inject.js'
  });
});

