// Title Suffixer - Background Script

// 拡張機能インストール時にオプションページを開く
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage();
  }
});
