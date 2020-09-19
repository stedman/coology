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
  /**
   * Wrap iframe and add link to iframe source.
   *
   * @param {array} frameEls Iframe elements.
   */
  const linkify = (frameEls) => {
    frameEls.forEach((el) => {
      // Don't get iframes nested in forms. Those cause all sorts of problems.
      if (el.closest('form')) return undefined;

      const wrapper = document.createElement('div');
      wrapper.className = 'iframe-ex-wrap';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      el.classList.add('iframe-ex-i');

      // Add link to iframe source below the iframe
      el.insertAdjacentHTML('afterend', `<a href="${el.src}" target="_blank" class="iframe-ex-link">⬆︎ open this in a new tab ⬆︎</a>`);
    });
  }

  let searchTries = 0;

  /**
   * Get iframes from suitable content areas
   *
   * @param {array} elements Collection of iframe elements.
   */
  const getIframes = (elements) => {
    // Check if elements is a node object; else it's empty or a requestAnimationFrame timestamp
    const frameEls = typeof elements === 'object'
      ? elements
      : document.querySelectorAll(`#content-wrapper iframe`)

    // Some iframes are in React components (in #content-wrapper).
    // If we haven't found an iframe after initial search, wait for page to repaint and try again.
    if (frameEls.length === 0) {
      // Give up after several tries
      if (searchTries > 25) {
        console.info('Coology gave up looking for iframes.');
        return;
      }

      searchTries += 1
      window.requestAnimationFrame(getIframes);
    } else {
      linkify(frameEls);
    }
  };

  getIframes(document.querySelectorAll(`.standard-page iframe, #main iframe`));
};

themer();
iframeLinker();
