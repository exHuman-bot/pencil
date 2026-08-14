(function () {
  var STORAGE_KEY = 'questKeyParts';
  var ORDER = ['trap1', 'trap2', 'trap3', 'trap4'];

  function read() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function write(parts) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
  }

  window.QuestKey = {
    order: ORDER,
    addFragment: function (id, value) {
      var parts = read();
      parts[id] = value;
      write(parts);
    },
    getParts: function () {
      return read();
    },
    getFull: function () {
      var parts = read();
      return ORDER.map(function (id) {
        return parts[id] || '';
      }).join('');
    },
    reset: function () {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };
})();
