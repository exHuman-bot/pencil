(function () {
  var isHome = /\/(index\.html)?$/.test(window.location.pathname);
  var SRC = isHome ? 'uploads/saw_15 - Be Alright.mp3' : 'uploads/theme.mp3';
  var STORAGE_KEY = 'musicOn';
  var TIME_KEY = 'musicTime:' + SRC;

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

  function saveTime() {
    if (audio.currentTime > 0) {
      localStorage.setItem(TIME_KEY, String(audio.currentTime));
    }
  }

  // Продолжаем трек с того места, где он играл на предыдущей странице,
  // а не заново с нуля.
  audio.addEventListener('loadedmetadata', function () {
    var saved = parseFloat(localStorage.getItem(TIME_KEY));
    if (!isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved;
    }
  });

  var lastSaved = 0;
  audio.addEventListener('timeupdate', function () {
    var now = Date.now();
    if (now - lastSaved > 1000) {
      lastSaved = now;
      saveTime();
    }
  });

  window.addEventListener('pagehide', saveTime);
  window.addEventListener('beforeunload', saveTime);

  function play() {
    audio.play().then(function () {
      localStorage.setItem(STORAGE_KEY, '1');
      setState(true);
    }).catch(function () {
      setState(false);
    });
  }

  function pause() {
    saveTime();
    audio.pause();
    localStorage.setItem(STORAGE_KEY, '0');
    setState(false);
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) play(); else pause();
  });

  setState(false);

  var explicitlyOff = localStorage.getItem(STORAGE_KEY) === '0';

  if (!explicitlyOff) {
    play();

    if (audio.paused) {
      var startOnFirstTouch = function () {
        document.removeEventListener('pointerdown', startOnFirstTouch, true);
        document.removeEventListener('keydown', startOnFirstTouch, true);
        play();
      };
      document.addEventListener('pointerdown', startOnFirstTouch, true);
      document.addEventListener('keydown', startOnFirstTouch, true);
    }
  }

  window.MusicPlayer = { play: play, pause: pause };
})();
