const fs = require('fs');

module.exports.read = function(file) {
  try {
    return fs.readFileSync(file).toString();
  } catch (error) {
    console.log(`Cannot read file: ${file}.`);
    return '';
  }
}

module.exports.write = function(file, content) {
  try {
    fs.writeFileSync(file, content);
  } catch (error) {
    console.log(`Cannot write file: ${file} = ${content}.`);
  }
}