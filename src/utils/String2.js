module.exports.replace = function replace (target, replacer) {
  return Object.entries(replacer).reduce((res, [search, replaceBy]) => {
    return res.replace(new RegExp(search, 'g'), replaceBy);
  }, target);
}