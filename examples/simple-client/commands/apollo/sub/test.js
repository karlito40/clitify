const { Man } = require('cliver');

Man('<service>', 'Apollo Sub Method Test');

module.exports = function test () {
  console.log('> test called');
}
