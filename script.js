(function () {
  var prizeScreen = document.getElementById('prize-screen');
  var prizeReveal = document.getElementById('prize-reveal');

  function openPrizeReveal() {
    if (!prizeScreen || !prizeReveal || prizeScreen.hidden) return;
    prizeReveal.hidden = false;
    prizeScreen.setAttribute('aria-expanded', 'true');
    prizeScreen.hidden = true;
    requestAnimationFrame(function () {
      prizeReveal.classList.add('stakes-reveal--visible');
    });
  }

  if (prizeScreen && prizeReveal) {
    prizeScreen.addEventListener('click', openPrizeReveal);
  }
})();
