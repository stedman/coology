/**
 * Apply Coology themes to Schoology apps.
 */
const themer = () => {
  const bodyEl = document.body;
  /**
   * Helper function to remove coology class when 'resetting' to original theme
   *
   * @param {string} theme Theme name
   */
  const coolify = (theme) => {
    if (!theme) return;

    // Remove all traces of coology if theme choice is 'original'
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
    // Add the theme name to <body>
    bodyEl.classList.add(`coology-${theme}`);
  })

  // Listen for changes to theme storage
  chrome.storage.onChanged.addListener(({theme}) => {
    coolify(theme.newValue);
    // Change themes from old to new
    bodyEl.classList.replace(`coology-${theme.oldValue}`, `coology-${theme.newValue}`);
  });
};

/**
 * EXTRA FEATURE: Provide link to iframe content outside of iframe.
 */
const iframeLinker = () => {
  // Get iframes from suitable content areas
  const iframeEls = document.querySelectorAll('#main iframe');

  iframeEls.forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'iframe-ex-wrap';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    el.classList.add('iframe-ex-i');

    // Add link to iframe source below the iframe
    el.insertAdjacentHTML('afterend', `<a href="${el.src}" target="_blank" class="iframe-ex-link">⬆︎ open this in a new tab ⬆︎</a>`);
  });
};

themer();
iframeLinker();
