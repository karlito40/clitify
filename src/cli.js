const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const { String2 } = require('./utils');
const { Man, Commander, Section } = require('./libs');

const COMMAND_DELIMITER = ':';

module.exports = function cli (workingDir) {
  process.chdir(workingDir);

  const COMMAND_DIR = path.join(process.cwd(), 'commands');
  const commandPaths = glob.sync('**/*.js', { cwd: COMMAND_DIR });

  const operations = [];
  const sections = {};
  commandPaths.forEach((commandPath) => {
    const commandName = String2.replace(commandPath, {
      [path.sep]: COMMAND_DELIMITER,
      '.js': ''
    });

    const lastDelimiter = commandName.lastIndexOf(COMMAND_DELIMITER);
    const sectionId = lastDelimiter !== -1 ? commandName.substring(0, lastDelimiter) : commandName;
    if (sectionId && !sections[sectionId]) {
      const section = Section(_.startCase(sectionId));
      // section.on('select', () => Man.exec('default'));
      sections[sectionId] = section;

      operations.push(section);
    }
    
    if (commandPath.includes('__section__')) {
      return sections[sectionId] = require(`${COMMAND_DIR}/${commandPath}`);
    }
    
    if (commandName.includes('.default')) {
      // Add default command ("namespace:cmd.default“ will be resolve to "namespace")
      if (sectionId) {
        operations.push(Man.load(sectionId, `${COMMAND_DIR}/${commandPath}`));
      }
      // Remove default extension ("namespace:cmd.default“ will be resolve to "namespace:cmd")
      operations.push(Man.load(commandName.replace('.default', ''), `${COMMAND_DIR}/${commandPath}`));
    } else {
      operations.push(Man.load(commandName, `${COMMAND_DIR}/${commandPath}`));
    }
  });

  Commander.init('0.0.1', operations);
}

