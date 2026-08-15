(function () {
  var ANSWERS = ['бегемот'];
  var NEXT_PAGE = 'intro-reaction.html';
  var KEY_FRAGMENT = 'А';

  var form = document.getElementById('trap-form');
  var input = document.getElementById('trap-answer');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');

  if (!form || !input || !feedback || !screen) return;

  function normalize(str) {
    return str.trim().toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = normalize(input.value);
    var isCorrect = ANSWERS.some(function (answer) {
      return normalize(answer) === value;
    });

    screen.classList.remove('trap-screen--correct', 'trap-screen--wrong');

    if (isCorrect) {
      screen.classList.add('trap-screen--correct');
      if (window.QuestKey) window.QuestKey.addFragment('trap4', KEY_FRAGMENT);
      feedback.textContent = 'Верно. Слово собрано. Фрагмент ключа: «' + KEY_FRAGMENT + '». Переход дальше...';
      form.querySelector('button').disabled = true;
      input.disabled = true;
      setTimeout(function () {
        window.location.href = NEXT_PAGE;
      }, 1200);
    } else {
      screen.classList.add('trap-screen--wrong');
      feedback.textContent = 'Неверно. Буквы легли не так.';
      if (window.TensionFX) window.TensionFX.miss();
      input.focus();
      input.select();
    }
  });
})();
