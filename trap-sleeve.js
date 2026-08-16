(function () {
  var block = document.getElementById('block');
  var horns = document.getElementById('horns');
  var floatImg = document.getElementById('float');
  var floatImgLeft = document.getElementById('float-left');
  var status = document.getElementById('status');
  if (!block) return;

  var dragging = false;
  var startY = 0;
  var startTop = -4540;
  var initialTop = -4540;
  var top = -4540;
  var hornShown = false;
  var HORNS_TRIGGER = 5000;
  var completed = false;
  var failed = false;
  var nextTimer = null;
  var failTimer = null;
  var rightFloatDuration = 26;

  function syncFloatTimings() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var rightDistance = viewportWidth * 0.6;
    var leftDistance = viewportWidth * 1.6 - 1200;
    var leftFloatDuration = rightFloatDuration;

    if (rightDistance > 0 && leftDistance > 0) {
      leftFloatDuration = rightFloatDuration * (leftDistance / rightDistance);
    }

    if (floatImg) {
      floatImg.style.animationDuration = rightFloatDuration + 's';
    }

    if (floatImgLeft) {
      floatImgLeft.style.animationDuration = leftFloatDuration + 's';
    }
  }

  function completeTask() {
    if (completed || failed) return;
    completed = true;
    if (status) {
      status.textContent = 'Ловушка пройдена';
      status.classList.add('line-only-task__status--visible');
      status.classList.remove('line-only-task__status--fail');
    }
    clearTimeout(nextTimer);
    clearTimeout(failTimer);
    nextTimer = setTimeout(function () {
      window.location.href = 'trap-2.html';
    }, 10000);
  }

  function failTask() {
    if (completed || failed) return;
    failed = true;
    if (status) {
      status.textContent = 'Ловушка провалена';
      status.classList.add('line-only-task__status--visible', 'line-only-task__status--fail');
    }
    clearTimeout(nextTimer);
    clearTimeout(failTimer);
    failTimer = setTimeout(function () {
      window.location.href = 'index.html';
    }, 5000);
  }

  function setTop(value) {
    top = value;
    block.style.top = top + 'px';
    if (!hornShown && horns && (top - initialTop) >= HORNS_TRIGGER) {
      hornShown = true;
      horns.classList.add('line-only-horns--visible');
      completeTask();
    }
  }

  function onDown(e) {
    dragging = true;
    startY = e.clientY;
    startTop = top;
    block.setPointerCapture && block.setPointerCapture(e.pointerId);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    var dy = e.clientY - startY;
    setTop(startTop + dy);
  }

  function onUp() {
    dragging = false;
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
  }

  block.addEventListener('pointerdown', onDown);
  if (floatImg) {
    floatImg.addEventListener('animationend', failTask);
  }
  if (floatImgLeft) {
    floatImgLeft.addEventListener('animationend', failTask);
  }
  syncFloatTimings();
  window.addEventListener('resize', syncFloatTimings);
  setTop(top);
})();
