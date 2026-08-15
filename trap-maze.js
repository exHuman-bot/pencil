(function () {
  var NEXT_PAGE = 'intro-elimination.html';
  var PATH_D = 'M20,100 C90,20 140,180 200,100 C260,20 310,180 370,100 C410,60 450,140 480,100';
  var VB_W = 500, VB_H = 200;
  var HIT_WIDTH = 34;
  var START = { x: 20, y: 100 };
  var END = { x: 480, y: 100 };
  var END_RADIUS = 26;

  var wrap = document.getElementById('maze-wrap');
  var svg = document.getElementById('maze-svg');
  var feedback = document.getElementById('trap-feedback');
  var screen = document.getElementById('trap-screen');
  if (!wrap || !svg) return;

  var canvas = document.createElement('canvas');
  canvas.width = VB_W;
  canvas.height = VB_H;
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = HIT_WIDTH;
  ctx.lineCap = 'round';
  var hitPath = new Path2D(PATH_D);

  var armed = false;
  var done = false;

  function getPoint(evt) {
    var rect = svg.getBoundingClientRect();
    var t = evt.touches && evt.touches[0];
    var clientX = t ? t.clientX : evt.clientX;
    var clientY = t ? t.clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * (VB_W / rect.width),
      y: (clientY - rect.top) * (VB_H / rect.height)
    };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function arm() {
    if (done) return;
    armed = true;
    wrap.classList.add('maze-wrap--armed');
    if (feedback) feedback.textContent = 'Веди, не отрываясь, до конца.';
  }

  function fail() {
    armed = false;
    wrap.classList.remove('maze-wrap--armed');
    if (screen) {
      screen.classList.remove('trap-screen--wrong');
      void screen.offsetWidth;
      screen.classList.add('trap-screen--wrong');
    }
    if (feedback) feedback.textContent = 'Мимо. Начни заново.';
    if (window.TensionFX) window.TensionFX.miss({ jumpscareChance: 0.15 });
  }

  function succeed() {
    done = true;
    armed = false;
    wrap.classList.remove('maze-wrap--armed');
    if (screen) screen.classList.add('trap-screen--correct');
    if (feedback) feedback.textContent = 'Прошёл. Переход дальше...';
    setTimeout(function () {
      window.location.href = NEXT_PAGE;
    }, 1200);
  }

  function onMove(evt) {
    if (!armed || done) return;
    evt.preventDefault();
    var p = getPoint(evt);

    if (distance(p, END) <= END_RADIUS) {
      succeed();
      return;
    }
    if (!ctx.isPointInStroke(hitPath, p.x, p.y)) {
      fail();
    }
  }

  function onStartPress(evt) {
    var p = getPoint(evt);
    if (distance(p, START) <= END_RADIUS) {
      evt.preventDefault();
      arm();
    }
  }

  svg.addEventListener('pointerdown', onStartPress);
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('touchstart', onStartPress, { passive: false });
  svg.addEventListener('touchmove', onMove, { passive: false });
})();
