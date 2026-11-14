/**
 * Yellow Wing Roasters - Order & Gift Card Confirmation Module
 * Parses URL parameters for gift card codes and handles clipboard copying.
 */
(function () {
  function initThanks() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    if (code) {
      var container = document.getElementById('gift-card-container');
      var codeEl = document.getElementById('gift-card-code');
      if (container && codeEl) {
        codeEl.textContent = code.trim().toUpperCase();
        container.style.display = 'block';
      }
    }

    var copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var codeEl = document.getElementById('gift-card-code');
        if (!codeEl) return;
        var codeText = codeEl.textContent;
        navigator.clipboard.writeText(codeText).then(function () {
          var status = document.getElementById('copy-status');
          if (status) {
            status.textContent = 'Code copied to clipboard!';
            setTimeout(function () {
              status.textContent = '';
            }, 3000);
          }
        }).catch(function (err) {
          console.error('Failed to copy text: ', err);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThanks);
  } else {
    initThanks();
  }
})();
