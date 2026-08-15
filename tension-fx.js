(function () {
  var FAILS_KEY = 'questFails';

  function beep() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 720;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.09);
      osc.onended = function () { ctx.close(); };
    } catch (e) {}
  }

  var flash = document.createElement('div');
  flash.className = 'tension-flash';
  document.body.appendChild(flash);

  var vignette = document.createElement('div');
  vignette.className = 'danger-vignette';
  document.body.appendChild(vignette);

  var blood = document.createElement('div');
  blood.className = 'blood-buildup';
  document.body.appendChild(blood);

  var jumpscare = document.createElement('div');
  jumpscare.className = 'jumpscare';
  jumpscare.innerHTML =
    '<svg class="jumpscare__saw" viewBox="0 0 200 200" aria-hidden="true">' +
    '<path d="M 104.0 100.0 L 104.7 100.8 L 105.3 101.9 L 105.5 103.2 L 105.5 104.6 L 105.1 106.1 L 104.4 107.6 L 103.3 109.0 L 101.8 110.2 L 100.0 111.2 L 97.9 111.8 L 95.6 112.0 L 93.2 111.7 L 90.8 111.0 L 88.4 109.7 L 86.2 108.0 L 84.3 105.7 L 82.7 103.0 L 81.7 100.0 L 81.2 96.7 L 81.3 93.2 L 82.1 89.6 L 83.5 86.2 L 85.7 82.9 L 88.4 80.0 L 91.8 77.5 L 95.7 75.7 L 100.0 74.5 L 104.6 74.1 L 109.3 74.5 L 113.9 75.8 L 118.4 78.0 L 122.6 81.0 L 126.2 84.9 L 129.2 89.4 L 131.4 94.5 L 132.7 100.0 L 133.0 105.8 L 132.2 111.7 L 130.4 117.5 L 127.5 123.0 L 123.6 128.1 L 118.7 132.4 L 113.1 135.9 L 106.8 138.4 L 100.0 139.8 L 92.9 140.0 L 85.8 138.9 L 78.9 136.6 L 72.3 133.0 L 66.4 128.2 L 61.4 122.3 L 57.3 115.5 L 54.5 108.0 L 53.0 100.0 L 52.9 91.7 L 54.3 83.4 L 57.2 75.3 L 61.6 67.7 L 67.2 60.9 L 74.1 55.2 L 82.0 50.6 L 90.7 47.4 L 100.0 45.8 L 109.5 45.9 L 119.1 47.6 L 128.3 51.0 L 136.9 56.1 L 144.5 62.6 L 151.0 70.5 L 156.1 79.6 L 159.6 89.5 L 161.3 100.0 L 161.2 110.8 L 159.1 121.5 L 155.2 131.9 L 149.4 141.5 L 142.0 150.0 L 133.1 157.3 L 122.9 162.9 L 111.8 166.7 L 100.0 168.5 L 88.0 168.2 L 76.0 165.9 L 64.6 161.4 L 53.9 154.9 L 44.5 146.6 L 36.5 136.6 L 30.4 125.3 L 26.3 113.0 L 24.3 100.0 L 24.7 86.7 L 27.4 73.6 L 32.4 61.0 L 39.6 49.3 L 48.8 39.0 L 59.8 30.3 L 72.2 23.7 L 85.8 19.2 L 100.0 17.2 L 114.5 17.6 L 128.9 20.7 L 142.6 26.2 L 155.3 34.1 L 166.5 44.2 L 175.9 56.2 L 183.1 69.8 L 187.8 84.5 L 190.0 100.0"/>' +
    '</svg>' +
    '<p class="jumpscare__text">ОШИБКА</p>';
  document.body.appendChild(jumpscare);

  function shake() {
    document.body.classList.remove('tension-shake');
    void document.body.offsetWidth;
    document.body.classList.add('tension-shake');
    setTimeout(function () {
      document.body.classList.remove('tension-shake');
    }, 420);
  }

  function redFlash() {
    flash.classList.remove('tension-flash--active');
    void flash.offsetWidth;
    flash.classList.add('tension-flash--active');
  }

  function playJumpscare() {
    jumpscare.classList.remove('jumpscare--active');
    void jumpscare.offsetWidth;
    jumpscare.classList.add('jumpscare--active');
    setTimeout(function () {
      jumpscare.classList.remove('jumpscare--active');
    }, 260);
  }

  function bumpFails() {
    var count = Number(sessionStorage.getItem(FAILS_KEY)) || 0;
    count += 1;
    sessionStorage.setItem(FAILS_KEY, String(count));
    applyBlood(count);
    return count;
  }

  function applyBlood(count) {
    blood.classList.remove('blood-buildup--1', 'blood-buildup--2', 'blood-buildup--3');
    if (count >= 9) blood.classList.add('blood-buildup--3');
    else if (count >= 5) blood.classList.add('blood-buildup--2');
    else if (count >= 2) blood.classList.add('blood-buildup--1');
  }

  applyBlood(Number(sessionStorage.getItem(FAILS_KEY)) || 0);

  window.TensionFX = {
    miss: function (opts) {
      opts = opts || {};
      shake();
      redFlash();
      var count = bumpFails();
      var chance = opts.jumpscareChance != null ? opts.jumpscareChance : 0.22;
      if (!opts.noJumpscare && Math.random() < chance) {
        setTimeout(playJumpscare, 120);
      }
      return count;
    },
    jumpscare: playJumpscare,
    danger: function (on) {
      document.body.classList.toggle('tension-danger', !!on);
      vignette.classList.toggle('danger-vignette--active', !!on);
    },
    tick: beep
  };
})();
