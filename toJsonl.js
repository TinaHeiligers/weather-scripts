const fs = require('file-system')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2020.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2020.json"));

const openedDataFile = fs.openSync("./data/data_2020.jsonl", "w");

dataFileRead.forEach((element, index) => {
  // TODO: make transformations to the element's elements here.


  fs.writeSync(openedDataFile, JSON.stringify(element) + '\n')
});
fs.closeSync(openedDataFile);
