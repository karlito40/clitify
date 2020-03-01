class _Section {
  constructor (label, action) {
    this.label = label;
    this.action = action;
  }

  setAction (action) {
    this.action = action;
  }
}

module.exports = (...args) => new _Section(...args);
module.exports._Section = _Section;