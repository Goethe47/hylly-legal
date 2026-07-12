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
    // том же языке, что выбран в Hylly. Для прямых заходов на сайт (Google
    // Play review, случайные посетители) язык браузера больше не угадываем —
    // стандартный язык страницы английский, пока явно не выбрано другое.
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('lang');

    var stored = null;
    try {
      stored = localStorage.getItem('hylly-lang');
    } catch (e) {
      /* ignore */
    }
    var initial = fromUrl === 'en' || fromUrl === 'ru'
      ? fromUrl
      : (stored === 'en' || stored === 'ru' ? stored : 'en');
    applyLang(initial);

    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.dataset.setLang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initLang);

  // Тема по умолчанию следует системной (prefers-color-scheme через CSS).
  // Кнопки дают явный ручной выбор поверх системного, если человек хочет
  // посмотреть/оставить конкретную тему независимо от настроек ОС.
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeButtons(effective) {
    document.querySelectorAll('.theme-toggle button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.setTheme === effective ? 'true' : 'false');
    });
  }

  function applyTheme(explicit) {
    if (explicit === 'light' || explicit === 'dark') {
      document.documentElement.setAttribute('data-theme', explicit);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateThemeButtons(explicit === 'light' || explicit === 'dark' ? explicit : systemTheme());
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('hylly-theme');
    } catch (e) {
      /* ignore */
    }
    applyTheme(stored);

    document.querySelectorAll('.theme-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.dataset.setTheme;
        try {
          localStorage.setItem('hylly-theme', value);
        } catch (e) {
          /* localStorage unavailable — choice just won't persist */
        }
        applyTheme(value);
      });
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        var current = null;
        try {
          current = localStorage.getItem('hylly-theme');
        } catch (e) {
          /* ignore */
        }
        if (current !== 'light' && current !== 'dark') updateThemeButtons(systemTheme());
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initTheme);
})();
