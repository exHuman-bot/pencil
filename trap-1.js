(function () {
  // Чтобы добавить новый вопрос — просто допиши объект в конец массива.
  // answers — все варианты написания ответа, которые засчитываются как верные.
  var QUESTIONS = [
    {
      riddle: 'Как зовут твою девушку?',
      answers: ['катя', 'катюша', 'екатерина']
    }
  ];

  var NEXT_PAGE = 'intro-2.html';
  var KEY_FRAGMENT = 'СВО';
  var MAX_WRONG = 5;

  var form = document.getElementById('trap-form');
  var input = document.getElementById('trap-answer');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  var progress = document.getElementById('trap-progress');
  var riddle = document.getElementById('trap-riddle');
  var sawLeft = document.getElementById('saw-left');
  var sawRight = document.getElementById('saw-right');

  if (!form || !input || !feedback || !screen || !progress || !riddle) return;

  var index = 0;
  var wrongCount = 0;

  function normalize(str) {
    return str.trim().toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');
  }

  function renderQuestion() {
    var q = QUESTIONS[index];

    screen.classList.remove('trap-screen--correct', 'trap-screen--wrong');
    feedback.textContent = '';
    progress.textContent = 'Вопрос ' + (index + 1) + ' из ' + QUESTIONS.length;
    riddle.textContent = '«' + q.riddle + '»';

    input.value = '';
    input.disabled = false;
    form.querySelector('button').disabled = false;
    input.focus();
  }

  function advanceSaws() {
    var advance = wrongCount / MAX_WRONG;
    [sawLeft, sawRight].forEach(function (saw) {
      if (!saw) return;
      saw.style.setProperty('--advance', advance);
      saw.classList.remove('saw--rev');
      void saw.offsetWidth;
      saw.classList.add('saw--rev');
    });
  }

  function finalCut() {
    form.querySelector('button').disabled = true;
    input.disabled = true;

    if (window.TensionFX) window.TensionFX.miss({ noJumpscare: true });

    sessionStorage.setItem('questLost', '1');
    sessionStorage.removeItem('questDeadline');

    var line = document.createElement('div');
    line.className = 'screen-cut-line screen-cut-line--active';
    document.body.appendChild(line);

    var blackout = document.createElement('div');
    blackout.className = 'screen-cut-blackout';
    blackout.innerHTML = '<p class="screen-cut-blackout__text">Пила была быстрее</p>';
    document.body.appendChild(blackout);

    setTimeout(function () {
      blackout.classList.add('screen-cut-blackout--active');
    }, 260);

    setTimeout(function () {
      window.location.href = 'game-over.html?reason=saw';
    }, 1400);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = QUESTIONS[index];
    var value = normalize(input.value);
    var isCorrect = q.answers.some(function (answer) {
      return normalize(answer) === value;
    });

    screen.classList.remove('trap-screen--wrong');

    if (isCorrect) {
      screen.classList.add('trap-screen--correct');
      var isLast = index >= QUESTIONS.length - 1;

      form.querySelector('button').disabled = true;
      input.disabled = true;

      if (isLast) {
        if (window.QuestKey) window.QuestKey.addFragment('trap1', KEY_FRAGMENT);
        feedback.textContent = 'Верно. Фрагмент ключа получен: «' + KEY_FRAGMENT + '». Переход дальше...';
        setTimeout(function () {
          window.location.href = NEXT_PAGE;
        }, 1200);
      } else {
        feedback.textContent = 'Верно. Следующий вопрос...';
        setTimeout(function () {
          index += 1;
          renderQuestion();
        }, 1000);
      }
    } else {
      wrongCount += 1;
      screen.classList.add('trap-screen--wrong');
      if (window.TensionFX) window.TensionFX.miss();
      advanceSaws();

      if (wrongCount >= MAX_WRONG) {
        finalCut();
        return;
      }

      feedback.textContent = 'Неверно. Бегемот ждёт другого ответа. Пилы всё ближе (' + wrongCount + ' из ' + MAX_WRONG + ').';
      input.focus();
      input.select();
    }
  });

  renderQuestion();
})();
