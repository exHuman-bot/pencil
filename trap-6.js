(function () {
  var board = document.getElementById('shape-board');
  var feedback = document.getElementById('shape-feedback');
  var message = document.getElementById('shape-message');
  if (!board || !feedback) return;

  var target = board.querySelector('.shape--target');
  var decoy = board.querySelector('.shape--decoy');
  var runner = board.querySelector('.shape--runner');
  var targetUnlocked = false;
  var runnerMoving = false;
  var messageTimer = null;
  var unlockAt = Number(sessionStorage.getItem('trap6UnlockAt'));
  if (!unlockAt) {
    unlockAt = Date.now() + 30000;
    sessionStorage.setItem('trap6UnlockAt', String(unlockAt));
  }

  function scatter() {
    board.querySelectorAll('.shape:not(.shape--runner)').forEach(function (shape) {
      shape.style.left = (7 + Math.random() * 86) + '%';
      shape.style.top = (13 + Math.random() * 78) + '%';
    });
  }

  function showMessage(text, shape, duration) {
    clearTimeout(messageTimer);
    var rect = shape.getBoundingClientRect();
    message.textContent = text;
    message.style.left = rect.left + rect.width / 2 + 'px';
    message.style.top = rect.bottom + 8 + 'px';
    message.hidden = false;
    messageTimer = setTimeout(function () { message.hidden = true; }, duration);
  }

  function moveRunner() {
    runner.style.left = (40 + Math.random() * Math.max(1, window.innerWidth - 80)) + 'px';
    runner.style.top = (70 + Math.random() * Math.max(1, window.innerHeight - 110)) + 'px';
    runner.style.transform = 'translate(-50%, -50%)';
  }

  function escapeRunner() {
    if (runnerMoving) return;
    runnerMoving = true;
    var moves = 0;
    moveRunner();
    var interval = setInterval(function () {
      moves += 1;
      if (moves >= 5) {
        clearInterval(interval);
        runnerMoving = false;
        return;
      }
      moveRunner();
    }, 150);
  }

  target.addEventListener('mouseenter', function () {
    if (Date.now() >= unlockAt) {
      targetUnlocked = true;
      target.classList.add('shape--target-ready');
    }
  });
  target.addEventListener('click', function () {
    if (!targetUnlocked) {
      showMessage('Ты вообще еблан?', target, 1000);
      return;
    }
    feedback.textContent = 'ВЕРНО. КРАСНЫЙ КРУГ НАЙДЕН. Наконец-то';
    board.classList.add('shape-board--success');
    board.querySelectorAll('.shape').forEach(function (shape) { shape.disabled = true; });
    setTimeout(function () { window.location.href = 'trap-7.html'; }, 2000);
  });
  decoy.addEventListener('click', function () { showMessage('Это синий круг, тупица', decoy, 2000); });
  runner.addEventListener('mouseenter', escapeRunner);
  board.querySelectorAll('.shape:not(.shape--target):not(.shape--decoy):not(.shape--runner)').forEach(function (shape) {
    shape.addEventListener('click', function () { showMessage('Ты вообще еблан?', shape, 1000); });
  });
  scatter();
})();
