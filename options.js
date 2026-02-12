// Title Suffixer - Options Script

const suffixInput = document.getElementById('suffix');
const previewText = document.getElementById('preview');
const saveButton = document.getElementById('save');
const statusText = document.getElementById('status');

// 保存されている設定を読み込み
chrome.storage.sync.get(['suffix'], (result) => {
  if (result.suffix) {
    suffixInput.value = result.suffix;
    updatePreview();
  }
});

// プレビューを更新
function updatePreview() {
  const name = suffixInput.value.trim();
  if (name) {
    previewText.textContent = `Google検索 [${name}]`;
  } else {
    previewText.textContent = 'Google検索';
  }
}

// 入力時にプレビュー更新
suffixInput.addEventListener('input', updatePreview);

// 保存
saveButton.addEventListener('click', () => {
  const suffix = suffixInput.value.trim();
  
  chrome.storage.sync.set({ suffix }, () => {
    // 保存後にウィンドウを閉じる
    window.close();
  });
});

// Enterキーで保存
suffixInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveButton.click();
  }
});
