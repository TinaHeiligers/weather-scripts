const fs = require('file-system')
const moment = require('moment')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2010.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2010.json"));

// const openedDataForCurrentlyFile = fs.openSync("./data/currently_data_2010.jsonl", "w");
// const openedDataForDailyFile = fs.openSync("./data/daily_data_2010.jsonl", "w");
// const openedDataForHourlyFile = fs.openSync("./data/hourly_data_2010.jsonl", "w");
function convertTimeFromUnixToISO8600(unixTime, offset) {
  return moment.unix((unixTime) - (offset * 3600)).toISOString()
};

function farenheitToCelsius(temp) {
  convertedTemp = (((temp - 32) * 5) / 9);
  return convertedTemp.toFixed(2);
};
// TODO: make transformations to the element's elements here.
const arrayOfConvertedDailyDataForYear = dataFileRead.map((element, index) => {
  const currentlyExtractedData = {
    ...element.currently,
    timezone: element.timezone,
    offset: element.offset,
    nearest_station: element["nearest-station"],
    units: element.units,
    latitude: element.latitude,
    longitude: element.longitude,
    sources: element.flags.sources,
  };
  const dailyExtractedData = {
    ...element.daily.data[0],
    date: convertTimeFromUnixToISO8600(element.daily.data[0].time, 7),
    temperatureHigh: farenheitToCelsius(element.daily.data[0].temperatureHigh),
    temperatureLow: farenheitToCelsius(element.daily.data[0].temperatureLow),
    apparentTemperatureHigh: farenheitToCelsius(element.daily.data[0].apparentTemperatureHigh),
    apparentTemperatureLow: farenheitToCelsius(element.daily.data[0].apparentTemperatureLow),
    temperatureMin: farenheitToCelsius(element.daily.data[0].temperatureMin),
    temperatureMax: farenheitToCelsius(element.daily.data[0].temperatureMax),
    apparentTemperatureMin: farenheitToCelsius(element.daily.data[0].apparentTemperatureMin),
    apparentTemperatureMax: farenheitToCelsius(element.daily.data[0].apparentTemperatureMax),
    sunriseTime: convertTimeFromUnixToISO8600(element.daily.data[0].sunriseTime, 7),
    sunsetTime: convertTimeFromUnixToISO8600(element.daily.data[0].sunsetTime, 7),
    precipIntensityMaxTime: convertTimeFromUnixToISO8600(element.daily.data[0].precipIntensityMaxTime, 7),
    temperatureHighTime: convertTimeFromUnixToISO8600(element.daily.data[0].temperatureHighTime, 7),
    temperatureLowTime: convertTimeFromUnixToISO8600(element.daily.data[0].temperatureLowTime, 7),
    apparentTemperatureHighTime: convertTimeFromUnixToISO8600(element.daily.data[0].apparentTemperatureHighTime, 7),
    apparentTemperatureLowTime: convertTimeFromUnixToISO8600(element.daily.data[0].apparentTemperatureLowTime, 7),
    uvIndexTime: convertTimeFromUnixToISO8600(element.daily.data[0].uvIndexTime, 7),
    temperatureMinTime: convertTimeFromUnixToISO8600(element.daily.data[0].temperatureMinTime, 7),
    temperatureMaxTime: convertTimeFromUnixToISO8600(element.daily.data[0].temperatureMaxTime, 7),
    apparentTemperatureMinTime: convertTimeFromUnixToISO8600(element.daily.data[0].apparentTemperatureMinTime, 7),
    apparentTemperatureMaxTime: convertTimeFromUnixToISO8600(element.daily.data[0].apparentTemperatureMaxTime, 7)
  }
  // delete the time key since we now have a date key
  delete dailyExtractedData.time;
  console.log('dailyExtractedData', dailyExtractedData)
  // the element is an object
  // const convertedDataItem = {
  //   ...element,
  //   date: dateFileRead[index],
  //   currently: element.currently,
  //   // only the objects inside the array (one record for each day)
  //   daily: element.daily.data[0],
  //   // returns an array of objects (multiple records for each day)
  //   hourly: {
  //     data: element.hourly.data
  //   },

  // }
  // const dailyDataEntries = { ...convertedDataItem.daily };
  // const hourlyDataEntries = { ...convertedDataItem.hourly.data };
  // console.log('hourlyDataEntries[0]', hourlyDataEntries[0])
  // delete convertedDataItem.daily;
  // delete convertedDataItem.hourly;
  // fs.writeSync(openedDataForCurrentlyFile, JSON.stringify(convertedDataItem) + '\n')
  // fs.writeSync(openedDataForDailyFile, JSON.stringify(dailyDataEntries) + '\n');
  // fs.writeSync(openedDataForHourlyFile, JSON.stringify(hourlyDataEntries) + '\n');
  // return convertedDataItem;
});

// fs.closeSync(openedDataForCurrentlyFile);
// fs.closeSync(openedDataForDailyFile);
// fs.closeSync(openedDataForHourlyFile);

