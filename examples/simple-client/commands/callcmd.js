const { cmd } = require('cliver');

module.exports = function () {
  console.log('> toto');
  console.log('...calling apollo:push command...');
  cmd('apollo:pull', 'blabla', {
    '-e': 'My engine', 
    '-i': true
  });
}