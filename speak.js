const speak = words => {
  var exec = require('child_process').exec;
  exec(`espeak -s 100 -a 200 "${words}"`);
};

module.exports = {
  speak,
}
