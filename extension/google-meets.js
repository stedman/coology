(() => {
  document.body.insertAdjacentHTML('afterbegin', '<em class="gmeets-camera">Camera is on.</em>');

  const toggleCameraStatus = function (isMuted) {
    const indicatorEl = document.body.querySelector('.gmeets-camera');


    if (isMuted === "true") {
      console.log(indicatorEl, isMuted, 'off');
      indicatorEl.classList.remove('gmeets-camera-on');
    } else {
      console.log(indicatorEl, isMuted);
      indicatorEl.classList.add('gmeets-camera-on');
    }
  };
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes") {
        console.log(mutation.target.dataset)
        toggleCameraStatus(mutation.target.dataset.isMuted);
      }
    });
  });

  setTimeout(() => {
    observer.observe(document.body.querySelector('[jsname=R3GXJb]'), {
      attributeFilter: ['data-is-muted'],
      subtree: true
    });
  }, 2000);
})();

