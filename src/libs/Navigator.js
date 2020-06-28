const inquirer = require('inquirer');
const assert = require('assert');
const Man = require('./Man');

const isString = (s) => typeof s === 'string';

module.exports = class Navigator {
  static init (app, welcomeMessage = 'Deep dive into the abyss') {
    const nav = new Navigator(app);
    nav.showSectionContents(app.config.tableOfContents, welcomeMessage);
    return nav;
  }

  constructor (app) {
    this.app = app;
  }

  showSectionContents (contents, message) {
    assert(contents, 'No content found');

    const choices = [];
    contents.forEach((section) => {
      if (section.title) {
        choices.push({
          name: section.title,
          value: () => this.showSectionContents(section.contents, section.title)
        });
      }
  
      if (section.commands) {
        const commandsToDisplay = getDisplayableCommands(this.app.commands, section.commands);
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
}

function getDisplayableCommands (commands, matchers) {
  matchers = isString(matchers) ? [matchers] : matchers;
  return matchers.reduce((acc, matcher) => {
    return [...acc, ...getDisplayableCommandsFromMatcher(commands, matcher)];
  }, [])
}

function getDisplayableCommandsFromMatcher (commands, matcher) {
  const matcherDepth = matcher.split(':').length;
  if (!matcherDepth) {
    return [];
  }

  return commands.filter((command) => {
    const commandDepth = command.name.split(':').length;
    // commandDepth need to be subtract by 1 to ignore the method name from the command
    const hasSameDepth = matcherDepth === commandDepth - 1;
    const isMatching = command.name.includes(matcher);
    return hasSameDepth && isMatching;
  });
}
