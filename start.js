(function () {
  sessionStorage.removeItem('questDeadline');
  sessionStorage.removeItem('questLost');
  sessionStorage.removeItem('questKeyParts');

  var PHRASES = [
    'Пила не спрашивает. Она решает.',
    'Слышишь визг? Это не мотор. Это твой страх.',
    'Каждый зубец — шанс, которым можно не воспользоваться.',
    'Механизм запущен. Обратного хода нет.',
    'Бегемот завёл пилу. Теперь дело за тобой.',
    'Игра проста: успей — или отдай кусок себя.',
    'Хочешь сыграть в игру?',
  ];

  var PHRASE_MS = 4200;
  var CUT_MS = 550;

  var stage = document.getElementById('phrase-stage');
  var enterBtn = document.getElementById('enter-btn');
  var content = document.querySelector('.start__content');
  var saw = document.getElementById('saw');
  if (!stage) return;

  var current = stage.querySelector('[data-phrase]');
  current.classList.add('phrase--active');

  var i = 0;

  function spawnSparks() {
    for (var n = 0; n < 10; n++) {
      var s = document.createElement('span');
      s.className = 'spark';
      var angle = Math.random() * Math.PI * 2;
      var dist = 18 + Math.random() * 34;
      s.style.setProperty('--sx', (Math.cos(angle) * dist) + 'px');
      s.style.setProperty('--sy', (Math.sin(angle) * dist) + 'px');
      s.style.left = (48 + Math.random() * 4) + '%';
      s.style.animationDelay = (Math.random() * 0.08) + 's';
      stage.appendChild(s);
      (function (el) {
        setTimeout(function () { el.remove(); }, 600);
      })(s);
    }
  }

  function sawCut(outgoing) {
    var top = outgoing.cloneNode(true);
    var bottom = outgoing.cloneNode(true);
    top.removeAttribute('data-phrase');
    bottom.removeAttribute('data-phrase');
    top.className = 'phrase phrase--half phrase--half-top';
    bottom.className = 'phrase phrase--half phrase--half-bottom';
    stage.appendChild(top);
    stage.appendChild(bottom);
    outgoing.remove();

    var line = document.createElement('div');
    line.className = 'cut-line';
    stage.appendChild(line);

    if (content) {
      content.classList.remove('start__content--shake');
      void content.offsetWidth;
      content.classList.add('start__content--shake');
    }
    if (saw) {
      saw.classList.remove('saw--rev');
      void saw.offsetWidth;
      saw.classList.add('saw--rev');
    }

    requestAnimationFrame(function () {
      top.classList.add('phrase--cut');
      bottom.classList.add('phrase--cut');
      spawnSparks();
    });

    setTimeout(function () {
      top.remove();
      bottom.remove();
      line.remove();
    }, CUT_MS + 80);
  }

  function showNext() {
    i += 1;
    if (i >= PHRASES.length) {
      if (enterBtn) {
        setTimeout(function () {
          enterBtn.classList.add('start__enter--ready');
        }, 250);
      }
      return;
    }

    sawCut(current);

    var next = document.createElement('p');
    next.className = 'phrase';
    next.setAttribute('data-phrase', '');
    next.textContent = PHRASES[i];
    stage.appendChild(next);

    setTimeout(function () {
      next.classList.add('phrase--active');
    }, 260);

    current = next;
    setTimeout(showNext, PHRASE_MS);
  }

  setTimeout(showNext, PHRASE_MS);
})();
