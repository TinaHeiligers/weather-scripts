const fs = require('file-system')
const fileRead = JSON.parse(fs.readFileSync("./data/data_2020.json"));

const openedFile = fs.openSync("./data/data_2020.jsonl", "w");
fileRead.forEach(element => {
  // TODO: make transformations to the element's elements here.
  fs.writeSync(openedFile, JSON.stringify(element) + '\n')
});
fs.closeSync(openedFile);
