(function () {
  var SRC = 'uploads/theme.mp3';
  var STORAGE_KEY = 'musicOn';

  var audio = document.createElement('audio');
  audio.src = SRC;
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0.45;
  document.body.appendChild(audio);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'music-toggle';
  btn.setAttribute('aria-pressed', 'false');
  btn.innerHTML =
    '<svg class="music-toggle__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '</svg>';
  document.body.appendChild(btn);

  function setState(on) {
    btn.classList.toggle('music-toggle--on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Выключить музыку' : 'Включить музыку';
  }

  function play() {
    audio.play().then(function () {
      localStorage.setItem(STORAGE_KEY, '1');
      setState(true);
    }).catch(function () {
      setState(false);
    });
  }

  function pause() {
    audio.pause();
    localStorage.setItem(STORAGE_KEY, '0');
    setState(false);
  }

  btn.addEventListener('click', function () {
    if (audio.paused) play(); else pause();
  });

  setState(false);
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    play();
  }
})();
