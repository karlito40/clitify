const commander = require('commander');
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
      Object.values(man.options).forEach((option) => {
        command.option(...option);
      });
    }
  }

  commander.parse(process.argv);
}