(function () {
  const bodyEl = document.body;
  const coolify = (theme) => {
    if (!theme) return;
    if (theme === 'original') {
      bodyEl.classList.remove('coology');
    } else {
      bodyEl.classList.add('coology');
    }
  }

  chrome.storage.local.get('theme', ({theme}) => {
    if (!theme) return;
    coolify(theme);
    bodyEl.classList.add(`coology-${theme}`);
  })

  chrome.storage.onChanged.addListener(({theme}) => {
    coolify(theme.newValue);
    bodyEl.classList.replace(`coology-${theme.oldValue}`, `coology-${theme.newValue}`);
  });
})();
