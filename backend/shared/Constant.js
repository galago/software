class Constant {
  constructor(constants, constantsTitle) {
    this.constants = constants;
    this.constantsTitle = constantsTitle;
  }
  get(constName) {
    if (this.constants[constName] != null) {
      return this.constants[constName];
    }
    let errMsg = `ERROR: const ${constName} doesn't exist`;
    errMsg = this.constantsTitle ? errMsg + ` in constants ${this.constantsTitle}` : errMsg;
    console.error('\x1b[31m', errMsg, '\x1b[0m');
    throw errMsg;
  }
}

module.exports = Constant;
