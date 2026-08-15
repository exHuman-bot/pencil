(function () {
  var button = document.getElementById('debug-button');
  var modal = document.getElementById('debug-modal');
  if (!button || !modal) return;

  function close() {
    modal.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function () {
    modal.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  });

  modal.querySelectorAll('[data-debug-close]').forEach(function (element) {
    element.addEventListener('click', close);
  });

  modal.querySelectorAll('a.debug-trap').forEach(function (link) {
    link.addEventListener('click', function () {
      sessionStorage.removeItem('questDeadline');
      sessionStorage.removeItem('questLost');
      sessionStorage.removeItem('questKeyParts');
      sessionStorage.removeItem('trap6UnlockAt');
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });
})();
