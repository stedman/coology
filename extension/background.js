// Hide/show extension popup

// CROSS-BROWSER APPROACH
// ref: https://stackoverflow.com/questions/39252384/is-there-a-ff-equivalent-to-chrome-declarativecontent-onpagechanged
const reUrl = /.+\.schoology\.com.+/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (reUrl.test(tab.url)) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});
