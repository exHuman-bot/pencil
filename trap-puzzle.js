(function () {
  var SIZE = 3;
  var NEXT_PAGE = 'intro-match.html';
  var SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  // Чтобы добавить/поменять картинку — просто отредактируй этот массив.
  // ratio — реальное соотношение сторон файла (ширина/высота), чтобы плитки не искажались.
  var ROUNDS = [
    { src: 'uploads/puzzle-photo.jpg', ratio: 1919 / 2560 },
    { src: 'uploads/puzzle-photo-2.jpg', ratio: 1280 / 1280 },
    { src: 'uploads/puzzle-photo-3.jpg', ratio: 283 / 600 }
  ];

  var board = document.getElementById('puzzle-board');
  var feedback = document.getElementById('trap-feedback');
  var progress = document.getElementById('trap-progress');
  var screen = document.getElementById('trap-screen');
  if (!board) return;

  var roundIndex = 0;
  var tiles;

  function rowCol(i) {
    return { row: Math.floor(i / SIZE), col: i % SIZE };
  }

  function isSolved() {
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i] !== SOLVED[i]) return false;
    }
    return true;
  }

  function emptyIndex() {
    return tiles.indexOf(0);
  }

  function canMove(i) {
    var e = emptyIndex();
    var a = rowCol(i);
    var b = rowCol(e);
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  function shuffle() {
    var e = emptyIndex();
    var lastMoved = -1;

    for (var n = 0; n < 200; n++) {
      var rc = rowCol(e);
      var candidates = [
        [rc.row - 1, rc.col],
        [rc.row + 1, rc.col],
        [rc.row, rc.col - 1],
        [rc.row, rc.col + 1]
      ];
      var neighbors = [];
      candidates.forEach(function (pos) {
        var r = pos[0], c = pos[1];
        if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
          var idx = r * SIZE + c;
          if (idx !== lastMoved) neighbors.push(idx);
        }
      });
      if (!neighbors.length) continue;

      var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      var tmp = tiles[pick];
      tiles[pick] = tiles[e];
      tiles[e] = tmp;
      lastMoved = e;
      e = pick;
    }
  }

  function render(image) {
    board.innerHTML = '';
    tiles.forEach(function (value, i) {
      var tile = document.createElement('div');
      tile.className = 'puzzle-tile';

      if (value === 0) {
        tile.classList.add('puzzle-tile--empty');
      } else {
        var rc = rowCol(value - 1);
        tile.style.backgroundImage = 'url("' + image + '")';
        tile.style.backgroundPosition = (rc.col * 50) + '% ' + (rc.row * 50) + '%';
        tile.addEventListener('click', function () {
          handleClick(i);
        });
      }

      board.appendChild(tile);
    });
  }

  function startRound() {
    var round = ROUNDS[roundIndex];
    tiles = SOLVED.slice();
    shuffle();
    if (isSolved()) shuffle();

    board.style.aspectRatio = round.ratio;
    if (progress) progress.textContent = 'Снимок ' + (roundIndex + 1) + ' из ' + ROUNDS.length;
    if (feedback) feedback.textContent = '';
    if (screen) screen.classList.remove('trap-screen--correct');

    render(round.src);
  }

  function handleClick(i) {
    if (!canMove(i)) return;

    var e = emptyIndex();
    var tmp = tiles[i];
    tiles[i] = tiles[e];
    tiles[e] = tmp;
    render(ROUNDS[roundIndex].src);

    if (isSolved()) {
      var isLast = roundIndex >= ROUNDS.length - 1;
      if (screen) screen.classList.add('trap-screen--correct');
      if (feedback) {
        feedback.textContent = isLast
          ? 'Все снимки собраны. Переход дальше...'
          : 'Собрано. Следующий снимок...';
      }

      setTimeout(function () {
        if (isLast) {
          window.location.href = NEXT_PAGE;
        } else {
          roundIndex += 1;
          startRound();
        }
      }, 1300);
    }
  }

  startRound();
})();
