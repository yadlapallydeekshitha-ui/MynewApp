(function () {
  var cfg = window.SUPABASE_CONFIG || {};
  var signedOut = document.getElementById('signed-out');
  var signedIn = document.getElementById('signed-in');
  var googleBtn = document.getElementById('google-btn');
  var signOutBtn = document.getElementById('sign-out');
  var errorBox = document.getElementById('auth-error');
  var nameEl = document.getElementById('profile-name');
  var emailEl = document.getElementById('profile-email');
  var avatarEl = document.getElementById('profile-avatar');
  var initialEl = document.getElementById('profile-initial');
  var backLink = document.getElementById('back-link');

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  if (!window.supabase || !cfg.url || !cfg.anonKey || cfg.anonKey.indexOf('YOUR_') === 0) {
    signedOut.hidden = false;
    googleBtn.disabled = true;
    showError('Sign-in is not configured yet. Add the Supabase anon key to supabase-config.js.');
    return;
  }

  var client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true }
  });

  function render(session) {
    if (!session) {
      signedIn.hidden = true;
      signedOut.hidden = false;
      backLink.hidden = false;
      return;
    }
    var user = session.user;
    var meta = user.user_metadata || {};
    var name = meta.full_name || meta.name || user.email || 'Signed in';
    var picture = meta.avatar_url || meta.picture;

    nameEl.textContent = name;
    emailEl.textContent = user.email || '';
    initialEl.textContent = name.charAt(0).toUpperCase();
    if (picture) {
      avatarEl.src = picture;
      avatarEl.alt = name;
      avatarEl.hidden = false;
      initialEl.hidden = true;
      avatarEl.onerror = function () { avatarEl.hidden = true; initialEl.hidden = false; };
    } else {
      avatarEl.hidden = true;
      initialEl.hidden = false;
    }
    signedOut.hidden = true;
    signedIn.hidden = false;
    backLink.hidden = true;
  }

  // Surface errors Google/Supabase send back in the redirect URL.
  var params = new URLSearchParams(location.search + '&' + location.hash.slice(1));
  if (params.get('error_description')) showError(params.get('error_description'));

  googleBtn.addEventListener('click', function () {
    googleBtn.disabled = true;
    client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + location.pathname }
    }).then(function (res) {
      if (res.error) { googleBtn.disabled = false; showError(res.error.message); }
    });
  });

  signOutBtn.addEventListener('click', function () {
    client.auth.signOut().then(function () { render(null); });
  });

  client.auth.onAuthStateChange(function (_event, session) {
    render(session);
    // Clean the OAuth code/tokens out of the address bar once the session is stored.
    if (session && (location.search.indexOf('code=') !== -1 || location.hash.indexOf('access_token') !== -1)) {
      history.replaceState(null, '', location.pathname);
    }
  });
  client.auth.getSession().then(function (res) { render(res.data.session); });
})();
