const { Section, Commands } = require('clitify');

module.exports = [
  Section('👽   Back', [
    Section('👽👽   Sub Section 1 with unknown commands should throw error', [
      Commands('apollo:toto')
    ]),
    Section('👽👽   Sub Section 2 (ok)', [
      Commands('apollo', 'apollo:sub')
    ]),
  ]),

  Section('Front', [
    Commands('toto')
  ])
]; 
