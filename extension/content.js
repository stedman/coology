/**
 * Apply Coology themes to Schoology apps.
 */
const themer = () => {
  const originTheme = 'original';
  const bodyEl = document.body;
  /**
   * Helper function to remove coology class when 'resetting' to original theme
   *
   * @param {string} theme Theme name
   */
  const updateNamespace = (theme) => {
    if (!theme) return;

    // Remove all traces of coology if theme choice is 'original'
    if (theme === originTheme) {
      bodyEl.classList.remove('coology');
    } else {
      bodyEl.classList.add('coology');
    }
  }

  // Get last saved theme
  chrome.storage.local.get('theme', ({theme}) => {
    if (!theme) return;

    updateNamespace(theme);

    // Add the theme name
    if (theme === originTheme) return;

    bodyEl.classList.add(`coology-${theme}`);
  })

  // Listen for changes to theme storage
  chrome.storage.onChanged.addListener(({theme}) => {
    updateNamespace(theme.newValue);

    // Change themes from old to new
    if (theme.newValue === originTheme) {
      bodyEl.classList.remove(`coology-${theme.oldValue}`);
    } else if (theme.oldValue === originTheme) {
      bodyEl.classList.add(`coology-${theme.newValue}`);
    } else {
      bodyEl.classList.replace(`coology-${theme.oldValue}`,`coology-${theme.newValue}` );
    }
  });
};

/**
 * EXTRA FEATURE: Provide link to iframe content outside of iframe.
 */
