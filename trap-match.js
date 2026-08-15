(function () {
  var NEXT_PAGE = 'intro-maze.html';

  // Чтобы поменять пары — просто отредактируй этот массив.
  var PAIRS = [
    { id: 1, left: 'Ловушка № 1', right: 'Загадка бегемота' },
    { id: 2, left: 'Ловушка № 2', right: 'Тишина' },
    { id: 3, left: 'Ловушка № 3', right: 'Четыре двери' },
    { id: 4, left: 'Финал', right: 'Последний шанс' }
  ];

  var leftCol = document.getElementById('match-left');
  var rightCol = document.getElementById('match-right');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  if (!leftCol || !rightCol) return;

  var matchedCount = 0;
  var selectedLeft = null;
  var selectedRight = null;

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function makeItem(text, id, side) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'match-item';
    btn.textContent = text;
    btn.dataset.id = id;
    btn.dataset.side = side;
    btn.addEventListener('click', function () {
      handleClick(btn);
    });
    return btn;
  }

  shuffle(PAIRS).forEach(function (pair) {
    var li = document.createElement('li');
    li.appendChild(makeItem(pair.left, pair.id, 'left'));
    leftCol.appendChild(li);
  });

  shuffle(PAIRS).forEach(function (pair) {
    var li = document.createElement('li');
    li.appendChild(makeItem(pair.right, pair.id, 'right'));
    rightCol.appendChild(li);
  });

  function clearSelection() {
    if (selectedLeft) selectedLeft.classList.remove('match-item--selected');
    if (selectedRight) selectedRight.classList.remove('match-item--selected');
    selectedLeft = null;
    selectedRight = null;
  }

  function handleClick(btn) {
    if (btn.disabled) return;
    var side = btn.dataset.side;

    if (side === 'left') {
      if (selectedLeft) selectedLeft.classList.remove('match-item--selected');
      selectedLeft = btn;
    } else {
      if (selectedRight) selectedRight.classList.remove('match-item--selected');
      selectedRight = btn;
    }
    btn.classList.add('match-item--selected');

    if (selectedLeft && selectedRight) {
      if (selectedLeft.dataset.id === selectedRight.dataset.id) {
        selectedLeft.classList.remove('match-item--selected');
        selectedRight.classList.remove('match-item--selected');
        selectedLeft.classList.add('match-item--matched');
        selectedRight.classList.add('match-item--matched');
        selectedLeft.disabled = true;
        selectedRight.disabled = true;
        matchedCount += 1;
        selectedLeft = null;
        selectedRight = null;

        if (matchedCount >= PAIRS.length) {
          if (screen) screen.classList.add('trap-screen--correct');
          if (feedback) feedback.textContent = 'Все пары найдены. Переход дальше...';
          setTimeout(function () {
            window.location.href = NEXT_PAGE;
          }, 1200);
        } else if (feedback) {
          feedback.textContent = 'Верно.';
        }
      } else {
        var wrongLeft = selectedLeft, wrongRight = selectedRight;
        wrongLeft.classList.add('match-item--wrong');
        wrongRight.classList.add('match-item--wrong');
        if (feedback) feedback.textContent = 'Не совпадает.';
        if (window.TensionFX) window.TensionFX.miss({ jumpscareChance: 0.12 });
        setTimeout(function () {
          wrongLeft.classList.remove('match-item--wrong');
          wrongRight.classList.remove('match-item--wrong');
        }, 400);
        clearSelection();
      }
    }
  }
})();
