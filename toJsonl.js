const fs = require('file-system')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2012.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2012.json"));

const openedDataFile = fs.openSync("./data/data_2012.jsonl", "w");


// TODO: make transformations to the element's elements here.
const arrayOfConvertedData = dataFileRead.map((element, index) => {
  // the element is an object
  const convertedDataItem = {
    ...element,
    date: dateFileRead[index],
    currently: {
      ...element.currently,
      time: element.currently.time * 1000,
    },
    daily: {
      ...element.daily,
      data: element.daily.data[0],
      data: {
        ...element.daily.data[0],
        apparentTemperatureHighTime: element.daily.data[0].apparentTemperatureHighTime * 1000,
        apparentTemperatureLowTime: element.daily.data[0].apparentTemperatureLowTime * 1000,
        apparentTemperatureMaxTime: element.daily.data[0].apparentTemperatureMaxTime * 1000,
        apparentTemperatureMinTime: element.daily.data[0].apparentTemperatureMinTime * 1000,
        precipIntensityMaxTime: element.daily.data[0].precipIntensityMaxTime * 1000,
        sunriseTime: element.daily.data[0].sunriseTime * 1000,
        sunsetTime: element.daily.data[0].sunsetTime * 1000,
        temperatureHighTime: element.daily.data[0].temperatureHighTime * 1000,
        temperatureLowTime: element.daily.data[0].temperatureLowTime * 1000,
        temperatureMaxTime: element.daily.data[0].temperatureMaxTime * 1000,
        temperatureMinTime: element.daily.data[0].temperatureMinTime * 1000,
        time: element.daily.data[0].time * 1000,
        uvIndexTime: element.daily.data[0].uvIndexTime * 1000,
        windGustTime: element.daily.data[0].windGustTime * 1000,
      }
    },
    hourly: {
      data: element.hourly.data.map(item => item.time = item.time * 1000)
    }
  }
  fs.writeSync(openedDataFile, JSON.stringify(convertedDataItem) + '\n')
  return convertedDataItem;
});

fs.closeSync(openedDataFile);
