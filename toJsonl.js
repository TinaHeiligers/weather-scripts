const fs = require('file-system')
const moment = require('moment')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2017.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2017.json"));

const openedDataForDailyFile = fs.openSync("./data/daily_data_2017.jsonl", "w");

function convertTimeFromUnixToISO8600(unixTime, offset) {
  return moment.unix((unixTime) - (offset * 3600)).toISOString()
};

// TODO: make transformations to the element's elements here.
const arrayOfConvertedDailyDataForYear = dataFileRead.map((element, index) => {
  for (const property in element.daily.data[0]) {
    if (property === "time") {
      element.daily.data[0][property] = convertTimeFromUnixToISO8600(element.daily.data[0][property], 7)
    } else if (property.endsWith('Time')) {
      element.daily.data[0][property] = convertTimeFromUnixToISO8600(element.daily.data[0][property], 7)
    }
  }
  const dailyExtractedData = {
    ...element.currently,
    nearest_station: element.flags["nearest-station"],
    latitude: element.latitude,
    longitude: element.longitude,
    sources: element.flags.sources,
    timezone: element.timezone,
    ...element.daily.data[0]
  }
  // delete the time key since we now have a date key
  delete dailyExtractedData.time;
  fs.writeSync(openedDataForDailyFile, JSON.stringify(dailyExtractedData) + '\n');
  return dailyExtractedData;
});

fs.closeSync(openedDataForDailyFile);

