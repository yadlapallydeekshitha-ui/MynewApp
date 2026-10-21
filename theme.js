(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-theme-choice]');
  var colors = { light: '#F7F9FC', dark: '#0D1117' };
  var media = window.matchMedia('(prefers-color-scheme: light)');

  function saved() {
    try { return localStorage.getItem('theme') || 'system'; } catch (e) { return 'system'; }
  }

  function apply(choice) {
    if (choice === 'light' || choice === 'dark') {
      root.setAttribute('data-theme', choice);
    } else {
      root.removeAttribute('data-theme');
    }
    var effective = choice === 'system' ? (media.matches ? 'light' : 'dark') : choice;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', colors[effective]);
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-choice') === choice));
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var choice = b.getAttribute('data-theme-choice');
      try {
        if (choice === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', choice);
      } catch (e) {}
      apply(choice);
    });
  });

  media.addEventListener('change', function () {
    if (saved() === 'system') apply('system');
  });

  apply(saved());
})();
