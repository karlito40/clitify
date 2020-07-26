const { inspect } = require('util');

const Commands = (...args) => new _Commands(...args);

class _Commands {
  constructor (...matchers) {
    this.matchers = matchers;
  }

  toString () {
    return inspect(this);
  }
}

module.exports = Commands;
module.exports._Commands = _Commands;