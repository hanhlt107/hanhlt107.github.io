(function () {
  function enhanceImages() {
    var imgs = document.querySelectorAll('.blog-post img, .post-preview img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    }

    var frames = document.querySelectorAll('iframe:not([loading])');
    for (var j = 0; j < frames.length; j++) {
      frames[j].setAttribute('loading', 'lazy');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceImages);
  } else {
    enhanceImages();
  }
})();
