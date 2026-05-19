(function () {
  var ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  document.querySelectorAll('div.highlight, pre').forEach(function (block) {
    // Bọc wrapper nếu chưa có
    if (block.parentElement.classList.contains('code-block-wrapper')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    var btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = ICON_COPY + '<span>Copy</span>';
    wrapper.appendChild(btn);

    btn.addEventListener('click', function () {
      var code = block.querySelector('code') || block;
      var text = code.innerText || code.textContent;

      navigator.clipboard.writeText(text).then(function () {
        btn.innerHTML = ICON_CHECK + '<span>Copied!</span>';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = ICON_COPY + '<span>Copy</span>';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // fallback
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.innerHTML = ICON_CHECK + '<span>Copied!</span>';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = ICON_COPY + '<span>Copy</span>';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();
