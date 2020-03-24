const fs = require('file-system')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2020.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2020.json"));

const openedDataFile = fs.openSync("./data/data_2020.jsonl", "w");

dataFileRead.forEach((element, index) => {
  // TODO: make transformations to the element's elements here.

  element.date = dateFileRead[index];

  element.date = dateFileRead[index];
  element.currently.time = String(element.currently.time * 1000);
  element.daily.data[0].apparentTemperatureHighTime = String(element.daily.data[0].apparentTemperatureHighTime * 1000);
  element.daily.data[0].apparentTemperatureLowTime = String(element.daily.data[0].apparentTemperatureLowTime * 1000);
  element.daily.data[0].apparentTemperatureMaxTime = String(element.daily.data[0].apparentTemperatureMaxTime * 1000);
  element.daily.data[0].apparentTemperatureMinTime = String(element.daily.data[0].apparentTemperatureMinTime * 1000);
  element.daily.data[0].precipIntensityMaxTime = String(element.daily.data[0].precipIntensityMaxTime * 1000);
  element.daily.data[0].sunriseTime = String(element.daily.data[0].sunriseTime * 1000);
  element.daily.data[0].sunsetTime = String(element.daily.data[0].sunsetTime * 1000);
  element.daily.data[0].temperatureHighTime = String(element.daily.data[0].temperatureHighTime * 1000);
  element.daily.data[0].temperatureLowTime = String(element.daily.data[0].temperatureLowTime * 1000);
  element.daily.data[0].temperatureMaxTime = String(element.daily.data[0].temperatureMaxTime * 1000);
  element.daily.data[0].temperatureMinTime = String(element.daily.data[0].temperatureMinTime * 1000);
  element.daily.data[0].time = String(element.daily.data[0].time * 1000);
  element.daily.data[0].uvIndexTime = String(element.daily.data[0].uvIndexTime * 1000);
  element.daily.data[0].windGustTime = String(element.daily.data[0].windGustTime * 1000);
  element.hourly.data.forEach(item => item.time = String(item.time * 1000));
  fs.writeSync(openedDataFile, JSON.stringify(element) + '\n')
});
fs.closeSync(openedDataFile);
