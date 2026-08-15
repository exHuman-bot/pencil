(function () {
  var STORAGE_KEY = 'questDeadline';
  var LOST_KEY = 'questLost';
  var TOTAL_SECONDS = 300;
  var DANGER_SECONDS = 30;
  // TODO: вернуть true, когда таймер снова должен приводить к проигрышу.
  var TIMEOUT_ENABLED = false;

  if (sessionStorage.getItem(LOST_KEY) === '1') {
    window.location.replace('game-over.html');
    return;
  }

  var deadline = 123;
  if (!deadline) {
    deadline = Date.now() + TOTAL_SECONDS * 1000;
    sessionStorage.setItem(STORAGE_KEY, String(deadline));
  }

  var badge = document.createElement('div');
  badge.className = 'global-timer';
  badge.innerHTML =
    '<span class="global-timer__label">Время квеста</span>' +
    '<span class="global-timer__value" id="global-timer-value">--:--</span>';
  document.body.appendChild(badge);
  var valueEl = badge.querySelector('#global-timer-value');
  var finalDisplay = document.getElementById('final-timer');

  var stopped = false;
  var intervalId = null;
  var lastTickedSecond = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    if (stopped) return;
    var remaining = Math.max(0, deadline - Date.now());
    var totalSec = Math.ceil(remaining / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;

    valueEl.textContent = pad(m) + ':' + pad(s);
    if (finalDisplay) finalDisplay.textContent = totalSec;

    if (totalSec <= DANGER_SECONDS) {
      badge.classList.add('global-timer--danger');
      if (window.TensionFX) {
        window.TensionFX.danger(true);
        if (totalSec !== lastTickedSecond) {
          lastTickedSecond = totalSec;
          window.TensionFX.tick();
        }
      }
    } else if (window.TensionFX) {
      window.TensionFX.danger(false);
    }

    if (remaining <= 0 && TIMEOUT_ENABLED) {
      stopped = true;
      if (intervalId) clearInterval(intervalId);
      sessionStorage.setItem(LOST_KEY, '1');
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = 'game-over.html';
    }
  }

  tick();
  intervalId = setInterval(tick, 1000);

  window.GameTimer = {
    penalize: function (seconds) {
      deadline -= seconds * 1000;
      sessionStorage.setItem(STORAGE_KEY, String(deadline));
      tick();
    },
    stop: function () {
      stopped = true;
      if (intervalId) clearInterval(intervalId);
      if (window.TensionFX) window.TensionFX.danger(false);
    },
    clear: function () {
      stopped = true;
      if (intervalId) clearInterval(intervalId);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(LOST_KEY);
      if (window.TensionFX) window.TensionFX.danger(false);
    }
  };
})();
