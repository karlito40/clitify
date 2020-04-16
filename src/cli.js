const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const { String2 } = require('./utils');
const { Commander, Navigator } = require('./libs');

const COMMAND_DELIMITER = ':';

module.exports = function cli (workingDir, welcomeMessage) {
  process.chdir(workingDir);

  const COMMAND_DIR = path.join(process.cwd(), 'commands');
  
  const config = {
    tableOfContents: [],
    ...require(path.join(process.cwd() + '/clitify.config.js'))
  };

  const app = {
    version: '0.0.1',
    commandDir: COMMAND_DIR,
    commands: [],
    config
  };

  const commandPaths = glob.sync('**/*.js', { cwd: COMMAND_DIR });
  app.commands = commandPaths.map((commandPath) => {
    const commandName = String2.replace(commandPath, {
      [path.sep]: COMMAND_DELIMITER,
      '.js': ''
    });

    return {
      path: `${COMMAND_DIR}/${commandPath}`,
      name: commandName,
    }
  });
  
  const args = process.argv.slice(2);
  if (args.length) {
    Commander.init(app);
  } else {
    Navigator.init(app, welcomeMessage);
  }
}