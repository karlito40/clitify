const commander = require('commander');
const { _Man } = require('./Man');

module.exports.init = function init (version, operations) {
  commander.version(version);
  
  const mans = operations.filter((op) => op instanceof _Man);
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