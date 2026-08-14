(function () {
  var COUNTDOWN_TARGET = '2026-09-01T18:00:00';
  var DISCORD_URL = '#';

  var discordLink = document.getElementById('discord-link');
  if (discordLink) discordLink.href = DISCORD_URL;

  var target = new Date(COUNTDOWN_TARGET).getTime();
  var values = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  var countdownEl = document.getElementById('countdown');
  if (countdownEl) countdownEl.classList.add('countdown--danger');

  function tick() {
    var diff = Math.max(0, target - Date.now());
    var day = Math.floor(diff / 86400000);
    var hr = Math.floor((diff % 86400000) / 3600000);
    var min = Math.floor((diff % 3600000) / 60000);
    var sec = Math.floor((diff % 60000) / 1000);

    if (values.days) values.days.textContent = pad(day);
    if (values.hours) values.hours.textContent = pad(hr);
    if (values.minutes) values.minutes.textContent = pad(min);
    if (values.seconds) values.seconds.textContent = pad(sec);
  }

  tick();
  setInterval(tick, 1000);

  var prizeScreen = document.getElementById('prize-screen');
  var prizeVideoWrap = document.getElementById('prize-video-wrap');
  var prizeVideo = document.getElementById('prize-video');

  if (prizeScreen && prizeVideoWrap && prizeVideo) {
    prizeScreen.addEventListener('click', function () {
      prizeVideoWrap.hidden = false;
      prizeScreen.setAttribute('aria-expanded', 'true');
      prizeScreen.hidden = true;
      prizeVideo.play().catch(function () {});
    });
  }
})();
