const commander = require('commander');
const assert = require('assert');
const { resolveSignature, isTruthy } = require('../utils');
const Man = require('./Man');

module.exports.init = function init (app) {
  commander.version(app.version);
  
  const mans = app.commands.map(((command) => Man.load(command.name, command.path)));
  for (const man of mans) {
    const command = commander
      .command(man.getNameAndArgs())
      .description(man.getDescription())
      .action(man.getAction());

    if (man.options) { 
      man.options.forEach((option) => {
        command.option(...option);
      });
    }
  }

  commander.parse(process.argv);
}

// We could also spawn the command but who care. I want to have fun
module.exports.cmd = function cmd (...args) {
  assert(args.length, 'cmd need arguments');
  assert(args.length || !args.length < 3, `
    wrong cmd usage. cmd must use one of these signatures: [
      cmd(name), 
      cmd(name, argument), 
      cmd(name, argument, options)
    ]`
  );
  const { cmdName, cmdArg, cmdOptions } = resolveSignature(['cmdName', 'cmdArg|cmdOptions', 'cmdOptions'], args);
  const cmdOptionsList = cmdOptions 
    ? Object.entries(cmdOptions).flatMap(v => v)
    : [];

  const cmdArgv = [cmdName, cmdArg, ...cmdOptionsList].filter(isTruthy);
  return commander.parse([...process.argv.slice(0, 2), ...cmdArgv]);
}
