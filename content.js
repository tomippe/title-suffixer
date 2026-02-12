// Title Suffixer - Content Script
// タブタイトルの末尾にサフィックスを追加する

let suffixName = '';
let isUpdating = false;

// サフィックス文字列を生成（[]で囲む）
function formatSuffix(name) {
  return name ? `[${name}]` : '';
}

// ストレージからサフィックス名を取得
chrome.storage.sync.get(['suffix'], (result) => {
  suffixName = result.suffix || '';
  if (suffixName) {
    // ページ読み込み後2000ms待ってからサフィックスを付加
    setTimeout(() => {
      updateTitle();
      observeTitleChanges();
    }, 2000);
  }
});

// ストレージの変更を監視
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.suffix) {
    const oldName = suffixName;
    suffixName = changes.suffix.newValue || '';
    
    // 古いサフィックスを削除してから新しいものを適用
    const oldSuffix = formatSuffix(oldName);
    if (oldSuffix && document.title.endsWith(` ${oldSuffix}`)) {
      document.title = document.title.slice(0, -(oldSuffix.length + 1));
    }
    
    if (suffixName) {
      updateTitle();
    }
  }
});

// タイトルを更新
function updateTitle() {
  if (isUpdating || !suffixName) return;
  
  isUpdating = true;
  
  const currentTitle = document.title;
  const suffix = formatSuffix(suffixName);
  
  // すでにサフィックスが付いている場合はスキップ
  if (!currentTitle.endsWith(` ${suffix}`)) {
    document.title = `${currentTitle} ${suffix}`;
  }
  
  isUpdating = false;
}

// タイトルの変更を監視
function observeTitleChanges() {
  const titleElement = document.querySelector('title');
  
  if (titleElement) {
    const observer = new MutationObserver((mutations) => {
      if (!isUpdating && suffixName) {
        // 少し遅延を入れてから更新（連続変更対策）
        setTimeout(updateTitle, 10);
      }
    });
    
    observer.observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  
  // document.titleの直接変更も監視
  let lastTitle = document.title;
  setInterval(() => {
    if (document.title !== lastTitle && !isUpdating && suffixName) {
      lastTitle = document.title;
      updateTitle();
      lastTitle = document.title; // 更新後のタイトルを記録
    }
  }, 500);
}
