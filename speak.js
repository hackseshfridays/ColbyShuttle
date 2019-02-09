const speak = words => {
  var exec = require('child_process').exec;
  exec(`espeak -v mb-en1 -s 100 -a 200 "${words}"`);
};

module.exports = {
  speak,
}
