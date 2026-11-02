// Swaps the nav "Log in" link for "Sign out" when a Supabase session exists.
(function () {
  var link = document.getElementById('auth-link');
  var cfg = window.SUPABASE_CONFIG || {};
  if (!link || !window.supabase || !cfg.url || !cfg.anonKey) return;

  var client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true }
  });

  function render(session) {
    if (session) {
      link.textContent = 'Sign out';
      link.setAttribute('href', '#');
      link.setAttribute('role', 'button');
    } else {
      link.textContent = 'Log in';
      link.setAttribute('href', '/login.html');
      link.removeAttribute('role');
    }
  }

  link.addEventListener('click', function (e) {
    if (link.getAttribute('href') !== '#') return;
    e.preventDefault();
    client.auth.signOut().then(function () { render(null); });
  });

  client.auth.onAuthStateChange(function (_event, session) { render(session); });
})();
