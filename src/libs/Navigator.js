const inquirer = require('inquirer');
const assert = require('assert');
const Man = require('./Man');
const { _Section } = require('./Section');
const { _Commands } = require('./Commands');

const isString = (s) => typeof s === 'string';

module.exports = class Navigator {
  static init (app, welcomeMessage = 'Deep dive into the abyss') {
    const nav = new Navigator(app);
    nav.showTableOfContents(app.config.tableOfContents, welcomeMessage);
    return nav;
  }

  constructor (app) {
    this.app = app;
  }

  showTableOfContents (contents, message) {
    assert(contents, 'No content found');

    const choices = [];
    contents.forEach((content) => {
      if (content instanceof _Section) {
        choices.push(this.buildSection(content));
      } else if (content instanceof _Commands) {
        const commandChoices = this.buildCommands(content);
        assert(commandChoices.length, `No commands match ${content}`);
        choices.push(...commandChoices);
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

  buildSection (section) {
    return {
      name: section.title,
      value: () => this.showTableOfContents(section.childrens, section.title)
    };
  }

  buildCommands (commands) {
    const commandsToDisplay = getDisplayableCommands(this.app.commands, commands.matchers);
    return commandsToDisplay.map((command) => {
      const man = Man.load(command.name, command.path);
      return {
        name: man.getDescription(),
        value: man.getAction()
      }
    });
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
    const hasSameDepth = matcherDepth === Math.max(commandDepth - 1, 1);
    const isMatching = command.name.includes(matcher);
    return hasSameDepth && isMatching;
  });
}