const iframeLinker = () => {
  const bodyEl = document.querySelector('body.has-materials-player');

  if (!bodyEl) return;

  /**
   * Wrap iframe and add link to iframe source.
   *
   * @param {array} frameEls Iframe elements.
   */
  const linkify = (frameEls) => {
    frameEls.forEach((frameEl) => {
      // Don't operate on iframes that are nested in forms.
      // Those cause all sorts of problems.
      if (frameEl.closest('form')) return undefined;

      // Add link to iframe source below the iframe
      frameEl.insertAdjacentHTML('afterend', `<div class="coology-iframe-linker"><a href="${frameEl.src}" target="_blank">open this content in a new tab</a></div>`);
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
      : bodyEl.querySelectorAll(`#content-wrapper iframe`)

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

  getIframes(bodyEl.querySelectorAll(`.standard-page iframe, #main iframe`));
};

/**
 * Display active grades next to courses and provide button to expand/collapse actively graded courses.
 */
const gradeHelper = () => {
  // Set lower limit on grade warnings.
  const lowerLimit = 70;
  // Text for expander button.
  const buttonText = [
    'Expand All Actively Graded Sections',
    'Collapse All Actively Graded Sections'
  ];
  // Store actively graded courses.
  const activeCourseEls = [];

  /**
   * Event handler to expand/collapse actively graded courses.
   *
   * @param {object} ev Event object.
   */
  const expandGrades = (ev) => {
    const btnEl = ev.currentTarget;
    // Initial setting
    let doExpand = true;

    // Check current state and then toggle settings and text.
    if (btnEl.getAttribute('expanded') === 'false') {
      btnEl.setAttribute('expanded', true);
      btnEl.textContent = buttonText[1];
    } else {
      doExpand = false;
      btnEl.setAttribute('expanded', false);
      btnEl.textContent = buttonText[0];
    }

    activeCourseEls.forEach((el) => {
      const nextSibEl = el.nextElementSibling;

      if (doExpand) {
        el.classList.remove('coology-hidden-grade');
        // Expand active sections.
        nextSibEl.style.display = 'block';
      } else {
        el.classList.add('coology-hidden-grade');
        // Collapse sections.
        nextSibEl.style.display = 'none';
      }
    });
  };

  // This element appears only on grade page.
  const downloadEl = document.querySelector('.download-grade-wrapper');

  if (downloadEl) {
    // Create button to expand/collapse all actively graded courses.
    const buttonEl = document.createElement('button');
    buttonEl.className = 'coology-grade-expander';
    buttonEl.textContent = buttonText[0];
    buttonEl.setAttribute('expanded', false);
    buttonEl.addEventListener('click', expandGrades);
    downloadEl.insertAdjacentElement('beforeend', buttonEl);

    // Identify all actively graded courses.
    document.querySelectorAll('.gradebook-course-title').forEach(courseTitleEl => {
      const nextSibEl = courseTitleEl.nextElementSibling;
      // Expanded sections have their style set to 'display:block'.
      const isExpanded = nextSibEl.style && nextSibEl.style.display === 'block';
      // Check for 'awarded-grades'
      const awardedGradeEl = nextSibEl.querySelectorAll('.awarded-grade');

      if (!isExpanded && awardedGradeEl.length) {
        // Build active course list to be used by 'expandGrades' event handler.
        activeCourseEls.push(courseTitleEl);

        // Add coology namespace and active 'link'. CSS handles content.
        courseTitleEl.classList.add('coology-active-grade', 'coology-hidden-grade');
        // Change 'link' class if clicked.
        courseTitleEl.addEventListener('click', (ev) => {
          ev.currentTarget.classList.toggle('coology-hidden-grade');
        });

        // Add warning for low grades.
        let hasGradeAlert = false;
        let hasMissingGrade = false;

        const count = {
          total: 0,
          hundo: 0,
          alert: 0,
          missing: 0,
        };

        // Get grades that are awarded and missing.
        nextSibEl.querySelectorAll('.awarded-grade, .no-grade').forEach(gradeEl => {
          const numbGrade = Number(gradeEl.textContent);
          // Skip the junk.
          if (typeof numbGrade !== 'number' || !isFinite(numbGrade)) return;

          count.total++;

          const grade = Math.round(numbGrade);
          let gradePercent = 0;

          // Zero is zero, don't bother calculating percent.
          if (grade !== 0) {
            const maxGradeEl = gradeEl.nextElementSibling;
            const maxGrade = maxGradeEl ? Number(maxGradeEl.textContent.replace('/', '')) : 100;

            gradePercent = Math.round((grade / maxGrade) * 100);
          }

          const gradeRowEl = gradeEl.closest('tr');

          if (gradePercent < lowerLimit) {
            const isMissing = gradeEl.classList.contains('no-grade');

            // Set individual grade alerts.
            gradeRowEl.classList.add('coology-grade-alert');
            if (isMissing) gradeRowEl.classList.add('coology-grade-missing');
            gradeRowEl.setAttribute('title', `Grade alert: ${gradePercent}%`);

            // Set heading alerts on first occurrence.
            if (!hasGradeAlert) {
              hasGradeAlert = true;
              downloadEl.classList.add('coology-grade-alert');
              courseTitleEl.classList.add('coology-grade-alert');
            }

            if (isMissing) {
              count.missing++;

              if (!hasMissingGrade) {
                hasMissingGrade = true;
                downloadEl.classList.add('coology-grade-alert', 'coology-grade-missing');
                courseTitleEl.classList.add('coology-grade-alert', 'coology-grade-missing');
              }
            } else {
              count.alert++;
            }
          }
          else if (gradePercent === 100) {
            count.hundo++;
            gradeRowEl.classList.add('coology-grade-100');
          }
        });

        // Append score highlights.
        const scoreHtmls = [];
        if (count.total > 0) scoreHtmls.push(`<span title="${count.total} total" class="coology-grade-total">${count.total} ✅</span>`);
        if (count.hundo > 0) scoreHtmls.push(`<span title="${count.hundo} hundos">${count.hundo} ✅</span>`);
        if (count.alert > 0) scoreHtmls.push(`<span title="${count.alert} alerts">${count.alert} ⚠️</span>`);
        if (count.missing > 0) scoreHtmls.push(`<span title="${count.missing} missing">${count.missing} 🛑</span>`);

        courseTitleEl.insertAdjacentHTML('beforeend',
        `<span class="coology-course-scores">${scoreHtmls.join('')}</span>`);

        // Append available course grades to visible course names.
        const courseGradeEl = nextSibEl.querySelector('.report-row:not(.item-row) .rounded-grade');
        const grade = courseGradeEl ? courseGradeEl.textContent : '';

        if (grade.length) {
          courseTitleEl.querySelector('a')
            .insertAdjacentHTML('afterend',
              `<span class="coology-course-grade">(Course Grade: <em>${grade}</em>)</span>`);
        }
      }
    });
  }
}

themer();
iframeLinker();
gradeHelper();
