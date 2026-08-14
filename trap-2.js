(function () {
  var DURATION = 60;
  var textEl = document.getElementById('blackout-text');
  var timerEl = document.getElementById('blackout-timer');

  if (!textEl || !timerEl) return;

  var remaining = DURATION;
  timerEl.textContent = remaining;

  var interval = setInterval(function () {
    remaining -= 1;

    if (remaining <= 0) {
      clearInterval(interval);
      timerEl.remove();
      textEl.textContent = 'Ты как обычно ничего не делал, но и никто от тебя не ушёл';
      textEl.classList.add('blackout__text--done');
      return;
    }

    timerEl.textContent = remaining;
  }, 1000);
})();
