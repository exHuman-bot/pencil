(function () {
  var board = document.getElementById('image-board');
  var feedback = document.getElementById('image-feedback');
  if (!board || !feedback) return;

  board.querySelectorAll('.image-card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.add('image-card--open');
      if (card.dataset.correct !== 'true') {
        card.classList.add('image-card--wrong');
        feedback.textContent = 'НЕ НАШЕЛ';
        return;
      }
      feedback.textContent = 'И Верно. И обидно. Ловушка пройдена.';
      feedback.classList.add('game-task__feedback--success');
      board.querySelectorAll('.image-card').forEach(function (item) { item.disabled = true; });
      setTimeout(function () { window.location.href = 'index.html#prize-title'; }, 2000);
    });
  });
})();
