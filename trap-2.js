(function () {
  var DURATION = 60;
  var BAIT_AT_REMAINING = 30;
  var KEY_FRAGMENT = 'БО';

  var textEl = document.getElementById('blackout-text');
  var timerEl = document.getElementById('blackout-timer');
  var nextEl = document.getElementById('blackout-next');
  var content = document.querySelector('.blackout__content');

  if (!textEl || !timerEl) return;

  var remaining = DURATION;
  var finished = false;
  var baitShown = false;
  var baitBtn = null;
  timerEl.textContent = remaining;

  function spawnBaitButton() {
    if (baitShown || finished || !content) return;
    baitShown = true;

    baitBtn = document.createElement('button');
    baitBtn.type = 'button';
    baitBtn.className = 'btn btn--start bait-btn';
    baitBtn.textContent = 'Продолжить';
    content.appendChild(baitBtn);

    requestAnimationFrame(function () {
      baitBtn.classList.add('bait-btn--visible');
    });
  }

  function removeBaitButton() {
    if (baitBtn) {
      baitBtn.remove();
      baitBtn = null;
    }
  }

  function onInteract() {
    if (finished) return;
    finished = true;
    clearInterval(interval);
    document.removeEventListener('pointerdown', onInteract, true);
    document.removeEventListener('keydown', onInteract, true);
    sessionStorage.setItem('questLost', '1');
    sessionStorage.removeItem('questDeadline');
    if (window.TensionFX) {
      window.TensionFX.miss({ noJumpscare: true });
      window.TensionFX.jumpscare();
      setTimeout(function () {
        window.location.href = 'game-over.html?reason=click';
      }, 480);
    } else {
      window.location.href = 'game-over.html?reason=click';
    }
  }

  document.addEventListener('pointerdown', onInteract, true);
  document.addEventListener('keydown', onInteract, true);

  var interval = setInterval(function () {
    remaining -= 1;

    if (remaining === BAIT_AT_REMAINING) {
      spawnBaitButton();
    }

    if (remaining <= 0) {
      clearInterval(interval);
      finished = true;
      removeBaitButton();
      document.removeEventListener('pointerdown', onInteract, true);
      document.removeEventListener('keydown', onInteract, true);
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
