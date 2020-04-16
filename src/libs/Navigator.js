const inquirer = require('inquirer');
const minimatch = require('minimatch');
const Man = require('./Man');

const isObject = (s) => typeof s === 'object';

module.exports = class Navigator {
  static init (app, title) {
    const nav = new Navigator(app);
    nav.showTableOfContents(app.config.tableOfContents, title);
    return nav;
  }

  constructor (app) {
    this.app = app;
  }

  showTableOfContents (tableOfContents, title) {
    const choices = [];
    tableOfContents.forEach((section) => {
      if (isObject(section)) {
        choices.push({
          name: section.label,
          value: () => this.showTableOfContents(section.tableOfContents, section.label)
        });
      } else {
        // On utilise une chaine magique du style "apollo:*"
        // pour lister toutes les commandes d'un repertoire
        const commandsToDisplay = getDisplayableCommands(this.app.commands, section);
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
        message: title,
        choices
      }
    ]).then(({ action }) => action());
  }
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