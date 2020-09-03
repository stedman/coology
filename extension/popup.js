const themeEl = document.querySelector('.themes');

// Get saved theme
chrome.storage.local.get('theme', ({theme}) => {
  if (!theme) return;

  const selectedEl = themeEl.querySelector(`[value="${theme}"]`);

  if (selectedEl) {
    selectedEl.checked = true;
  }
});

// Save theme choice when user selects new theme via extension
themeEl.addEventListener('change', (ev) => {
  chrome.storage.local.set({theme: ev.target.value}, (changed) => {
    console.log(changed);
  });

  window.close();
});
