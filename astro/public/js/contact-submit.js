/**
 * Aerial Optic — Contact form submission with Turnstile
 * Submits to Opsidian API POST /forms/contact
 */
(function () {
  var API = 'https://api.opsidian.com';
  var ORG_ID = 'f4ca0937-7fe4-4889-9b2a-dea22d48e70e';
  var turnstileLoaded = false;
  var turnstileSiteKey = null;

  // Fetch Turnstile site key for this org
  fetch(API + '/forms/config/' + ORG_ID)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      turnstileSiteKey = data.turnstile_site_key;
    })
    .catch(function () {});

  // Lazy-load Turnstile script on form interaction
  function loadTurnstile() {
    if (turnstileLoaded) return;
    turnstileLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    s.async = true;
    document.head.appendChild(s);
  }

  // Render Turnstile widgets once script loads
  window.onTurnstileLoad = function () {
    if (!turnstileSiteKey) return;
    document.querySelectorAll('.cf-turnstile').forEach(function (el) {
      if (el.dataset.rendered) return;
      el.dataset.rendered = '1';
      turnstile.render(el, { sitekey: turnstileSiteKey, theme: 'light' });
    });
  };

  // Attach to all contact forms
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    // Load Turnstile on interaction
    ['focusin', 'pointerdown'].forEach(function (evt) {
      form.addEventListener(evt, loadTurnstile, { once: true, passive: true });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending...';

      // Gather form data
      var fd = new FormData(form);
      var payload = {
        org_id: ORG_ID,
        notify_email: 'Aerialoptic1@outlook.com',
        thankyou_email: 'bradley@aerialoptic.net',
      };
      fd.forEach(function (value, key) {
        if (key !== 'cf-turnstile-response') payload[key] = value;
      });

      // Get Turnstile token from the widget
      var turnstileInput = form.querySelector('[name="cf-turnstile-response"]');
      if (turnstileInput && turnstileInput.value) {
        payload.turnstile_token = turnstileInput.value;
      }

      fetch(API + '/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submission failed');
          return res.json();
        })
        .then(function () {
          form.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
            '<h3 style="color:#147170;margin-bottom:15px;">Message sent</h3>' +
            '<p>We\'ll get back to you within 24 hours.</p></div>';
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = originalText;
          var err = form.querySelector('.form-error');
          if (!err) {
            err = document.createElement('p');
            err.className = 'form-error';
            err.style.cssText = 'color:#d32f2f;margin-top:15px;font-size:14px;';
            btn.parentNode.insertBefore(err, btn.nextSibling);
          }
          err.textContent = 'Something went wrong. Please try again or call us at 443-966-5968.';
        });
    });
  });

  // Service "other" field toggle
  var selects = document.querySelectorAll('#service-select');
  selects.forEach(function (sel) {
    sel.addEventListener('change', function () {
      var form = sel.closest('form');
      var otherField = form.querySelector('#other-service-field') || form.querySelector('[data-other-field]');
      if (!otherField) return;
      var otherInput = otherField.querySelector('input');
      if (sel.value === 'other') {
        otherField.style.display = 'block';
        if (otherInput) otherInput.required = true;
      } else {
        otherField.style.display = 'none';
        if (otherInput) { otherInput.required = false; otherInput.value = ''; }
      }
    });
  });
})();
