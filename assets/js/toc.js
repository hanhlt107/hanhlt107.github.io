(function () {
  var nav = document.getElementById('toc-nav');
  var list = document.getElementById('toc-list');
  if (!nav || !list) return;

  var article = document.querySelector('article.blog-post');
  if (!article) return;

  var headings = article.querySelectorAll('h2, h3');
  if (headings.length < 2) {
    nav.style.display = 'none';
    return;
  }

  // Build TOC list
  headings.forEach(function (h, i) {
    if (!h.id) h.id = 'heading-' + i;

    var li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(h.id);
      if (target) {
        var offset = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });

    li.appendChild(a);
    list.appendChild(li);
  });

  // Scroll-spy
  var links = list.querySelectorAll('a');
  var headingEls = Array.from(headings);

  // Chỉ hiện TOC sau khi đã cuộn qua phần đầu bài (để không đè ảnh bìa).
  // Mốc: khi heading đầu tiên gần chạm mép trên màn hình.
  function showThreshold() {
    return Math.max(headingEls[0].offsetTop - 160, 240);
  }

  function onScroll() {
    var y = window.pageYOffset;

    // Ẩn/hiện theo vị trí cuộn
    if (y > showThreshold()) nav.classList.add('visible');
    else nav.classList.remove('visible');

    // Highlight section đang đọc
    var scrollY = y + 100;
    var active = headingEls.reduce(function (acc, h) {
      return h.offsetTop <= scrollY ? h : acc;
    }, headingEls[0]);

    links.forEach(function (a) { a.classList.remove('active'); });
    if (active) {
      var activeLink = list.querySelector('a[href="#' + active.id + '"]');
      if (activeLink) activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
