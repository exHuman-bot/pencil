(function () {
  var DURATION = 60;
  var KEY_FRAGMENT = 'БО';
  var textEl = document.getElementById('blackout-text');
  var timerEl = document.getElementById('blackout-timer');
  var nextEl = document.getElementById('blackout-next');

  if (!textEl || !timerEl) return;

  var remaining = DURATION;
  timerEl.textContent = remaining;

  var interval = setInterval(function () {
    remaining -= 1;

    if (remaining <= 0) {
      clearInterval(interval);
      timerEl.remove();
      if (window.QuestKey) window.QuestKey.addFragment('trap2', KEY_FRAGMENT);
      textEl.textContent = 'Ты как обычно ничего не делал, но и никто от тебя не ушёл. Фрагмент ключа: «' + KEY_FRAGMENT + '»';
      textEl.classList.add('blackout__text--done');
      if (nextEl) nextEl.classList.add('start__enter--ready');
      return;
    }

    timerEl.textContent = remaining;
  }, 1000);
})();
