const { Man } = require('clitify');

// Should be resolve by JSDoc
Man('<service>', 'Upload un schema vers apollo')
  .option('--i', 'interactive', 'Do some interactive stuff')
  .option('--t', 'toto <name>', 'Do some toto stuff');

module.exports = function pull (/* service, { interactive, toto }*/) {
  console.log('> pull called');
  // Text('tooto');
  // SmoothText('tooto');
  // await Prompt('tooto');
}
