// Get theme list
const themeEl = document.querySelector('.themes');

// Get previously saved theme
chrome.storage.local.get('theme', ({theme}) => {
  if (!theme) return;

  // find radio button with same value
  const selectedEl = themeEl.querySelector(`[value="${theme}"]`);

  if (selectedEl) {
    // apply check
    selectedEl.checked = true;
  }
});

// Listen for changes to theme choices
themeEl.addEventListener('change', (ev) => {
  // save new theme choice
  chrome.storage.local.set({theme: ev.target.value}, (changed) => {
    console.log(changed);
  });

  window.close();
});
