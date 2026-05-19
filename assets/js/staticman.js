---
layout: null
---

(function ($) {
  var $comments = $('.js-comments');
  var STORAGE_KEY = 'staticman_user_info';

  // ── Remember Me: restore saved values ──────────────────────────────────────
  var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved) {
    $('#comment-form-name').val(saved.name || '');
    $('#comment-form-email').val(saved.email || '');
    $('#comment-form-url').val(saved.url || '');
    $('#comment-remember-me').prop('checked', true);
  }

  // ── Character counter ──────────────────────────────────────────────────────
  var $textarea = $('#comment-form-message');
  var $charCount = $('#comment-char-count');
  var maxLen = 2000;

  $textarea.on('input', function () {
    var len = $(this).val().length;
    $charCount.text(len);
    if (len >= maxLen * 0.9) {
      $charCount.closest('.comment-char-counter').addClass('near-limit');
    } else {
      $charCount.closest('.comment-char-counter').removeClass('near-limit');
    }
    // live preview update if preview tab is active
    if ($('#tab-preview').is(':visible')) {
      renderPreview($(this).val());
    }
  });

  // ── Markdown Preview tabs ──────────────────────────────────────────────────
  function renderPreview(text) {
    var html = typeof marked !== 'undefined' ? marked.parse(text || '') : text;
    $('#comment-preview-content').html(html || '<em style="color:#999">Chưa có nội dung...</em>');
  }

  $(document).on('click', '.comment-tab-btn', function () {
    var tab = $(this).data('tab');
    $('.comment-tab-btn').removeClass('active');
    $(this).addClass('active');
    if (tab === 'write') {
      $('#tab-write').show();
      $('#tab-preview').hide();
    } else {
      renderPreview($textarea.val());
      $('#tab-write').hide();
      $('#tab-preview').show();
    }
  });

  // ── Copy link to comment ───────────────────────────────────────────────────
  $(document).on('click', '.comment-copy-link', function (e) {
    e.preventDefault();
    var href = $(this).attr('href');
    var url = window.location.origin + window.location.pathname + href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        showCopyTooltip(e.currentTarget);
      });
    } else {
      var el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showCopyTooltip(e.currentTarget);
    }
  });

  function showCopyTooltip(el) {
    var $el = $(el);
    $el.attr('data-original-title', $el.attr('title'));
    $el.attr('title', 'Đã sao chép!');
    var $tooltip = $('<span class="comment-copy-tooltip">Đã sao chép!</span>');
    $el.after($tooltip);
    setTimeout(function () {
      $tooltip.remove();
      $el.attr('title', $el.attr('data-original-title') || 'Sao chép link');
    }, 2000);
  }

  // ── Form submit ────────────────────────────────────────────────────────────
  $('#new_comment').submit(function () {
    var form = this;
    $(form).addClass('disabled');

    // Remember Me: save or clear
    if ($('#comment-remember-me').is(':checked')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        name: $('#comment-form-name').val(),
        email: $('#comment-form-email').val(),
        url: $('#comment-form-url').val()
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    {% assign sm = site.staticman -%}
    var endpoint = '{{ sm.endpoint }}';
    var repository = '{{ sm.repository }}';
    var branch = '{{ sm.branch }}';
    var url = endpoint + repository + '/' + branch + '/comments';
    var data = $(this).serialize();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 400) {
          formSubmitted();
        } else {
          formError();
        }
      }
    };

    function formSubmitted() {
      $('#comment-form-submit').addClass('d-none');
      $('#comment-form-submitted').removeClass('d-none');
      $('.page__comments-form .js-notice').removeClass('alert-danger').addClass('alert-success');
      showAlert('success');
    }

    function formError() {
      $('#comment-form-submitted').addClass('d-none');
      $('#comment-form-submit').removeClass('d-none');
      $('.page__comments-form .js-notice').removeClass('alert-success').addClass('alert-danger');
      showAlert('failure');
      $(form).removeClass('disabled');
    }

    xhr.send(data);
    return false;
  });

  function showAlert(message) {
    $('.page__comments-form .js-notice').removeClass('d-none');
    if (message === 'success') {
      $('.page__comments-form .js-notice-text-success').removeClass('d-none');
      $('.page__comments-form .js-notice-text-failure').addClass('d-none');
    } else {
      $('.page__comments-form .js-notice-text-success').addClass('d-none');
      $('.page__comments-form .js-notice-text-failure').removeClass('d-none');
    }
  }

})(jQuery);
