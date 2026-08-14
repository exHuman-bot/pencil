(function () {
  var NEXT_PAGE = 'index.html#prize-title';

  var form = document.getElementById('trap-form');
  var input = document.getElementById('trap-answer');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  var keyPartsEl = document.getElementById('key-parts');

  if (!form || !input || !feedback || !screen) return;

  function normalize(str) {
    return str.trim().toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');
  }

  var parts = window.QuestKey ? window.QuestKey.getParts() : {};
  var order = window.QuestKey ? window.QuestKey.order : [];
  var fullKey = window.QuestKey ? window.QuestKey.getFull() : '';

  if (keyPartsEl) {
    order.forEach(function (id) {
      var li = document.createElement('li');
      var value = parts[id];
      li.className = 'key-parts__tile' + (value ? '' : ' key-parts__tile--missing');
      li.textContent = value || '?';
      keyPartsEl.appendChild(li);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var normalizedKey = normalize(fullKey);
    var isCorrect = normalizedKey.length > 0 && normalize(input.value) === normalizedKey;

    screen.classList.remove('trap-screen--wrong');

    if (isCorrect) {
      screen.classList.add('trap-screen--correct');
      feedback.textContent = 'Верно. Ключ подошёл. Дверь открывается...';
      form.querySelector('button').disabled = true;
      input.disabled = true;
      if (window.GameTimer) window.GameTimer.clear();
      if (window.QuestKey) window.QuestKey.reset();
      setTimeout(function () {
        window.location.href = NEXT_PAGE;
      }, 1400);
    } else {
      screen.classList.add('trap-screen--wrong');
      feedback.textContent = normalizedKey.length > 0
        ? 'Неверно. Пила крутится дальше.'
        : 'У тебя нет всех фрагментов. Вернись и пройди пропущенные ловушки.';
      input.focus();
      input.select();
    }
  });
})();
