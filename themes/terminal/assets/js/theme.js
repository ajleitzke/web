(function () {
  'use strict';

  var defaultTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  function getStoredTheme() {
    return localStorage.getItem('theme');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleIcon(theme);
    updateGiscusTheme(theme);
  }

  function updateToggleIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Sun icon for dark mode (click to go light), moon for light mode (click to go dark)
    if (theme === 'dark') {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } else {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  function updateGiscusTheme(theme) {
    var giscusTheme = theme === 'dark' ? 'transparent_dark' : 'light';
    var iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  // Init
  var stored = getStoredTheme();
  if (stored) {
    setTheme(stored);
  } else {
    var resolved = defaultTheme;
    if (resolved === 'auto') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(resolved);
  }

  // Bind toggle button
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
      // Set initial icon
      updateToggleIcon(document.documentElement.getAttribute('data-theme'));
    }

    // Mobile hamburger menu
    var menuBtn = document.getElementById('menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });

      // Close menu when a link is clicked
      var menuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
      for (var i = 0; i < menuLinks.length; i++) {
        menuLinks[i].addEventListener('click', function () {
          menuBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      }
    }

    // Copy code buttons
    var highlights = document.querySelectorAll('.highlight');
    for (var i = 0; i < highlights.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'copy-code';
      btn.textContent = 'copy';
      highlights[i].appendChild(btn);

      btn.addEventListener('click', (function (block) {
        return function () {
          var code = block.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent).then(function () {
              var b = block.querySelector('.copy-code');
              b.textContent = 'copied!';
              setTimeout(function () { b.textContent = 'copy'; }, 2000);
            });
          }
        };
      })(highlights[i]));
    }
  });

  // Listen for OS theme changes when in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!getStoredTheme()) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
