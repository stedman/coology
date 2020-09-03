(function () {
  const bodyEl = document.body;
  // Helper function to remove coology class when 'resetting' to original theme
  const coolify = (theme) => {
    if (!theme) return;
    if (theme === 'original') {
      bodyEl.classList.remove('coology');
    } else {
      bodyEl.classList.add('coology');
    }
  }

  // Get last saved theme
  chrome.storage.local.get('theme', ({theme}) => {
    if (!theme) return;
    coolify(theme);
    bodyEl.classList.add(`coology-${theme}`);
  })

  // Change theme when saved choices change
  chrome.storage.onChanged.addListener(({theme}) => {
    coolify(theme.newValue);
    bodyEl.classList.replace(`coology-${theme.oldValue}`, `coology-${theme.newValue}`);
  });

  // Provide link to iframe content outside of iframe
  const iframeEls = document.querySelectorAll('.standard-page iframe');

  iframeEls.forEach((el) => {
    el.insertAdjacentHTML('afterend', `<p><a href="${el.src}" target="_blank">⬆︎ open in new window ⬆︎</a></p>`);
  });
})();
