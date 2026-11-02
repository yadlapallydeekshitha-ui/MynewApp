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
  var phoneEl = document.getElementById('profile-phone');
  var bioEl = document.getElementById('profile-bio');
  var savedEl = document.getElementById('profile-saved');
  var editBtn = document.getElementById('edit-profile');
  var form = document.getElementById('profile-form');
  var formTitle = document.getElementById('profile-form-title');
  var saveBtn = document.getElementById('profile-save');
  var cancelBtn = document.getElementById('profile-cancel');
  var currentUser = null;

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
    // Don't yank the form away mid-edit when the session refreshes in the background.
    if (session && !form.hidden) { currentUser = session.user; return; }
    form.hidden = true;
    if (!session) {
      currentUser = null;
      signedIn.hidden = true;
      signedOut.hidden = false;
      backLink.hidden = false;
      return;
    }
    var user = session.user;
    currentUser = user;
    var meta = user.user_metadata || {};
    // Profile fields use their own keys: Google refreshes full_name/avatar_url on every sign-in.
    var name = meta.display_name || meta.full_name || meta.name || user.email || 'Signed in';
    var picture = meta.display_avatar_url || meta.avatar_url || meta.picture;
    var hasProfile = !!meta.profile_updated_at;

    phoneEl.textContent = meta.phone_number || '';
    phoneEl.hidden = !meta.phone_number;
    bioEl.textContent = meta.bio || '';
    bioEl.hidden = !meta.bio;
    editBtn.textContent = hasProfile ? 'Edit profile' : 'Create your profile';

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

  function openForm() {
    var meta = (currentUser && currentUser.user_metadata) || {};
    var hasProfile = !!meta.profile_updated_at;
    formTitle.textContent = hasProfile ? 'Edit your profile' : 'Create your profile';
    form.elements.display_name.value = meta.display_name || meta.full_name || meta.name || '';
    form.elements.display_avatar_url.value = meta.display_avatar_url || meta.avatar_url || meta.picture || '';
    form.elements.phone_number.value = meta.phone_number || '';
    form.elements.bio.value = meta.bio || '';
    errorBox.hidden = true;
    savedEl.hidden = true;
    signedIn.hidden = true;
    form.hidden = false;
    form.elements.display_name.focus();
  }

  editBtn.addEventListener('click', openForm);

  cancelBtn.addEventListener('click', function () {
    form.hidden = true;
    signedIn.hidden = false;
    errorBox.hidden = true;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    var name = form.elements.display_name.value.trim();
    var photo = form.elements.display_avatar_url.value.trim();
    if (!name) { showError('Please enter a display name.'); return; }
    if (photo && !/^https:\/\//i.test(photo)) { showError('Profile picture URL must start with https://'); return; }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    client.auth.updateUser({
      data: {
        display_name: name,
        display_avatar_url: photo,
        phone_number: form.elements.phone_number.value.trim(),
        bio: form.elements.bio.value.trim(),
        profile_updated_at: new Date().toISOString()
      }
    }).then(function (res) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save profile';
      if (res.error) { showError(res.error.message); return; }
      return client.auth.getSession().then(function (s) {
        form.hidden = true;
        render(s.data.session);
        savedEl.hidden = false;
      });
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
