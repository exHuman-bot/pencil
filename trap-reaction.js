(function () {
  var TARGET_SCORE = 20;
  var DEFUSE_POINTS = 1;
  var BOMB_PENALTY = -2;
  var MIN_DELAY = 900;
  var MAX_DELAY = 2200;
  var MIN_VISIBLE = 500;
  var MAX_VISIBLE = 1000;
  var NEXT_PAGE = 'intro-5.html';

  var arena = document.getElementById('reaction-arena');
  var hint = document.getElementById('reaction-hint');
  var progress = document.getElementById('trap-progress');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  if (!arena) return;

  var score = 0;
  var activeButtons = [];
  var done = false;

  function updateProgress() {
    if (progress) progress.textContent = 'Очки: ' + score + ' из ' + TARGET_SCORE;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clearButtons() {
    activeButtons.forEach(function (item) {
      clearTimeout(item.hideTimeoutId);
      item.el.remove();
    });
    activeButtons = [];
  }

  function scheduleNext() {
    if (done) return;
    setTimeout(spawnWave, randomBetween(MIN_DELAY, MAX_DELAY));
  }

  function placeButton(kind) {
    var rect = arena.getBoundingClientRect();
    var btnW = 120, btnH = 44;
    var x = randomBetween(btnW / 2 + 8, rect.width - btnW / 2 - 8);
    var y = randomBetween(btnH / 2 + 8, rect.height - btnH / 2 - 8);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reaction-btn' + (kind === 'bomb' ? ' reaction-btn--bomb' : '');
    btn.textContent = kind === 'bomb' ? 'Бонус +5' : 'Обезвредить';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    arena.appendChild(btn);

    requestAnimationFrame(function () {
      btn.classList.add('reaction-btn--visible');
    });

    var visibleFor = randomBetween(MIN_VISIBLE, MAX_VISIBLE);
    var item = { el: btn, hideTimeoutId: null };

    function remove() {
      clearTimeout(item.hideTimeoutId);
      btn.remove();
      var idx = activeButtons.indexOf(item);
      if (idx !== -1) activeButtons.splice(idx, 1);
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (done) return;
      remove();

      if (kind === 'bomb') {
        score = Math.max(0, score + BOMB_PENALTY);
        if (feedback) feedback.textContent = 'Это была бомба. ' + BOMB_PENALTY + ' очка.';
        if (window.TensionFX) window.TensionFX.miss({ jumpscareChance: 0.1 });
      } else {
        score += DEFUSE_POINTS;
        if (feedback) feedback.textContent = 'Есть. +' + DEFUSE_POINTS + '.';
      }
      updateProgress();

      if (score >= TARGET_SCORE) {
        finish();
      }
    });

    item.hideTimeoutId = setTimeout(remove, visibleFor);
    activeButtons.push(item);
  }

  function spawnWave() {
    if (done) return;
    if (hint) hint.style.opacity = '0';

    placeButton('defuse');

    var bombCount = Math.random() < 0.65 ? 1 : (Math.random() < 0.3 ? 2 : 0);
    for (var i = 0; i < bombCount; i++) {
      placeButton('bomb');
    }

    scheduleNext();
  }

  function finish() {
    done = true;
    clearButtons();
    if (screen) screen.classList.add('trap-screen--correct');
    if (feedback) feedback.textContent = 'Обезврежено. Переход дальше...';
    setTimeout(function () {
      window.location.href = NEXT_PAGE;
    }, 1300);
  }

  updateProgress();
  scheduleNext();
})();
