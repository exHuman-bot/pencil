(function () {
  // Чтобы добавить новый вопрос — просто допиши объект в конец массива.
  // correct: true ставится ровно у одного варианта в каждом вопросе.
  var QUESTIONS = [
    {
      riddle: 'Что растёт, когда его отнимают?',
      options: [
        { text: 'Долг', correct: false },
        { text: 'Таймер', correct: false },
        { text: 'Дыра', correct: true },
        { text: 'Очередь', correct: false }
      ]
    },
    {
      riddle: 'Что можно поймать, не двигаясь с места?',
      options: [
        { text: 'Ветер', correct: false },
        { text: 'Простуду', correct: true },
        { text: 'Мяч', correct: false },
        { text: 'Такси', correct: false }
      ]
    },
    {
      riddle: 'У чего есть ключ, но нет замка?',
      options: [
        { text: 'У сейфа', correct: false },
        { text: 'У кода', correct: false },
        { text: 'У пианино', correct: true },
        { text: 'У двери', correct: false }
      ]
    }
  ];

  var PENALTY_SECONDS = 15;
  var NEXT_PAGE = 'intro-puzzle.html';
  var KEY_FRAGMENT = 'Д';

  var screen = document.getElementById('trap-screen');
  var progress = document.getElementById('trap-progress');
  var riddle = document.getElementById('trap-riddle');
  var choices = document.getElementById('trap-choices');
  var feedback = document.getElementById('trap-feedback');

  if (!screen || !progress || !riddle || !choices || !feedback) return;

  var index = 0;

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

  function renderQuestion() {
    var q = QUESTIONS[index];

    screen.classList.remove('trap-screen--correct', 'trap-screen--wrong');
    feedback.textContent = '';
    progress.textContent = 'Вопрос ' + (index + 1) + ' из ' + QUESTIONS.length;
    riddle.textContent = '«' + q.riddle + '»';

    choices.innerHTML = '';
    shuffle(q.options).forEach(function (opt) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'trap-choice';
      btn.type = 'button';
      btn.textContent = opt.text;
      if (opt.correct) btn.dataset.correct = '1';
      li.appendChild(btn);
      choices.appendChild(li);
    });
  }

  choices.addEventListener('click', function (e) {
    var btn = e.target.closest('.trap-choice');
    if (!btn || btn.disabled) return;

    screen.classList.remove('trap-screen--wrong');

    if (btn.dataset.correct === '1') {
      btn.classList.add('trap-choice--correct');
      screen.classList.add('trap-screen--correct');

      var isLast = index >= QUESTIONS.length - 1;
      if (isLast && window.QuestKey) window.QuestKey.addFragment('trap3', KEY_FRAGMENT);
      feedback.textContent = isLast
        ? 'Верно. Все двери пройдены. Фрагмент ключа: «' + KEY_FRAGMENT + '». Переход дальше...'
        : 'Верно. Следующая дверь...';

      choices.querySelectorAll('.trap-choice').forEach(function (b) {
        b.disabled = true;
      });

      setTimeout(function () {
        if (isLast) {
          window.location.href = NEXT_PAGE;
        } else {
          index += 1;
          renderQuestion();
        }
      }, 1100);
    } else {
      btn.classList.add('trap-choice--wrong');
      btn.disabled = true;
      screen.classList.add('trap-screen--wrong');
      if (window.GameTimer) window.GameTimer.penalize(PENALTY_SECONDS);
      if (window.TensionFX) window.TensionFX.miss();
      feedback.textContent = 'Мимо. Бегемот забирает у тебя ' + PENALTY_SECONDS + ' секунд общего времени.';
      setTimeout(function () {
        screen.classList.remove('trap-screen--wrong');
      }, 400);
    }
  });

  renderQuestion();
})();
