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

  var form = document.getElementById('trap-form');
  var input = document.getElementById('trap-answer');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  var progress = document.getElementById('trap-progress');
  var riddle = document.getElementById('trap-riddle');

  if (!form || !input || !feedback || !screen || !progress || !riddle) return;

  var index = 0;

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
      screen.classList.add('trap-screen--wrong');
      feedback.textContent = 'Неверно. Бегемот ждёт другого ответа.';
      if (window.TensionFX) window.TensionFX.miss();
      input.focus();
      input.select();
    }
  });

  renderQuestion();
})();
