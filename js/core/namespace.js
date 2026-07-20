(() => {
  'use strict';
  const root = window.OWL = window.OWL || {};
  root.version = root.version || '0.2.0';
  root.modules = root.modules || {};
  root.register = (name, value) => {
    if (!name || root.modules[name]) throw new Error(`OWL-Modul bereits registriert oder ungültig: ${name}`);
    root.modules[name] = value;
    return value;
  };
})();
