const Section = (...args) => new _Section(...args);

class _Section {
  constructor (title, childrens /* : [Section, Commands] */) {
    this.title = title;
    this.childrens = childrens; 
  }
}

module.exports = Section;
module.exports._Section = _Section;

