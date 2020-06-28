module.exports.replace = function replace (target, replacer) {
  return Object.entries(replacer).reduce((res, [search, replaceBy]) => {
    return res.replace(new RegExp(escapeRegExp(search), 'g'), replaceBy);
  }, target);
}

module.exports.countOccurrence = function countOccurrence (target, search) {
  let count = 0;
  let fromIndex = 0;
  while ((fromIndex = target.indexOf(search, fromIndex)) !== -1) {
    count++;
  }
  return count;
}

function escapeRegExp (string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}