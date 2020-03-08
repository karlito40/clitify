const inquirer = require('inquirer');
const minimatch = require('minimatch');
const Man = require('./Man');

const isString = (s) => typeof s === 'string';
const isObject = (s) => typeof s === 'object';

module.exports.init = init;

function init (app, message = 'Welcome in your fucking cli') {
  let matters = app.config.tableOfContents;
  if (app.currentSection) {
    const section = app.config.tableOfContents
      .flat(Infinity)
      .find((matter) => (isObject(matter) && matter.label === app.currentSection));

    matters = section.childrens;
  }

  const choices = [];

  matters.forEach((matter) => {
    if (isObject(matter)) {
      choices.push({
        name: matter.label,
        value: () => {
          app.currentSection = matter.label;
          init(app, matter.label);
        }
      });
    } else {
      const commandsToDisplay = getDisplayableCommands(app.commands, matter);
      choices.push(...commandsToDisplay.map((command) => {
        const man = Man.load(command.name, command.path);
        return {
          name: man.getDescription(),
          value: man.getAction()
        }
      }));
    }
  });

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message,
      choices
    }
  ]).then(({ action }) => action());
}

function getDisplayableCommands (commands, matcher) {
  return commands.filter((command) => {
    return minimatch(command.name, matcher);
  });
}
// const currentDepth = String2.countOccurrence(app.currentSection);

// const commandsToDisplay = app.commands.filter(({ command }) => {
//   const commandDepth = String2.countOccurrence(command.name);
//   const hasSameRoot = command.name.startsWith(app.currentSection);
//   const atSameDepth = currentDepth === commandDepth;

//   return hasSameRoot && atSameDepth && matter.commands.some((commandMatcher) => {
//     return minimatch(command.name, commandMatcher);
//   });
// });