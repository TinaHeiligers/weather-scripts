const fs = require('file-system')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2019.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2019.json"));

dataFileRead.forEach((element, index) => {
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
  if (index === 0) {
    console.log('element', element)
    console.log("element.currently.time", element.currently.time)
    console.log("element.currently.time", element.currently.time)
    console.log("element.daily.data[0].apparentTemperatureHighTime", element.daily.data[0].apparentTemperatureHighTime)
    console.log("element.daily.data[0].apparentTemperatureLowTime", element.daily.data[0].apparentTemperatureLowTime)
    console.log("element.daily.data[0].apparentTemperatureMaxTime", element.daily.data[0].apparentTemperatureMaxTime)
    console.log("element.daily.data[0].apparentTemperatureMinTime", element.daily.data[0].apparentTemperatureMinTime)
    console.log("element.daily.data[0].precipIntensityMaxTime", element.daily.data[0].precipIntensityMaxTime)
    console.log("element.daily.data[0].sunriseTime", element.daily.data[0].sunriseTime)
    console.log("element.daily.data[0].sunsetTime", element.daily.data[0].sunsetTime)
    console.log("element.daily.data[0].temperatureHighTime", element.daily.data[0].temperatureHighTime)
    console.log("element.daily.data[0].temperatureLowTime", element.daily.data[0].temperatureLowTime)
    console.log("element.daily.data[0].temperatureMaxTime", element.daily.data[0].temperatureMaxTime)
    console.log("element.daily.data[0].temperatureMinTime", element.daily.data[0].temperatureMinTime)
    console.log("element.daily.data[0].time", element.daily.data[0].time)
    console.log("element.daily.data[0].uvIndexTime", element.daily.data[0].uvIndexTime)
    console.log("element.daily.data[0].windGustTime", element.daily.data[0].windGustTime)
    element.hourly.data.forEach(item => item.time = console.log(item.time))
  }
  // fs.writeSync(openedDataFile, JSON.stringify(element) + '\n')
});
// fs.closeSync(openedDataFile);
