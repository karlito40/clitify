module.exports = function resolveSignature(argNames, args = []) {
  const transformer = {};
  for (const [index, arg] of args.entries()) {
    const argName = argNames[index];
    if (!argName) break;

    const [defaultArgName, fallbackArgName] = argName.split('|');
    if (fallbackArgName && index === args.length - 1) {
      transformer[fallbackArgName] = arg;
    } else {
      transformer[defaultArgName] = arg;
    }
  }
    
  return transformer;
}