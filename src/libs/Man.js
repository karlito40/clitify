class _Man {
  constructor (name, argsDescriptor, description = 'TODO===') {
    this.name = name;
    this.argsDescriptor = argsDescriptor;
    this.description = description;
    this.options = [];
    this.handler = () => console.log('No action found');
  }

  action (handler) {
    this.handler = handler;
  }

  option (...args) {
    this.options.push(args);
    return this;
  }

  setArgsDescriptor (argsDescriptor) {
    this.argsDescriptor = argsDescriptor;
    return this;
  }

  setDescription (description) { 
    this.description = description;
    return this;
  }

  getNameAndArgs () {
    const nameAndArgs = [this.name];
    if (this.argsDescriptor) {
      nameAndArgs.push(this.argsDescriptor);
    }

    return nameAndArgs.join(' ');
  }

  getDescription () { return this.description; }
  getAction () { return this.handler; }
}

const _mans = {};

function Man (...args) {
  const acceptedArgs = args.length === 2 ? args[0] : null;
  const description = args[args.length - 1];

  return Man.current
    .setArgsDescriptor(acceptedArgs)
    .setDescription(description);
}

Man.select = (commandName) => {
  if (!_mans[commandName]) {
    _mans[commandName] = new _Man(commandName);
  }

  Man.current = _mans[commandName];
  return _mans[commandName];
}

Man.load = (commandName, path) => {
  const man = Man.select(commandName);
  // Users may not export a function to rather use
  // the man.action() method directly inside the given file.
  delete require.cache[path];
  const handler = require(path);
  if (typeof handler === 'function') {
    man.action(handler);
  }
  
  return man;
}

module.exports = Man;
module.exports._Man = _Man;