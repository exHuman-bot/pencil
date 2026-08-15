(function () {
  var TILE_COUNT = 9;
  var ELIMINATE_INTERVAL = 1100;
  var FINAL_WINDOW = 1600;
  var NEXT_PAGE = 'intro-4.html';

  var board = document.getElementById('elim-board');
  var feedback = document.getElementById('trap-feedback');
  var progress = document.getElementById('trap-progress');
  var screen = document.getElementById('trap-screen');
  if (!board) return;

  var tiles = [];
  var remaining = [];
  var eliminateTimer = null;
  var finalTimer = null;
  var done = false;

  function buildBoard() {
    board.innerHTML = '';
    tiles = [];
    remaining = [];
    for (var i = 0; i < TILE_COUNT; i++) {
      var tile = document.createElement('div');
      tile.className = 'elim-tile';
      tile.textContent = String(i + 1);
      board.appendChild(tile);
      tiles.push(tile);
      remaining.push(i);
    }
  }

  function eliminateOne() {
    if (remaining.length <= 1) return;
    var idx = Math.floor(Math.random() * remaining.length);
    var tileIndex = remaining[idx];
    remaining.splice(idx, 1);
    tiles[tileIndex].classList.add('elim-tile--gone');

    if (remaining.length === 1) {
      armSurvivor();
    } else {
      eliminateTimer = setTimeout(eliminateOne, ELIMINATE_INTERVAL);
    }
  }

  function armSurvivor() {
    var survivorTile = tiles[remaining[0]];
    survivorTile.classList.add('elim-tile--survivor');
    if (feedback) feedback.textContent = 'Успей нажать!';

    survivorTile.addEventListener('click', onSurvivorClick);

    finalTimer = setTimeout(function () {
      if (done) return;
      survivorTile.removeEventListener('click', onSurvivorClick);
      if (feedback) feedback.textContent = 'Не успел. Заново.';
      if (window.TensionFX) window.TensionFX.miss({ jumpscareChance: 0.15 });
      restart();
    }, FINAL_WINDOW);
  }

  function onSurvivorClick() {
    if (done) return;
    done = true;
    clearTimeout(finalTimer);
    if (screen) screen.classList.add('trap-screen--correct');
    if (feedback) feedback.textContent = 'Успел. Переход дальше...';
    setTimeout(function () {
      window.location.href = NEXT_PAGE;
    }, 1200);
  }

  function restart() {
    clearTimeout(eliminateTimer);
    clearTimeout(finalTimer);
    buildBoard();
    eliminateTimer = setTimeout(eliminateOne, ELIMINATE_INTERVAL);
  }

  if (progress) progress.textContent = 'Останется только один.';
  buildBoard();
  eliminateTimer = setTimeout(eliminateOne, ELIMINATE_INTERVAL);
})();
