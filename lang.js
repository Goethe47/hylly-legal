(function () {
  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
    });
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      var active = btn.dataset.setLang === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try {
      localStorage.setItem('hylly-lang', lang);
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — language just won't persist */
    }
  }

  function initLang() {
    // Ссылки из приложения передают ?lang=ru/en, чтобы открывался документ на
    // том же языке, что выбран в Hylly, а не на языке браузера/устройства.
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('lang');

    var stored = null;
    try {
      stored = localStorage.getItem('hylly-lang');
    } catch (e) {
      /* ignore */
    }
    var browserLang = (navigator.language || '').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
    var initial = fromUrl === 'en' || fromUrl === 'ru'
      ? fromUrl
      : (stored === 'en' || stored === 'ru' ? stored : browserLang);
    applyLang(initial);

    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.dataset.setLang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initLang);
})();
