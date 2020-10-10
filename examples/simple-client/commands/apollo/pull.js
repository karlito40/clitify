const { Man } = require('cliver');

// Should be resolved by JSDoc
Man('<service>', 'Upload un schema vers apollo')
  .option('-i, --interactive', 'Do some interactive stuff')
  .option('-e, --engine <engine>', 'Apollo Engine stuff');

module.exports = function pull (service, { engine, interactive }) {
  console.log('> pull called');
  console.log('service:', service);
  console.log('engine:', engine);
  console.log('interactive:', interactive);
}
